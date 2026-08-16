import { Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import './ModelViewer.css';

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function ModelScene({ src, mode, rate, depth }) {
  const { scene } = useGLTF(src);
  const innerRef = useRef();
  const paramsRef = useRef({ mode, rate, depth });

  useEffect(() => {
    paramsRef.current = { mode, rate, depth };
  }, [mode, rate, depth]);

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
    if (!innerRef.current) return;

    if (p.mode === 'breathe') {
      const rate = clamp(p.rate || 14, 4, 60);
      const elapsed = state.clock.elapsedTime;
      const cycleSec = 60 / rate;
      const phase = (elapsed % cycleSec) / cycleSec;
      const scale = phase < 0.4 ? 1 + 0.06 * (phase / 0.4) : 1 + 0.06 * (1 - (phase - 0.4) / 0.6);
      innerRef.current.scale.setScalar(scale);
    } else if (p.mode === 'pulse') {
      const rate = clamp(p.rate || 60, 30, 200);
      const beatMs = 60000 / rate;
      const elapsed = state.clock.elapsedTime * 1000;
      const cycle = (elapsed / beatMs) % 1;
      const scale = 1 + 0.03 * Math.sin(cycle * Math.PI * 2);
      innerRef.current.scale.setScalar(scale);
    } else {
      innerRef.current.scale.setScalar(1);
    }
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

export default function ModelViewer({
  src,
  mode = 'none',
  rate,
  depth,
  autoRotate = true,
  height = 520,
  camera = [0, 0, 7],
  fov = 45,
}) {
  return (
    <div className="model3d-canvas" style={{ height }}>
      <Canvas
        camera={{ position: camera, fov }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[6, 8, 5]} intensity={1.6} />
        <directionalLight position={[-5, -3, -4]} intensity={0.5} />
        <Suspense fallback={null}>
          <ModelScene src={src} mode={mode} rate={rate} depth={depth} />
        </Suspense>
        <OrbitControls
          enablePan={false}
          autoRotate={autoRotate}
          autoRotateSpeed={0.6}
          minDistance={3}
          maxDistance={14}
        />
      </Canvas>
    </div>
  );
}
