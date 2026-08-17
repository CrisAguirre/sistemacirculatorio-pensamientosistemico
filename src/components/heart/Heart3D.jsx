import { Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import heartUrl from '../../assets/models/heart_core.glb?url';
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

function HeartScene({ bpm, depth, irregular, onLub, onDub }) {
  const { scene } = useGLTF(heartUrl);

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
    return { center, s };
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

    const d = Math.min(Math.max(p.depth, 0.04), 0.25) * 0.25;
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

  return (
    <group
      position={[-norm.center.x * norm.s, -norm.center.y * norm.s, -norm.center.z * norm.s]}
      scale={norm.s}
    >
      <group ref={innerRef}>
        <primitive object={scene} />
      </group>
    </group>
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