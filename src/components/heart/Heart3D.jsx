import { Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import heartUrl from '../../assets/models/heart.glb?url';
import './heart.css';

const VENTRICULAR_START = 0.12;
const VENTRICULAR_END = 0.45;

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

// Vaso sanguíneo: tubo + partículas que fluyen + flecha de dirección.
// La velocidad de las partículas se modula con la sístole (flujo pulsátil).
function Vessel({ points, color, count = 10, speed = 0.4, radius = 0.12, opacity = 0.38, phaseRef }) {
  const meshes = useRef([]);
  const accum = useRef(0);
  const curve = useMemo(
    () => new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p))),
    [points]
  );
  const tubeGeo = useMemo(() => new THREE.TubeGeometry(curve, 64, radius, 12, false), [curve, radius]);

  const arrow = useMemo(() => {
    const pos = curve.getPointAt(0.03);
    const tan = curve.getTangentAt(0.03).normalize();
    const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), tan);
    return { pos, quat };
  }, [curve]);

  useFrame((state, delta) => {
    const surge = 1 + 0.7 * (phaseRef?.current || 0);
    accum.current += delta * speed * surge;
    const t = accum.current % 1;
    meshes.current.forEach((m, i) => {
      if (!m) return;
      const u = (t + i / count) % 1;
      m.position.copy(curve.getPointAt(u));
    });
  });

  return (
    <group>
      <mesh geometry={tubeGeo}>
        <meshBasicMaterial color={color} transparent opacity={opacity} depthWrite={false} />
      </mesh>
      {Array.from({ length: count }).map((_, i) => (
        <mesh
          key={i}
          ref={(el) => {
            meshes.current[i] = el;
          }}
        >
          <sphereGeometry args={[radius * 1.25, 8, 8]} />
          <meshBasicMaterial color={color} />
        </mesh>
      ))}
      <mesh position={arrow.pos} quaternion={arrow.quat}>
        <coneGeometry args={[radius * 2.6, radius * 5, 12]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
}

function HeartScene({ bpm, depth, irregular, onLub, onDub }) {
  const { scene } = useGLTF(heartUrl);
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
    const bb = new THREE.Box3().setFromObject(scene);
    const center = bb.getCenter(new THREE.Vector3());
    const size = bb.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const s = 4 / maxDim;
    return { center, s, half: size.clone().multiplyScalar(s / 2) };
  }, [scene]);

  useFrame((state) => {
    const p = paramsRef.current;
    const beatMs = 60000 / p.bpm;
    const elapsed = state.clock.elapsedTime * 1000;

    let cycle = (elapsed / beatMs) % 1;
    if (p.irregular) {
      const jitter = Math.sin(elapsed / 180) * 0.05 + Math.sin(elapsed / 97) * 0.03;
      cycle = (cycle + jitter + 1) % 1;
    }

    const d = Math.min(Math.max(p.depth, 0.04), 0.25);
    if (innerRef.current) {
      innerRef.current.scale.setScalar(beatScale(cycle, d));
    }

    // Intensidad de la sístole para el flujo pulsátil (0 en diástole, pico en sístole).
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

  // Vasos en dirección real del flujo sanguíneo.
  const vessels = [
    // Aorta (sangre oxigenada): VI → ascendente → cayado → descendente → cuerpo
    {
      key: 'aorta',
      color: RED,
      radius: 0.15,
      count: 14,
      speed: 0.5,
      points: [
        [0, h.y * 0.55, 0.1],
        [0, h.y * 1.15, 0.1],
        [-0.55, h.y * 1.28, -0.1],
        [-1.0, h.y * 0.6, -0.3],
        [-1.1, -h.y * 0.15, -0.3],
        [-1.05, -h.y * 0.9, -0.25],
      ],
    },
    // Tronco pulmonar → rama izquierda (desoxigenada): VD → pulmón izquierdo
    {
      key: 'pulmonarIzq',
      color: BLUE,
      radius: 0.12,
      count: 8,
      speed: 0.42,
      points: [
        [0.15, h.y * 0.55, 0.15],
        [0.25, h.y * 0.9, 0.1],
        [-0.1, h.y * 1.15, -0.15],
        [-0.5, h.y * 1.2, -0.25],
      ],
    },
    // Tronco pulmonar → rama derecha (desoxigenada): VD → pulmón derecho
    {
      key: 'pulmonarDer',
      color: BLUE,
      radius: 0.12,
      count: 8,
      speed: 0.42,
      points: [
        [0.15, h.y * 0.55, 0.15],
        [0.25, h.y * 0.9, 0.1],
        [0.6, h.y * 1.15, -0.15],
        [0.85, h.y * 1.2, -0.25],
      ],
    },
    // Vena cava superior (desoxigenada): cabeza/brazos → AD
    {
      key: 'vcs',
      color: BLUE,
      radius: 0.13,
      count: 9,
      speed: 0.38,
      points: [
        [0.55, h.y * 1.45, 0.35],
        [0.45, h.y * 1.05, 0.25],
        [0.38, h.y * 0.7, 0.18],
      ],
    },
    // Vena cava inferior (desoxigenada): parte inferior del cuerpo → AD
    {
      key: 'vci',
      color: BLUE,
      radius: 0.13,
      count: 9,
      speed: 0.36,
      points: [
        [0.5, -h.y * 1.3, 0.3],
        [0.45, -h.y * 0.4, 0.22],
        [0.38, h.y * 0.5, 0.18],
      ],
    },
    // Vena pulmonar izquierda (oxigenada): pulmón → AI
    {
      key: 'vpi',
      color: RED,
      radius: 0.09,
      count: 6,
      speed: 0.4,
      points: [
        [-0.45, h.y * 1.05, 0.25],
        [-0.25, h.y * 0.75, 0.15],
      ],
    },
    // Vena pulmonar derecha (oxigenada): pulmón → AI
    {
      key: 'vpd',
      color: RED,
      radius: 0.09,
      count: 6,
      speed: 0.4,
      points: [
        [0.45, h.y * 1.05, 0.25],
        [0.28, h.y * 0.75, 0.15],
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
          <primitive object={scene} />
        </group>
      </group>

      {vessels.map((v) => (
        <Vessel
          key={v.key}
          points={v.points}
          color={v.color}
          count={v.count}
          speed={v.speed}
          radius={v.radius}
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
