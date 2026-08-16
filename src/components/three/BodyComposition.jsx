import { Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';
import bodyUrl from '../../assets/models/circulatory_system.glb?url';
import lungsUrl from '../../assets/models/lungs.glb?url';
import brainUrl from '../../assets/models/brain.glb?url';
import './ModelViewer.css';

function boxInfo(obj) {
  const bb = new THREE.Box3().setFromObject(obj);
  return { center: bb.getCenter(new THREE.Vector3()), size: bb.getSize(new THREE.Vector3()) };
}

function OrganModel({ obj, box, targetHeight, position, innerRef }) {
  const scale = targetHeight / (box.size.y || 1);
  const c = box.center;
  return (
    <group
      position={[position[0] - c.x * scale, position[1] - c.y * scale, position[2] - c.z * scale]}
      scale={scale}
    >
      <group ref={innerRef}>
        <primitive object={obj} />
      </group>
    </group>
  );
}

function CompositionScene({ bpm, resp }) {
  const body = useGLTF(bodyUrl);
  const lungs = useGLTF(lungsUrl);
  const brain = useGLTF(brainUrl);

  const bodyGroup = useRef();
  const { actions, mixer } = useAnimations(body.animations, bodyGroup);

  const lungsRef = useRef();
  const brainRef = useRef();
  const paramsRef = useRef({ bpm, resp });

  useEffect(() => {
    const names = Object.keys(actions);
    if (names.length) actions[names[0]].reset().fadeIn(0.3).play();
  }, [actions]);

  useEffect(() => {
    if (mixer) mixer.timeScale = Math.max(0.05, bpm / 60);
  }, [bpm, mixer]);

  useEffect(() => {
    paramsRef.current = { bpm, resp };
  }, [bpm, resp]);

  useFrame((state) => {
    const p = paramsRef.current;
    const t = state.clock.elapsedTime;
    const beatMs = 60000 / p.bpm;
    const cyc = (t * 1000) / beatMs % 1;

    const cycleSec = 60 / (p.resp || 14);
    const phase = (t % cycleSec) / cycleSec;
    const ls = phase < 0.4 ? 1 + 0.06 * (phase / 0.4) : 1 + 0.06 * (1 - (phase - 0.4) / 0.6);
    if (lungsRef.current) lungsRef.current.scale.setScalar(ls);

    if (brainRef.current) brainRef.current.scale.setScalar(1 + 0.03 * Math.sin(cyc * Math.PI * 2));
  });

  const bodyBox = useMemo(() => boxInfo(body.scene), [body]);
  const lungsBox = useMemo(() => boxInfo(lungs.scene), [lungs]);
  const brainBox = useMemo(() => boxInfo(brain.scene), [brain]);

  const H = 6;
  const bodyScale = H / (bodyBox.size.y || 1);
  const bc = bodyBox.center;

  // Posiciones anatómicas (cuerpo normalizado a 6 unidades, pies -3 → cabeza +3)
  const lungsPos = [0, 1.8, 0.25];
  const brainPos = [0, 2.4, 0.15];

  return (
    <>
      <group
        ref={bodyGroup}
        position={[-bc.x * bodyScale, -bc.y * bodyScale, -bc.z * bodyScale]}
        scale={bodyScale}
      >
        <primitive object={body.scene} />
      </group>

      <OrganModel obj={lungs.scene} box={lungsBox} targetHeight={1.7} position={lungsPos} innerRef={lungsRef} />
      <OrganModel obj={brain.scene} box={brainBox} targetHeight={0.91} position={brainPos} innerRef={brainRef} />
    </>
  );
}

export default function BodyComposition({ bpm, resp, height = 600 }) {
  return (
    <div className="model3d-canvas" style={{ height }}>
      <Canvas
        camera={{ position: [0, 0.5, 9], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.75} />
        <directionalLight position={[6, 10, 6]} intensity={1.7} />
        <directionalLight position={[-5, -3, -4]} intensity={0.5} />
        <pointLight position={[0, 2, 4]} intensity={0.5} color="#ffd9d9" />
        <Suspense fallback={null}>
          <CompositionScene bpm={bpm} resp={resp} />
        </Suspense>
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          autoRotate
          autoRotateSpeed={0.5}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.4}
          minDistance={4}
          maxDistance={14}
        />
      </Canvas>
    </div>
  );
}
