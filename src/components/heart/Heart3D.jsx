import { Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Html, Line } from '@react-three/drei';
import * as THREE from 'three';
import heartUrl from '../../assets/realistic_human_heart.glb?url';
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

function FlowStream({ points, color, count = 10, speed = 0.25, radius = 0.07 }) {
  const meshes = useRef([]);
  const curve = useMemo(
    () => new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p))),
    [points]
  );

  useFrame((state) => {
    const t = (state.clock.elapsedTime * speed) % 1;
    meshes.current.forEach((m, i) => {
      if (!m) return;
      const u = (t + i / count) % 1;
      m.position.copy(curve.getPointAt(u));
    });
  });

  return (
    <group>
      <Line points={points} color={color} lineWidth={1.5} transparent opacity={0.3} />
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
    </group>
  );
}

function HeartScene({ bpm, depth, irregular, onLub, onDub }) {
  const { scene } = useGLTF(heartUrl);
  const rootRef = useRef();
  const innerRef = useRef();
  const paramsRef = useRef({ bpm, depth, irregular });
  const callbacksRef = useRef({ onLub, onDub });
  const prevPhaseRef = useRef(0);

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
  const labels = [
    { key: 'aorta', text: 'Aorta', pos: [-0.2, h.y * 1.15, 0.3], cls: 'red' },
    { key: 'pulmonar', text: 'Tronco pulmonar', pos: [0.5, h.y * 1.0, 0.15], cls: 'blue' },
    { key: 'venacava', text: 'Vena cava', pos: [0.8, h.y * 0.85, 0.35], cls: 'blue' },
    { key: 'ad', text: 'AD', pos: [h.x * 0.5, h.y * 0.3, 0.25], cls: 'blue' },
    { key: 'ai', text: 'AI', pos: [-h.x * 0.5, h.y * 0.3, 0.25], cls: 'red' },
    { key: 'vd', text: 'VD', pos: [h.x * 0.45, -h.y * 0.25, 0.3], cls: 'blue' },
    { key: 'vi', text: 'VI', pos: [-h.x * 0.45, -h.y * 0.35, 0.3], cls: 'red' },
  ];

  const streams = [
    {
      id: 'aorta',
      color: '#ef4444',
      points: [
        [0, h.y * 0.7, 0.3],
        [0, h.y * 1.15, 0.3],
        [-0.5, h.y * 1.3, 0.1],
        [-1.1, h.y * 1.05, -0.1],
        [-1.5, h.y * 0.5, -0.25],
        [-1.6, -h.y * 0.1, -0.3],
      ],
    },
    {
      id: 'pulmonar',
      color: '#3b82f6',
      points: [
        [0, h.y * 0.7, 0.15],
        [0.4, h.y * 1.0, 0.05],
        [0.9, h.y * 1.2, -0.15],
      ],
    },
    {
      id: 'venacava',
      color: '#3b82f6',
      points: [
        [0.9, h.y * 1.5, 0.4],
        [0.7, h.y * 1.1, 0.3],
        [0.4, h.y * 0.75, 0.2],
      ],
    },
  ];

  return (
    <>
      <group
        ref={rootRef}
        position={[-norm.center.x * norm.s, -norm.center.y * norm.s, -norm.center.z * norm.s]}
        scale={norm.s}
      >
        <group ref={innerRef}>
          <primitive object={scene} />
        </group>
      </group>

      {labels.map((l) => (
        <Html key={l.key} position={l.pos} center distanceFactor={7} zIndexRange={[10, 0]}>
          <div className={`heart3d-label ${l.cls}`}>{l.text}</div>
        </Html>
      ))}

      {streams.map((s) => (
        <FlowStream key={s.id} points={s.points} color={s.color} />
      ))}
    </>
  );
}

export default function Heart3D({ bpm, depth, irregular, onLub, onDub }) {
  return (
    <div className="heart3d-canvas">
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
          autoRotate
          autoRotateSpeed={0.6}
          minDistance={4}
          maxDistance={12}
        />
      </Canvas>
    </div>
  );
}
