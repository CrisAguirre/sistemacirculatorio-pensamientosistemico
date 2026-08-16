import { useEffect, useRef } from 'react';
import heartImg from '../../assets/heart.webp';
import './heart.css';

const VENTRICULAR_START = 0.12;
const VENTRICULAR_END = 0.45;

function pulse(phase, start, end, depth) {
  if (phase < start || phase > end) return 1;
  const t = (phase - start) / (end - start);
  return 1 - depth * Math.sin(t * Math.PI);
}

export default function HeartImage({ bpm, depth, irregular, onLub, onDub }) {
  const imgRef = useRef(null);
  const glowRef = useRef(null);
  const paramsRef = useRef({ bpm, depth, irregular });
  const callbacksRef = useRef({ onLub, onDub });
  const prevPhaseRef = useRef(0);

  useEffect(() => {
    paramsRef.current = { bpm, depth, irregular };
  }, [bpm, depth, irregular]);

  useEffect(() => {
    callbacksRef.current = { onLub, onDub };
  }, [onLub, onDub]);

  useEffect(() => {
    let raf;
    const start = performance.now();

    function tick(now) {
      const p = paramsRef.current;
      const beatMs = 60000 / p.bpm;
      const elapsed = now - start;

      let cycle = (elapsed / beatMs) % 1;
      if (p.irregular) {
        const jitter = Math.sin(elapsed / 180) * 0.05 + Math.sin(elapsed / 97) * 0.03;
        cycle = (cycle + jitter + 1) % 1;
      }

      const depth = Math.min(Math.max(p.depth, 0.04), 0.25);
      const scale = pulse(cycle, VENTRICULAR_START, VENTRICULAR_END, depth);

      if (imgRef.current) {
        imgRef.current.style.transform = `scale(${scale})`;
      }
      if (glowRef.current) {
        const intensity = 1 - Math.abs(1 - scale);
        glowRef.current.style.opacity = String(0.35 + intensity * 0.65);
      }

      const prev = prevPhaseRef.current;
      if (prev < VENTRICULAR_START && cycle >= VENTRICULAR_START) {
        callbacksRef.current.onLub?.();
      }
      if (prev < VENTRICULAR_END && cycle >= VENTRICULAR_END) {
        callbacksRef.current.onDub?.();
      }
      prevPhaseRef.current = cycle;

      raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="heart-image-wrap">
      <div ref={glowRef} className="heart-glow" />
      <img ref={imgRef} src={heartImg} className="heart-image" alt="Corazón humano" />
    </div>
  );
}
