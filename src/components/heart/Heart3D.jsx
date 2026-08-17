import { Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import heartUrl from '../../assets/models/heart.glb?url';
import './heart.css';

const VENTRICULAR_START = 0.12;
const VENTRICULAR_END = 0.45;

// Y original (coordenadas del modelo) donde empiezan los grandes vasos esculpidos.
const VESSEL_NECK_Y = 1.35;

function beatScale(cycle, depth) {
  if (cycle >= VENTRICULAR_START && cycle <= VENTRICULAR_END) {
    const t = (cycle - VENTRICULAR_START) / (VENTRICULAR_END - VENTRICULAR_START);
    return 1 - depth * Math.sin(t * Math.PI);
  }
  if (cycle > VENTRICULAR_END && cycle <= 0.62) {
    const t = (cycle - VENTRICULAR_END) / (0.62 - VENTRICULAR_END);
    return 1 + depth * 0.4 * Math.sin(t * Math.PI);
  }
  return 1;
}

// Elimina los grandes vasos esculpidos del modelo, conservando todos los atributos.
function removeGreatVessels(geometry) {
  const pos = geometry.attributes.position;
  const index = geometry.index;
  const attrNames = Object.keys(geometry.attributes);
  const itemSizes = {};
  attrNames.forEach((n) => { itemSizes[n] = geometry.attributes[n].itemSize; });

  const triCount = index ? index.count / 3 : pos.count / 3;
  const keptVerts = [];
  for (let t = 0; t < triCount; t++) {
    const a = index ? index.getX(t * 3) : t * 3;
    const b = index ? index.getX(t * 3 + 1) : t * 3 + 1;
    const c = index ? index.getX(t * 3 + 2) : t * 3 + 2;
    const cy = (pos.getY(a) + pos.getY(b) + pos.getY(c)) / 3;
    if (cy > VESSEL_NECK_Y) continue;
    keptVerts.push(a, b, c);
  }

  const newAttrs = {};
  attrNames.forEach((n) => { newAttrs[n] = []; });
  for (const vi of keptVerts) {
    for (const name of attrNames) {
      const attr = geometry.attributes[name];
      const arr = attr.array;
      const base = vi * itemSizes[name];
      for (let k = 0; k < itemSizes[name]; k++) {
        newAttrs[name].push(arr[base + k]);
      }
    }
  }

  const g = new THREE.BufferGeometry();
  for (const name of attrNames) {
    const Ctor = geometry.attributes[name].array.constructor;
    g.setAttribute(name, new THREE.BufferAttribute(new Ctor(newAttrs[name]), itemSizes[name]));
  }

  const newIndex = new Uint32Array(keptVerts.length);
  for (let i = 0; i < keptVerts.length; i++) newIndex[i] = i;
  g.setIndex(newIndex);
  return g;
}

// Flujo sanguíneo: flecha de dirección + partículas pequeñas y planas (no tubos).
function Flow({ points, color, count = 6, speed = 0.25, radius = 0.05, bpm, phaseRef }) {
  const meshes = useRef([]);
  const accum = useRef(0);
  const curve = useMemo(
    () => new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p))),
    [points]
  );

  const arrow = useMemo(() => {
    const pos = curve.getPointAt(0.03);
    const tan = curve.getTangentAt(0.03).normalize();
    const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), tan);
    return { pos, quat };
  }, [curve]);

  useFrame((state, delta) => {
    const beatMs = 60000 / (bpm || 75);
    const surge = 1 + 1.5 * (phaseRef?.current || 0);
    accum.current += (delta / beatMs) * speed * surge;
    const t = accum.current % 1;
    meshes.current.forEach((m, i) => {
      if (!m) return;
      const u = (t + i / count) % 1;
      m.position.copy(curve.getPointAt(u));
    });
  });

  return (
    <group>
      {Array.from({ length: count }).map((_, i) => (
        <mesh
          key={i}
          ref={(el) => {
            meshes.current[i] = el;
          }}
        >
          <sphereGeometry args={[radius, 8, 8]} />
          <meshBasicMaterial color={color} />
        </mesh>
      ))}
      <mesh position={arrow.pos} quaternion={arrow.quat}>
        <coneGeometry args={[radius * 2.5, radius * 5, 8]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
}

function HeartScene({ bpm, depth, irregular, onLub, onDub }) {
  const { scene } = useGLTF(heartUrl);

  const cleaned = useMemo(() => {
    scene.traverse((o) => {
      if (o.isMesh && o.geometry && o.geometry.attributes && o.geometry.attributes.position && !o.userData._vesselsRemoved) {
        o.geometry = removeGreatVessels(o.geometry);
        o.userData._vesselsRemoved = true;
      }
    });
    return scene;
  }, [scene]);

  const innerRef = useRef();
  const paramsRef = useRef({ bpm, depth, irregular });
  const callbacksRef = useRef({ onLub, onDub });
  const prevPhaseRef = useRef(0);
  const phaseRef = useRef(0);

  useEffect(() => {
    paramsRef.current = { bpm, depth, irregular };
  }, [bpm, depth, irregular]);

  useEffect(() => {
    callbacksRef.current = { onLub, onDub };
  }, [onLub, onDub]);

  const norm = useMemo(() => {
    const bb = new THREE.Box3().setFromObject(cleaned);
    const center = bb.getCenter(new THREE.Vector3());
    const size = bb.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const s = 4 / maxDim;
    return { center, s, half: size.clone().multiplyScalar(s / 2) };
  }, [cleaned]);

  useFrame((state) => {
    const p = paramsRef.current;
    const beatMs = 60000 / p.bpm;
    const elapsed = state.clock.elapsedTime * 1000;

    let cycle = (elapsed / beatMs) % 1;
    if (p.irregular) {
      const jitter = Math.sin(elapsed / 180) * 0.05 + Math.sin(elapsed / 97) * 0.03;
      cycle = (cycle + jitter + 1) % 1;
    }

    const d = Math.min(Math.max(p.depth, 0.04), 0.25) * 0.25;
    if (innerRef.current) {
      innerRef.current.scale.setScalar(beatScale(cycle, d));
    }

    phaseRef.current =
      cycle >= VENTRICULAR_START && cycle <= VENTRICULAR_END
        ? Math.sin(((cycle - VENTRICULAR_START) / (VENTRICULAR_END - VENTRICULAR_START)) * Math.PI)
        : 0;

    const prev = prevPhaseRef.current;
    if (prev < VENTRICULAR_START && cycle >= VENTRICULAR_START) {
      callbacksRef.current.onLub?.();
    }
    if (prev < VENTRICULAR_END && cycle >= VENTRICULAR_END) {
      callbacksRef.current.onDub?.();
    }
    prevPhaseRef.current = cycle;
  });

  const h = norm.half;
  const RED = '#ef4444';
  const BLUE = '#3b82f6';

  const flows = [
    {
      key: 'aorta', color: RED, radius: 0.15, count: 14, speed: 0.25,
      points: [
        [-0.42 * h.x, 0.95 * h.y, 0.08 * h.z],
        [-0.40 * h.x, 1.05 * h.y, 0.02 * h.z],
        [-0.55 * h.x, 1.10 * h.y, -0.12 * h.z],
        [-0.85 * h.x, 0.95 * h.y, -0.28 * h.z],
        [-1.05 * h.x, 0.55 * h.y, -0.40 * h.z],
        [-1.10 * h.x, -0.10 * h.y, -0.42 * h.z],
      ],
    },
    {
      key: 'pulmIzq', color: BLUE, radius: 0.12, count: 8, speed: 0.28,
      points: [
        [0.06 * h.x, 0.95 * h.y, -0.10 * h.z],
        [0.05 * h.x, 1.05 * h.y, -0.15 * h.z],
        [-0.10 * h.x, 1.10 * h.y, -0.28 * h.z],
        [-0.30 * h.x, 1.12 * h.y, -0.40 * h.z],
      ],
    },
    {
      key: 'pulmDer', color: BLUE, radius: 0.12, count: 8, speed: 0.28,
      points: [
        [0.06 * h.x, 0.95 * h.y, -0.10 * h.z],
        [0.05 * h.x, 1.05 * h.y, -0.15 * h.z],
        [0.30 * h.x, 1.08 * h.y, -0.25 * h.z],
        [0.55 * h.x, 1.10 * h.y, -0.35 * h.z],
      ],
    },
    {
      key: 'vcs', color: BLUE, radius: 0.13, count: 9, speed: 0.2,
      points: [
        [0.32 * h.x, 1.25 * h.y, -0.35 * h.z],
        [0.31 * h.x, 1.05 * h.y, -0.35 * h.z],
        [0.30 * h.x, 0.90 * h.y, -0.33 * h.z],
      ],
    },
    {
      key: 'vci', color: BLUE, radius: 0.13, count: 9, speed: 0.2,
      points: [
        [0.28 * h.x, -0.80 * h.y, -0.30 * h.z],
        [0.30 * h.x, -0.20 * h.y, -0.33 * h.z],
        [0.30 * h.x, 0.30 * h.y, -0.35 * h.z],
        [0.30 * h.x, 0.70 * h.y, -0.33 * h.z],
      ],
    },
    {
      key: 'vpi', color: RED, radius: 0.09, count: 6, speed: 0.24,
      points: [
        [-0.30 * h.x, 0.95 * h.y, -0.30 * h.z],
        [-0.20 * h.x, 0.80 * h.y, -0.25 * h.z],
      ],
    },
    {
      key: 'vpd', color: RED, radius: 0.09, count: 6, speed: 0.24,
      points: [
        [0.30 * h.x, 0.95 * h.y, -0.30 * h.z],
        [0.20 * h.x, 0.80 * h.y, -0.25 * h.z],
      ],
    },
  ];

  return (
    <>
      <group
        position={[-norm.center.x * norm.s, -norm.center.y * norm.s, -norm.center.z * norm.s]}
        scale={norm.s}
      >
        <group ref={innerRef}>
          <primitive object={cleaned} />
        </group>
      </group>

      {flows.map((f) => (
        <Flow
          key={f.key}
          points={f.points}
          color={f.color}
          count={f.count}
          speed={f.speed}
          radius={f.radius}
          bpm={bpm}
          phaseRef={phaseRef}
        />
      ))}
    </>
  );
}

export default function Heart3D({ bpm, depth, irregular, onLub, onDub, height = 520 }) {
  return (
    <div className="heart3d-canvas" style={{ height }}>
      <Canvas
        camera={{ position: [0, 0, 7], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[6, 8, 5]} intensity={1.6} />
        <directionalLight position={[-5, -3, -4]} intensity={0.5} />
        <pointLight position={[0, 3, 4]} intensity={0.6} color="#ffd9d9" />
        <Suspense fallback={null}>
          <HeartScene bpm={bpm} depth={depth} irregular={irregular} onLub={onLub} onDub={onDub} />
        </Suspense>
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          autoRotate
          autoRotateSpeed={0.6}
          minDistance={4}
          maxDistance={12}
        />
      </Canvas>
    </div>
  );
}
