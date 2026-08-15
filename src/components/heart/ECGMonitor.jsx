import { useEffect, useRef } from 'react';

const BEAT_WIDTH = 120;

// Forma de onda ECG de un latido (P - QRS - T), escala en 120px de ancho.
function beatPath(x0) {
  const y = 30;
  return [
    `M ${x0} ${y}`,
    `C ${x0 + 6} ${y} ${x0 + 10} ${y} ${x0 + 14} ${y}`,
    `C ${x0 + 18} ${y} ${x0 + 20} 22 ${x0 + 24} 22`,
    `C ${x0 + 28} 22 ${x0 + 30} ${y} ${x0 + 34} ${y}`,
    `L ${x0 + 40} ${y}`,
    `L ${x0 + 43} 33`,
    `L ${x0 + 46} 6`,
    `L ${x0 + 49} 46`,
    `L ${x0 + 54} ${y}`,
    `C ${x0 + 58} ${y} ${x0 + 60} 24 ${x0 + 66} 24`,
    `C ${x0 + 70} 24 ${x0 + 72} ${y} ${x0 + 78} ${y}`,
    `L ${x0 + BEAT_WIDTH} ${y}`,
  ].join(' ');
}

export default function ECGMonitor({ bpm, irregular }) {
  const traceRef = useRef(null);
  const paramsRef = useRef({ bpm, irregular });

  // Tres latidos visibles; generamos un trazo de 5 para poder desplazarlo.
  const fullPath = Array.from({ length: 5 }, (_, i) => beatPath(i * BEAT_WIDTH)).join(' ');

  useEffect(() => {
    paramsRef.current = { bpm, irregular };
  }, [bpm, irregular]);

  useEffect(() => {
    let raf;
    const start = performance.now();

    function tick(now) {
      const p = paramsRef.current;
      const elapsed = now - start;
      const beatMs = 60000 / p.bpm;
      const pxPerMs = BEAT_WIDTH / beatMs;

      let raw = -((elapsed * pxPerMs) % BEAT_WIDTH);
      if (p.irregular) {
        raw -= Math.sin(elapsed / 180) * 3 + Math.sin(elapsed / 97) * 2;
      }

      if (traceRef.current) {
        traceRef.current.setAttribute('transform', `translate(${raw} 0)`);
      }
      raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="ecg-monitor">
      <div className="ecg-monitor-header">
        <span className="ecg-dot" />
        <span>Derivación II</span>
        <span className="ecg-hr">{bpm} lpm</span>
      </div>
      <svg viewBox="0 0 360 60" className="ecg-svg" preserveAspectRatio="none">
        <path ref={traceRef} d={fullPath} fill="none" stroke="#4ade80" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      </svg>
    </div>
  );
}
