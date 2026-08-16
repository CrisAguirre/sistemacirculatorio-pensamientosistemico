import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import SimulationWrapper from '../../components/shared/SimulationWrapper';
import { Aurora } from '../../reactbits';
import '../pages.css';
import './simulations.css';

const MODES = [
  { id: 'transporte', label: 'Transporte O₂', icon: '🫁', color: '#ef4444' },
  { id: 'defensa', label: 'Defensa', icon: '🛡️', color: '#a855f7' },
  { id: 'coagulacion', label: 'Coagulación', icon: '🩹', color: '#f59e0b' },
  { id: 'nutrientes', label: 'Nutrientes', icon: '🍎', color: '#06b6d4' },
];

const MODE_INFO = {
  transporte: {
    title: 'Transporte de oxígeno',
    desc: 'Los glóbulos rojos (eritrocitos) contienen hemoglobina, que se une al oxígeno en los pulmones y lo libera en los tejidos.',
  },
  defensa: {
    title: 'Defensa del organismo',
    desc: 'Los glóbulos blancos (leucocitos) identifican y atacan microorganismos invasores. Son las células de defensa del sistema inmunitario.',
  },
  coagulacion: {
    title: 'Coagulación',
    desc: 'Las plaquetas se agrupan en el lugar de una herida y forman un tapón que detiene el sangrado.',
  },
  nutrientes: {
    title: 'Transporte de nutrientes',
    desc: 'El plasma (parte líquida) transporta nutrientes, hormonas, agua y desechos por todo el cuerpo.',
  },
};

const CELL_COLORS = {
  red: '#ef4444',
  white: '#e2e8f0',
  platelet: '#f59e0b',
  nutrient: '#34d399',
};

function buildCells() {
  const cells = [];
  for (let i = 0; i < 22; i++) {
    cells.push({ id: `red-${i}`, type: 'red', y: 40 + ((i * 37) % 130), speed: 30 + ((i * 13) % 30), size: 11, offset: (i / 22) * 760 });
  }
  for (let i = 0; i < 4; i++) {
    cells.push({ id: `white-${i}`, type: 'white', y: 50 + ((i * 53) % 100), speed: 20 + ((i * 7) % 12), size: 14, offset: (i / 4) * 760 + 120 });
  }
  for (let i = 0; i < 10; i++) {
    cells.push({ id: `platelet-${i}`, type: 'platelet', y: 45 + ((i * 29) % 110), speed: 40 + ((i * 9) % 16), size: 5, offset: (i / 10) * 760 });
  }
  return cells;
}

const BLOOD_CELLS = buildCells();

