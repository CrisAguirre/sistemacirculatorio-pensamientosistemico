import { lazy, Suspense, useState } from 'react';
import { Link } from 'react-router-dom';
import EvidenciaTextarea from '../../components/shared/EvidenciaTextarea';
import SimulationWrapper from '../../components/shared/SimulationWrapper';
import SequenceCarousel from '../../components/shared/SequenceCarousel';
import { Aurora, FadeContent } from '../../reactbits';
import circulatoryUrl from '../../assets/models/circulatory_system.glb?url';
import '../pages.css';
import './simulations.css';

const ModelViewer = lazy(() => import('../../components/three/ModelViewer'));

const MODES = [
  { id: 'transporte', label: 'Transporte O₂', icon: '🫁' },
  { id: 'defensa', label: 'Defensa', icon: '🛡️' },
  { id: 'coagulacion', label: 'Coagulación', icon: '🩹' },
  { id: 'nutrientes', label: 'Nutrientes', icon: '🍎' },
];

const MODE_INFO = {
  transporte: {
    title: 'Transporte de oxígeno',
    desc: 'La sangre oxigenada sale del corazón por la aorta y se reparte por las arterias hasta los capilares, donde entrega el O₂ a los tejidos.',
  },
  defensa: {
    title: 'Defensa del organismo',
    desc: 'Los glóbulos blancos viajan por la sangre para identificar y atacar microorganismos invasores en cualquier parte del cuerpo.',
  },
  coagulacion: {
    title: 'Coagulación',
    desc: 'Las plaquetas circulan por el torrente y se agrupan en el lugar de una herida para detener el sangrado.',
  },
  nutrientes: {
    title: 'Transporte de nutrientes',
    desc: 'El plasma transporta nutrientes, hormonas y agua hacia los tejidos, y recoge los desechos para su eliminación.',
  },
};

