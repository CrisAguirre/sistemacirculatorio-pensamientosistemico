import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import SimulationWrapper from '../../components/shared/SimulationWrapper';
import { Aurora } from '../../reactbits';
import heartImg from '../../assets/heart.webp';
import '../pages.css';
import './simulations.css';

const CIRCUIT_PATH = 'M 140 110 L 620 110 L 620 460 L 140 460 Z';
const PARTICLES = 24;

function CircuitDiagram({ bpm, demanda }) {
  const pathRef = useRef(null);
  const heartRef = useRef(null);
  const paramsRef = useRef({ bpm, demanda });

  useEffect(() => {
    paramsRef.current = { bpm, demanda };
  }, [bpm, demanda]);

  useEffect(() => {
    let raf;
    const start = performance.now();
    const particleEls = [];
    for (let i = 0; i < PARTICLES; i++) {
      particleEls.push(document.getElementById(`sc-particle-${i}`));
    }

    function tick(now) {
      const p = paramsRef.current;
      const elapsed = (now - start) / 1000;
      const path = pathRef.current;

      const beatMs = 60 / p.bpm;
      const phase = (elapsed % beatMs) / beatMs;
      const scale = 1 + 0.12 * Math.sin(phase * Math.PI * 2);
      if (heartRef.current) {
        heartRef.current.setAttribute('transform', `translate(380 285) scale(${scale}) translate(-380 -285)`);
      }

      if (path) {
        const len = path.getTotalLength();
        const flow = 0.4 + (p.demanda / 100) * 1.6;
        for (let i = 0; i < PARTICLES; i++) {
          const el = particleEls[i];
          if (!el) continue;
          const fraction = ((elapsed * flow) / 20 + i / PARTICLES) % 1;
          const pt = path.getPointAtLength(fraction * len);
          el.setAttribute('cx', pt.x);
          el.setAttribute('cy', pt.y);
          // x > 380 → sangre oxigenada (roja); x <= 380 → desoxigenada (azul)
          el.setAttribute('fill', pt.x > 380 ? '#ef4444' : '#3b82f6');
        }
      }
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <svg viewBox="0 0 760 560" className="sim-svg" role="img" aria-label="Circuito completo del sistema circulatorio">
      <defs>
        <radialGradient id="scLungGrad" cx="50%" cy="40%" r="75%">
          <stop offset="0%" stopColor="#f9a8d4" />
          <stop offset="100%" stopColor="#db2777" />
        </radialGradient>
      </defs>

      {/* Circuito */}
      <path ref={pathRef} d={CIRCUIT_PATH} fill="none" stroke="none" />

      {/* Pista visible (fondo del circuito) */}
      <path d={CIRCUIT_PATH} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="22" strokeLinecap="round" />

      {/* Pulmones (arriba) */}
      <g>
        <ellipse cx="300" cy="110" rx="80" ry="38" fill="url(#scLungGrad)" opacity="0.8" />
        <ellipse cx="460" cy="110" rx="80" ry="38" fill="url(#scLungGrad)" opacity="0.8" />
        <text x="380" y="105" className="organ-label">PULMONES (intercambio gaseoso)</text>
      </g>

      {/* Cuerpo / tejidos (abajo) */}
      <g>
        <rect x="220" y="460" width="320" height="40" rx="20" className="body-shape" />
        <text x="380" y="486" className="organ-label">CUERPO (tejidos)</text>
      </g>

      {/* Corazón (centro, latiendo) */}
      <g ref={heartRef}>
        <image href={heartImg} x="290" y="195" width="180" height="180" preserveAspectRatio="xMidYMid meet" />
      </g>

      {/* Partículas */}
      {Array.from({ length: PARTICLES }, (_, i) => (
        <circle key={i} id={`sc-particle-${i}`} cx="140" cy="110" r={i % 2 === 0 ? 6 : 4} fill="#ef4444" />
      ))}

      {/* Etiquetas de dirección */}
      <text x="640" y="40" className="organ-label" fill="#fca5a5">Sangre oxigenada (derecha)</text>
      <text x="140" y="40" className="organ-label" fill="#93c5fd">Sangre desoxigenada (izquierda)</text>
    </svg>
  );
}

export default function SistemaCirculatorioCompleto() {
  const [bpm, setBpm] = useState(75);
  const [demanda, setDemanda] = useState(50);

  const gasto = ((bpm * 70) / 1000).toFixed(1);
  const satArterial = 98;
  const satVenosa = Math.round(75 - (demanda / 100) * 30);

  return (
    <SimulationWrapper
      simNumber={5}
      title="Sistema Circulatorio Completo"
      description="Integra corazón, sangre, pulmones y cerebro en una visión de sistema completo."
      icon="🔄"
      info="La simulación general integra todos los componentes: la sangre recorre el circuito completo coordinada por el corazón, oxigenada por los pulmones y regulada por el cerebro."
    >
      <div className="sim-canvas">
        <div className="sim-canvas-bg">
          <Aurora colorStops={['#7f1d1d', '#1d4ed8', '#0e7490']} blend={0.35} amplitude={0.7} speed={0.25} />
        </div>
        <CircuitDiagram bpm={bpm} demanda={demanda} />
      </div>

      <div className="sim-sliders">
        <div className="sim-slider-field">
          <label htmlFor="sc-bpm-slider">
            <span>Frecuencia cardíaca</span>
            <span>{bpm} lpm</span>
          </label>
          <input id="sc-bpm-slider" type="range" min="40" max="180" value={bpm} onChange={(e) => setBpm(Number(e.target.value))} />
        </div>
        <div className="sim-slider-field">
          <label htmlFor="sc-demanda-slider">
            <span>Demanda de oxígeno (actividad)</span>
            <span>{demanda}%</span>
          </label>
          <input id="sc-demanda-slider" type="range" min="0" max="100" value={demanda} onChange={(e) => setDemanda(Number(e.target.value))} />
        </div>
      </div>

      <div className="sim-metrics">
        <div className="metric-card">
          <div className="metric-value">{gasto}</div>
          <div className="metric-label">Gasto cardíaco (L/min)</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">{satArterial}%</div>
          <div className="metric-label">Saturación arterial (sale del corazón)</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">{satVenosa}%</div>
          <div className="metric-label">Saturación venosa (retorna al corazón)</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">{bpm}</div>
          <div className="metric-label">Frecuencia cardíaca</div>
        </div>
      </div>

      <div className="system-panel">
        <div className="system-panel-title">🌐 El sistema circulatorio como un todo integrado</div>
        <p className="info-panel-body" style={{ marginTop: '0.5rem', marginBottom: 0 }}>
          Observa el bucle completo: el corazón bombea → la sangre oxigenada sale por las arterias →
          los tejidos consumen oxígeno → la sangre desoxigenada regresa por las venas → los pulmones la
          vuelven a oxigenar. Cada componente (corazón, sangre, pulmones, cerebro) es un subsistema,
          y juntos forman un sistema con propiedades que ninguno tiene por separado: la circulación.
        </p>
      </div>

      <div className="placeholder" style={{ marginTop: '1.5rem' }}>
        <Link to="/laboratorio/sistema-circulatorio/evaluacion" className="btn btn-outline">
          Ir a la evaluación
        </Link>
      </div>
    </SimulationWrapper>
  );
}
