import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import SimulationWrapper from '../../components/shared/SimulationWrapper';
import { Aurora } from '../../reactbits';
import '../pages.css';
import './simulations.css';

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function LungsDiagram({ respRate, o2, co2 }) {
  const lungsRef = useRef(null);
  const paramsRef = useRef({ respRate, o2, co2 });

  useEffect(() => {
    paramsRef.current = { respRate, o2, co2 };
  }, [respRate, o2, co2]);

  useEffect(() => {
    let raf;
    const start = performance.now();
    function tick(now) {
      const p = paramsRef.current;
      const elapsed = (now - start) / 1000;
      // Ciclo respiratorio completo en segundos (a mayor frecuencia, menor duración)
      const cycleSec = 60 / p.respRate;
      const phase = (elapsed % cycleSec) / cycleSec;
      // 0-0.4 inhalación, 0.4-1 exhalación
      const scale = phase < 0.4 ? 1 + 0.12 * (phase / 0.4) : 1 + 0.12 * (1 - (phase - 0.4) / 0.6);

      if (lungsRef.current) {
        lungsRef.current.setAttribute('transform', `translate(380 150) scale(${scale}) translate(-380 -150)`);
      }

      // Partículas de gas
      for (let i = 0; i < 8; i++) {
        const o2el = document.getElementById(`o2-${i}`);
        if (o2el) {
          let t = (elapsed * 0.5 + i / 8) % 1;
          let x = 180 + t * 400;
          let y = 180 - t * 120;
          if (t > 0.6) y = 60 + (t - 0.6) * 120;
          o2el.setAttribute('cx', x);
          o2el.setAttribute('cy', y);
          o2el.setAttribute('opacity', clamp(p.o2 / 100, 0.15, 1));
        }
        const co2el = document.getElementById(`co2-${i}`);
        if (co2el) {
          let t = (elapsed * 0.4 + i / 8) % 1;
          let x = 580 - t * 400;
          let y = 60 + t * 120;
          co2el.setAttribute('cx', x);
          co2el.setAttribute('cy', y);
          co2el.setAttribute('opacity', clamp(p.co2 / 100, 0.15, 1));
        }
      }
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const o2Particles = Array.from({ length: 8 }, (_, i) => (
    <circle key={`o2-${i}`} id={`o2-${i}`} cx="0" cy="0" r="6" fill="#60a5fa" />
  ));
  const co2Particles = Array.from({ length: 8 }, (_, i) => (
    <circle key={`co2-${i}`} id={`co2-${i}`} cx="0" cy="0" r="6" fill="#f59e0b" />
  ));

  return (
    <svg viewBox="0 0 760 360" className="sim-svg" role="img" aria-label="Pulmones e intercambio gaseoso">
      <defs>
        <radialGradient id="lungGrad2" cx="50%" cy="40%" r="75%">
          <stop offset="0%" stopColor="#f9a8d4" />
          <stop offset="100%" stopColor="#db2777" />
        </radialGradient>
      </defs>

      {/* Tráquea y bronquios */}
      <path d="M 380 20 L 380 90 M 380 90 L 310 140 M 380 90 L 450 140" fill="none" stroke="#94a3b8" strokeWidth="14" strokeLinecap="round" />
      <text x="380" y="350" className="organ-label">PULMONES</text>
      <text x="70" y="40" className="organ-label">O₂ entra</text>
      <text x="690" y="40" className="organ-label">CO₂ sale</text>

      {/* Pulmones */}
      <g ref={lungsRef}>
        <ellipse cx="295" cy="200" rx="120" ry="110" fill="url(#lungGrad2)" opacity="0.85" />
        <ellipse cx="465" cy="200" rx="120" ry="110" fill="url(#lungGrad2)" opacity="0.85" />
        {/* Alvéolos */}
        <g fill="#f472b6" opacity="0.55">
          <circle cx="270" cy="180" r="16" />
          <circle cx="320" cy="210" r="16" />
          <circle cx="280" cy="250" r="16" />
          <circle cx="440" cy="180" r="16" />
          <circle cx="490" cy="210" r="16" />
          <circle cx="450" cy="250" r="16" />
        </g>
      </g>

      {o2Particles}
      {co2Particles}
    </svg>
  );
}

export default function Pulmones() {
  const [respRate, setRespRate] = useState(14);
  const [o2, setO2] = useState(98);
  const [co2, setCo2] = useState(5);

  return (
    <SimulationWrapper
      simNumber={3}
      title="Los Pulmones"
      description="Descubre el intercambio gaseoso y la oxigenación de la sangre."
      icon="🫁"
      info="Los pulmones realizan el intercambio gaseoso en los alvéolos: incorporan oxígeno (O₂) a la sangre y eliminan dióxido de carbono (CO₂) con cada respiración."
    >
      <div className="sim-canvas">
        <div className="sim-canvas-bg">
          <Aurora colorStops={['#be185d', '#1d4ed8', '#0e7490']} blend={0.35} amplitude={0.6} speed={0.25} />
        </div>
        <LungsDiagram respRate={respRate} o2={o2} co2={co2} />
      </div>

      <div className="sim-sliders">
        <div className="sim-slider-field">
          <label htmlFor="resp-slider">
            <span>Frecuencia respiratoria</span>
            <span>{respRate} resp/min</span>
          </label>
          <input id="resp-slider" type="range" min="8" max="30" value={respRate} onChange={(e) => setRespRate(Number(e.target.value))} />
        </div>
        <div className="sim-slider-field">
          <label htmlFor="o2-slider">
            <span>Saturación de oxígeno (O₂)</span>
            <span>{o2}%</span>
          </label>
          <input id="o2-slider" type="range" min="70" max="100" value={o2} onChange={(e) => setO2(Number(e.target.value))} />
        </div>
        <div className="sim-slider-field">
          <label htmlFor="co2-slider">
            <span>Dióxido de carbono (CO₂)</span>
            <span>{co2}%</span>
          </label>
          <input id="co2-slider" type="range" min="1" max="10" value={co2} onChange={(e) => setCo2(Number(e.target.value))} />
        </div>
      </div>

      <div className="sim-metrics">
        <div className="metric-card">
          <div className="metric-value">{respRate}</div>
          <div className="metric-label">Respiraciones / min</div>
        </div>
        <div className="metric-card">
          <div className={`metric-value ${o2 >= 95 ? 'ok' : 'warn'}`}>{o2}%</div>
          <div className="metric-label">Saturación O₂</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">{co2}%</div>
          <div className="metric-label">CO₂ en sangre</div>
        </div>
      </div>

      <div className="system-panel">
        <div className="system-panel-title">🔁 Los pulmones como subsistema de intercambio</div>
        <p className="info-panel-body" style={{ marginTop: '0.5rem', marginBottom: 0 }}>
          Inspirar baja el diafragma y llena los alvéolos de aire; ahí el O₂ pasa a la sangre y el CO₂
          sale de ella. Esta entrada de oxígeno alimenta la respiración celular de todo el cuerpo:
          sin pulmones, las células no podrían obtener energía. Los pulmones trabajan en conjunto
          con el corazón y la sangre para mantener el equilibrio del sistema.
        </p>
      </div>

      <div className="placeholder" style={{ marginTop: '1.5rem' }}>
        <Link to="/laboratorio/pulmones/evaluacion" className="btn btn-outline">
          Ir a la evaluación
        </Link>
      </div>
    </SimulationWrapper>
  );
}