export default function Sangre() {
  const [mode, setMode] = useState('transporte');
  const [bpm, setBpm] = useState(75);
  const [saturacion, setSaturacion] = useState(98);

  const gasto = ((bpm * 70) / 1000).toFixed(1);

  const Actividad = (
    <div className="actividad-immersive-container">
      <h2 className="text-neon-blue mb-3">Actividad Práctica: La Sangre en Acción</h2>
      <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        A continuación, interactúa con el simulador y responde a cada uno de los 3 retos planteados. 
        <strong style={{ color: '#60a5fa' }}> Por favor, agregue descripciones escritas, datos cuantitativos o palabras clave relacionadas con la temática de cada pregunta en su respectivo cajón de texto.</strong>
      </p>

      <div className="activity-steps-immersive" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>

        {/* RETO 1 */}
        <div className="glass-panel" style={{ padding: '2rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, right: 0, width: '150px', height: '150px', background: 'radial-gradient(circle, rgba(239,68,68,0.15) 0%, transparent 70%)', pointerEvents: 'none' }}></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div className="step-number" style={{ background: '#ef4444', boxShadow: '0 0 15px rgba(239,68,68,0.5)' }}>1</div>
            <h4 style={{ margin: 0, fontSize: '1.25rem', color: '#f87171' }}>Identifica los componentes en reposo (L1)</h4>
          </div>
          <p style={{ lineHeight: '1.7', marginBottom: '1.5rem', color: '#e2e8f0' }}>
            Ve a la pestaña <strong>Desarrollo</strong>. Explora los 4 modos (Transporte O₂, Defensa, Coagulación, Nutrientes) y anota <strong>qué componente celular de la sangre</strong> cumple cada función. Luego, con la Frecuencia Cardíaca en 75 lpm (estado basal), registra el Gasto Cardíaco y la Saturación de O₂.
          </p>
          <EvidenciaTextarea 
            titulo="Sangre - Actividad 1: Estado Basal" 
            placeholder="Agregue aquí sus descripciones (Ej: El componente de defensa es... El gasto cardíaco inicial es...)"
          />
        </div>

        {/* RETO 2 */}
        <div className="glass-panel" style={{ padding: '2rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, right: 0, width: '150px', height: '150px', background: 'radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 70%)', pointerEvents: 'none' }}></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div className="step-number" style={{ background: '#f59e0b', boxShadow: '0 0 15px rgba(245,158,11,0.5)' }}>2</div>
            <h4 style={{ margin: 0, fontSize: '1.25rem', color: '#fbbf24' }}>Simula el ejercicio: causa → efecto (L2)</h4>
          </div>
          <p style={{ lineHeight: '1.7', marginBottom: '1.5rem', color: '#e2e8f0' }}>
            Sube la Frecuencia Cardíaca a <strong>150 lpm</strong> simulando que estás corriendo. Observa el efecto causal: ¿Cuánto aumentó el Gasto Cardíaco (L/min) respecto al paso 1? Explica con tus propias palabras por qué los <strong>glóbulos rojos</strong> deben circular más rápido cuando hay ejercicio físico.
          </p>
          <EvidenciaTextarea 
            titulo="Sangre - Actividad 2: Causalidad del Ejercicio" 
            placeholder="Escriba aquí los valores registrados y su explicación causal..."
          />
        </div>

        {/* RETO 3 */}
        <div className="glass-panel" style={{ padding: '2rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, right: 0, width: '150px', height: '150px', background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)', pointerEvents: 'none' }}></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div className="step-number" style={{ background: '#3b82f6', boxShadow: '0 0 15px rgba(59,130,246,0.5)' }}>3</div>
            <h4 style={{ margin: 0, fontSize: '1.25rem', color: '#60a5fa' }}>Fallo sistémico: Causalidad inversa (L2)</h4>
          </div>
          <p style={{ lineHeight: '1.7', marginBottom: '1.5rem', color: '#e2e8f0' }}>
            Baja la Saturación de O₂ al <strong>65%</strong> (simulando una anemia severa o falta de oxígeno). ¿Qué efecto tiene este fallo en el sistema? ¿Por qué el corazón necesitaría bombear más rápido (aumentar la frecuencia) para intentar compensar esta deficiencia?
          </p>
          <EvidenciaTextarea 
            titulo="Sangre - Actividad 3: Fallo de Componentes" 
            placeholder="Describa los efectos observados y reflexione sobre la interdependencia sistémica..."
          />
        </div>

      </div>
    </div>
  );

  const bpm = state ? state.bpm : fc;
  const systolic = state ? state.systolic : sys;
  const diastolic = state ? state.diastolic : Math.round(sys * 0.62);
  const strength = state ? state.strength : clamp((sys - 70) / 100, 0.2, 1);
  const depth = state ? state.depth : 0.06 + strength * 0.14;
  const irregular = state ? state.irregular : false;

  const cardiacOutput = ((bpm * (50 + strength * 60)) / 1000).toFixed(1);

  // --- Historial para la gráfica de enfermedades cardíacas ---
  const [chartData, setChartData] = useState([]);
  const sampleRef = useRef(0);

  function getDiagnosis(heartRate) {
    if (heartRate < 50) return 'Bradicardia severa';
    if (heartRate < 60) return 'Bradicardia';
    if (heartRate <= 100) return 'Normal';
    if (heartRate <= 150) return 'Taquicardia';
    return 'Taquicardia severa';
  }

  function addSample() {
    sampleRef.current += 1;
    setChartData((prev) => {
      const next = [...prev, { t: sampleRef.current, FC: bpm, PA: systolic }];
      return next.length > 15 ? next.slice(-15) : next;
    });
  }

  function selectState(id) {
    const s = getState(id);
    setSelected(id);
    setFc(s.bpm);
    setSys(s.systolic);
  }

  function onFcChange(e) {
    setSelected(null);
    setFc(Number(e.target.value));
  }

  function onSysChange(e) {
    setSelected(null);
    setSys(Number(e.target.value));
  }

  const currentDiag = getDiagnosis(bpm);
  const diagColor = currentDiag === 'Normal' ? '#22c55e' : currentDiag.includes('severa') ? '#ef4444' : '#f59e0b';

  return (
    <SimulationWrapper
      simNumber={2}
      title="La Sangre"
      description="La sangre circula por todo el sistema: observa el corazón latir y ajusta su ritmo."
      icon="🩸"
      info="La sangre es el medio de transporte del sistema circulatorio: lleva oxígeno, nutrientes y células de defensa a todo el cuerpo. Observa cómo el corazón impulsa la sangre a través de la red de vasos."
      actividad={Actividad}
      evaluacionPath="/laboratorio/sangre/evaluacion"
    >
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ color: '#60a5fa', fontSize: '1.8rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10x' }}>
          <span style={{ fontSize: '2rem', filter: 'drop-shadow(0 0 8px rgba(96,165,250,0.6))' }}>🔬</span> 
          Simulador de la Sangre
        </h2>
      </div>

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
        <Suspense fallback={<div className="model3d-loading">Cargando modelo 3D…</div>}>
          <ModelViewer src={circulatoryUrl} mode="animation" rate={bpm} height={560} />
        </Suspense>
      </div>

      <div className="sim-sliders">
        <div className="sim-slider-field">
          <label htmlFor="bpm-slider">
            <span>Frecuencia cardíaca</span>
            <span>{bpm} lpm</span>
          </label>
          <input id="bpm-slider" type="range" min="40" max="180" value={bpm} onChange={(e) => setBpm(Number(e.target.value))} />
        </div>
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
          <div className="metric-value">{bpm}</div>
          <div className="metric-label">Frecuencia cardíaca (lpm)</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">{gasto}</div>
          <div className="metric-label">Gasto cardíaco (L/min)</div>
        </div>
        <div className="metric-card">
          <div className={`metric-value ${saturacion >= 95 ? 'ok' : 'warn'}`}>{saturacion}%</div>
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
    </SimulationWrapper>
  );
}