function BloodVessel({ mode, saturacion }) {
  const svgRef = useRef(null);
  const modeRef = useRef(mode);
  const satRef = useRef(saturacion);

  useEffect(() => {
    modeRef.current = mode;
    satRef.current = saturacion;
  }, [mode, saturacion]);

  useEffect(() => {
    let raf;
    const start = performance.now();
    function tick(now) {
      const elapsed = (now - start) / 1000;
      const m = modeRef.current;
      for (const p of BLOOD_CELLS) {
        const el = document.getElementById(`cell-${p.id}`);
        if (!el) continue;
        let x = (p.offset + elapsed * p.speed) % 800;
        x -= 20;
        if (x > 780) x = -20;
        el.setAttribute('cx', x);
        el.setAttribute('cy', p.y);

        let opacity = 1;
        if (p.type === 'red') {
          opacity = m === 'transporte' ? 1 : 0.35;
        } else if (p.type === 'white') {
          opacity = m === 'defensa' ? 1 : 0.5;
        } else if (p.type === 'platelet') {
          opacity = m === 'coagulacion' ? 1 : 0.4;
        }
        el.setAttribute('opacity', opacity);
      }

      for (const p of BLOOD_CELLS) {
        if (p.type !== 'red') continue;
        const el = document.getElementById(`cell-${p.id}`);
        if (el) {
          el.setAttribute('fill', satRef.current > 85 ? '#ef4444' : satRef.current > 70 ? '#b91c1c' : '#7f1d1d');
        }
      }
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const showClot = mode === 'coagulacion';

  return (
    <svg ref={svgRef} viewBox="0 0 760 220" className="sim-svg" role="img" aria-label="Vaso sanguíneo con células de la sangre">
      <defs>
        <linearGradient id="vesselWall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#b91c1c" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#7f1d1d" stopOpacity="0.85" />
        </linearGradient>
      </defs>

      {/* Pared del vaso */}
      <path d="M 0 20 Q 380 0 760 20 L 760 180 Q 380 200 0 180 Z" fill="none" stroke="url(#vesselWall)" strokeWidth="14" />

      {/* Luz del vaso (plasma) */}
      <path d="M 4 30 Q 380 10 756 30 L 756 170 Q 380 190 4 170 Z" fill="#fef3c7" opacity="0.75" />

      {/* Etiquetas */}
      <text x="380" y="210" className="organ-label">VASO SANGUÍNEO</text>
      <text x="18" y="38" fill="#7c2d12" fontSize="11" fontWeight="700">Plasma (55%)</text>

      {/* Coágulo */}
      {showClot && (
        <g>
          <circle cx="150" cy="100" r="16" fill="#f59e0b" opacity="0.85" />
          <circle cx="135" cy="88" r="9" fill="#fbbf24" opacity="0.85" />
          <circle cx="168" cy="115" r="10" fill="#f59e0b" opacity="0.85" />
          <circle cx="145" cy="120" r="8" fill="#fbbf24" opacity="0.85" />
          <text x="150" y="145" textAnchor="middle" fill="#92400e" fontSize="11" fontWeight="700">Herida</text>
        </g>
      )}

      {/* Células animadas */}
      {BLOOD_CELLS.map((p) => (
        <circle
          key={p.id}
          id={`cell-${p.id}`}
          cx="-40"
          cy={p.y}
          r={p.size}
          fill={p.type === 'red' ? CELL_COLORS.red : p.type === 'white' ? CELL_COLORS.white : CELL_COLORS.platelet}
          stroke={p.type === 'white' ? '#475569' : 'none'}
          strokeWidth={p.type === 'white' ? 2 : 0}
        />
      ))}
    </svg>
  );
}

export default function Sangre() {
  const [mode, setMode] = useState('transporte');
  const [saturacion, setSaturacion] = useState(98);

  return (
    <SimulationWrapper
      simNumber={2}
      title="La Sangre"
      description="Explora los componentes de la sangre y su rol de transporte por el organismo."
      icon="🩸"
      info="La sangre es el medio de transporte del sistema: lleva oxígeno, nutrientes y células de defensa a todo el cuerpo. Está formada por plasma (55%), glóbulos rojos, glóbulos blancos y plaquetas."
    >
      <div className="sim-controls">
        {MODES.map((m) => (
          <button
            key={m.id}
            type="button"
            className={`sim-btn ${mode === m.id ? 'active' : ''}`}
            onClick={() => setMode(m.id)}
          >
            <span className="sim-btn-icon">{m.icon}</span>
            <span className="sim-btn-label">{m.label}</span>
          </button>
        ))}
      </div>

      <div className="system-panel" style={{ marginBottom: '1rem' }}>
        <div className="system-panel-title">{MODE_INFO[mode].title}</div>
        <p className="info-panel-body" style={{ margin: 0 }}>{MODE_INFO[mode].desc}</p>
      </div>

      <div className="sim-canvas">
        <div className="sim-canvas-bg">
          <Aurora colorStops={['#7f1d1d', '#b45309', '#0e7490']} blend={0.35} amplitude={0.6} speed={0.25} />
        </div>
        <BloodVessel mode={mode} saturacion={saturacion} />
      </div>

      <div className="sim-sliders">
        <div className="sim-slider-field">
          <label htmlFor="sat-slider">
            <span>Saturación de oxígeno</span>
            <span>{saturacion}%</span>
          </label>
          <input id="sat-slider" type="range" min="50" max="100" value={saturacion} onChange={(e) => setSaturacion(Number(e.target.value))} />
        </div>
      </div>

      <div className="sim-metrics">
        <div className="metric-card">
          <div className="metric-value">55%</div>
          <div className="metric-label">Plasma</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">44%</div>
          <div className="metric-label">Glóbulos rojos</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">&lt;1%</div>
          <div className="metric-label">Glóbulos blancos</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">{saturacion}%</div>
          <div className="metric-label">Saturación O₂</div>
        </div>
      </div>

      <div className="system-panel">
        <div className="system-panel-title">🔗 La sangre conecta todo el sistema</div>
        <p className="info-panel-body" style={{ marginTop: '0.5rem', marginBottom: 0 }}>
          La sangre es el componente integrador: recoge oxígeno en los pulmones, nutrientes en el intestino,
          y los reparte a todas las células, mientras recoge los desechos. Por eso, pensar sistémicamente
          implica ver la sangre no como un líquido aislado, sino como la red de transporte que conecta
          los subsistemas del cuerpo.
        </p>
      </div>

      <div className="placeholder" style={{ marginTop: '1.5rem' }}>
        <Link to="/laboratorio/sangre/evaluacion" className="btn btn-outline">
          Ir a la evaluación
        </Link>
      </div>
    </SimulationWrapper>
  );
}
