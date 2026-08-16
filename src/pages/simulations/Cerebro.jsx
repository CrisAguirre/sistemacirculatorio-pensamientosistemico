import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import SimulationWrapper from '../../components/shared/SimulationWrapper';
import { Aurora } from '../../reactbits';
import '../pages.css';
import './simulations.css';

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function BrainDiagram({ bpm }) {
  const vesselsRef = useRef(null);
  const paramsRef = useRef({ bpm });

  useEffect(() => {
    paramsRef.current = { bpm };
  }, [bpm]);

  useEffect(() => {
    let raf;
    const start = performance.now();
    function tick(now) {
      const p = paramsRef.current;
      const elapsed = (now - start) / 1000;
      const beatMs = 60 / p.bpm;
      const phase = (elapsed % beatMs) / beatMs;
      const pulse = 1 + 0.08 * Math.sin(phase * Math.PI * 2);

      if (vesselsRef.current) {
        vesselsRef.current.setAttribute('stroke-width', 8 * pulse);
      }

      for (let i = 0; i < 12; i++) {
        const el = document.getElementById(`neuron-${i}`);
        if (el) {
          el.setAttribute('opacity', 0.3 + 0.7 * Math.abs(Math.sin(phase * Math.PI * 2 + i)));
        }
      }
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <svg viewBox="0 0 760 360" className="sim-svg" role="img" aria-label="Cerebro y flujo sanguíneo cerebral">
      <defs>
        <radialGradient id="brainGrad" cx="50%" cy="45%" r="70%">
          <stop offset="0%" stopColor="#c4b5fd" />
          <stop offset="100%" stopColor="#7c3aed" />
        </radialGradient>
      </defs>

      <text x="380" y="30" className="organ-label">CEREBRO</text>

      {/* Cerebro */}
      <g>
        <ellipse cx="380" cy="180" rx="150" ry="110" fill="url(#brainGrad)" opacity="0.85" />
        {/* Hemisferios */}
        <path d="M 380 70 C 360 140 360 220 380 290" fill="none" stroke="#6d28d9" strokeWidth="4" opacity="0.6" />
        {/* Circunvoluciones */}
        <g fill="none" stroke="#ede9fe" strokeWidth="3" opacity="0.5">
          <path d="M 260 150 C 290 130 320 160 350 140" />
          <path d="M 250 200 C 280 185 310 210 340 195" />
          <path d="M 410 140 C 440 160 470 130 500 150" />
          <path d="M 420 195 C 450 210 480 185 510 200" />
        </g>
        {/* Neuronas (señales) */}
        {Array.from({ length: 12 }, (_, i) => (
          <circle
            key={i}
            id={`neuron-${i}`}
            cx={250 + ((i * 47) % 260)}
            cy={110 + ((i * 61) % 140)}
            r="4"
            fill="#fbbf24"
            opacity="0.6"
          />
        ))}
      </g>

      {/* Vasos sanguíneos hacia el cerebro */}
      <g>
        <path ref={vesselsRef} d="M 380 300 L 380 360 M 300 310 L 250 360 M 460 310 L 510 360" fill="none" stroke="#ef4444" strokeWidth="8" strokeLinecap="round" opacity="0.8" />
        <text x="380" y="358" className="organ-label" fill="#fca5a5">FLUJO SANGUÍNEO CEREBRAL</text>
      </g>
    </svg>
  );
}

export default function Cerebro() {
  const [demanda, setDemanda] = useState(50);
  const bpm = Math.round(60 + (demanda / 100) * 80);
  const flujoCerebral = clamp(12 + (demanda / 100) * 8, 12, 20);

  return (
    <SimulationWrapper
      simNumber={4}
      title="El Cerebro"
      description="Conoce la regulación de la circulación y la alta demanda de flujo sanguíneo del cerebro."
      icon="🧠"
      info="El cerebro regula la frecuencia cardíaca y la presión, y aunque pesa poco, demanda cerca del 15-20% del flujo sanguíneo total por su constante necesidad de oxígeno y glucosa."
    >
      <div className="sim-canvas">
        <div className="sim-canvas-bg">
          <Aurora colorStops={['#4c1d95', '#1d4ed8', '#0e7490']} blend={0.35} amplitude={0.6} speed={0.25} />
        </div>
        <BrainDiagram bpm={bpm} />
      </div>

      <div className="sim-sliders">
        <div className="sim-slider-field">
          <label htmlFor="demanda-slider">
            <span>Nivel de demanda / actividad</span>
            <span>{demanda}%</span>
          </label>
          <input id="demanda-slider" type="range" min="0" max="100" value={demanda} onChange={(e) => setDemanda(Number(e.target.value))} />
        </div>
      </div>

      <div className="sim-metrics">
        <div className="metric-card">
          <div className="metric-value">{bpm}</div>
          <div className="metric-label">Frecuencia cardíaca (lpm)</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">{flujoCerebral.toFixed(0)}%</div>
          <div className="metric-label">Flujo sanguíneo cerebral</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">{demanda > 60 ? 'Simpático' : demanda < 40 ? 'Parasimpático' : 'Equilibrio'}</div>
          <div className="metric-label">Dominio del SNA</div>
        </div>
      </div>

      <div className="system-panel">
        <div className="system-panel-title">🔁 El cerebro como centro de control</div>
        <div className="system-loop">
          <span className="system-node">Demanda de oxígeno</span>
          <span className="system-arrow">→</span>
          <span className="system-node">Cerebro</span>
          <span className="system-arrow">→</span>
          <span className="system-node">SNA</span>
          <span className="system-arrow">→</span>
          <span className="system-node">Corazón</span>
          <span className="system-arrow">→</span>
          <span className="system-node">Flujo sanguíneo</span>
          <span className="system-arrow">→</span>
          <span className="system-node">Cerebro</span>
        </div>
        <p className="info-panel-body" style={{ marginTop: '0.75rem', marginBottom: 0 }}>
          El cerebro es a la vez consumidor y regulador: necesita mucha sangre, y al mismo tiempo
          envía las señales (simpáticas o parasimpáticas) que ajustan el corazón y la presión.
          Esta doble función lo convierte en un nodo central del sistema circulatorio.
        </p>
      </div>

      <div className="placeholder" style={{ marginTop: '1.5rem' }}>
        <Link to="/laboratorio/cerebro/evaluacion" className="btn btn-outline">
          Ir a la evaluación
        </Link>
      </div>
    </SimulationWrapper>
  );
}
