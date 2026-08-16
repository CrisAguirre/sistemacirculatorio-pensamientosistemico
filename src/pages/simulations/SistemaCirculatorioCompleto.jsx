import { lazy, Suspense, useState } from 'react';
import { Link } from 'react-router-dom';
import SimulationWrapper from '../../components/shared/SimulationWrapper';
import { Aurora } from '../../reactbits';
import circulatoryUrl from '../../assets/models/circulatory_system.glb?url';
import lungsUrl from '../../assets/models/lungs.glb?url';
import brainUrl from '../../assets/models/brain.glb?url';
import '../pages.css';
import './simulations.css';

const ModelViewer = lazy(() => import('../../components/three/ModelViewer'));
const Heart3D = lazy(() => import('../../components/heart/Heart3D'));

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function Loading() {
  return <div className="model3d-loading" style={{ height: 240 }}>Cargando…</div>;
}

export default function SistemaCirculatorioCompleto() {
  const [actividad, setActividad] = useState(0);
  const [bpm, setBpm] = useState(60);
  const [resp, setResp] = useState(12);
  const [saO2, setSaO2] = useState(98);

  function onActividadChange(v) {
    setActividad(v);
    setBpm(Math.round(60 + 1.3 * v));
    setResp(Math.round(12 + 0.33 * v));
  }

  // Fisiología cardiovascular acoplada (valores de referencia: Guyton & Hall / AHA)
  const sv = Math.round(70 + 0.4 * actividad); // volumen sistólico (ml)
  const co = ((bpm * sv) / 1000).toFixed(1); // gasto cardíaco (L/min)
  const sys = Math.round(110 + 0.8 * actividad); // presión sistólica
  const dia = Math.round(70 + 0.15 * actividad); // presión diastólica
  const svO2 = Math.max(20, Math.round(75 - 0.45 * actividad)); // saturación venosa O2
  const cbf = (0.75 + 0.25 * (actividad / 100)).toFixed(2); // flujo cerebral (L/min)
  const ve = (resp * (0.5 + 2.0 * (actividad / 100))).toFixed(1); // ventilación (L/min)
  const depth = clamp(0.06 + ((sv - 70) / 40) * 0.14, 0.06, 0.2); // fuerza de contracción

  const metrics = [
    { label: 'Gasto cardíaco', value: `${co}`, unit: 'L/min' },
    { label: 'Presión arterial', value: `${sys}/${dia}`, unit: 'mmHg' },
    { label: 'Volumen sistólico', value: `${sv}`, unit: 'ml' },
    { label: 'Saturación arterial O₂', value: `${saO2}%`, unit: '' },
    { label: 'Saturación venosa O₂', value: `${svO2}%`, unit: '' },
    { label: 'Flujo cerebral', value: `${cbf}`, unit: 'L/min' },
    { label: 'Ventilación', value: `${ve}`, unit: 'L/min' },
  ];

  return (
    <SimulationWrapper
      simNumber={5}
      title="Sistema Circulatorio Completo"
      description="El cuerpo como un sistema integrado: corazón, sangre, pulmones y cerebro acoplados."
      icon="🔄"
      info="Mueve la actividad metabólica y observa cómo todo el sistema responde en conjunto: el corazón late más rápido, los pulmones respiran más, la presión sube y la sangre entrega más oxígeno. Es la esencia del pensamiento sistémico."
    >
      {/* Controles fisiológicos */}
      <div className="sim-sliders">
        <div className="sim-slider-field">
          <label htmlFor="act-slider">
            <span>⚡ Actividad metabólica</span>
            <span>{actividad}%</span>
          </label>
          <input id="act-slider" type="range" min="0" max="100" value={actividad} onChange={(e) => onActividadChange(Number(e.target.value))} />
        </div>
        <div className="sim-slider-field">
          <label htmlFor="fc-slider">
            <span>❤️ Frecuencia cardíaca</span>
            <span>{bpm} lpm</span>
          </label>
          <input id="fc-slider" type="range" min="40" max="200" value={bpm} onChange={(e) => setBpm(Number(e.target.value))} />
        </div>
        <div className="sim-slider-field">
          <label htmlFor="fr-slider">
            <span>🫁 Frecuencia respiratoria</span>
            <span>{resp} resp/min</span>
          </label>
          <input id="fr-slider" type="range" min="8" max="45" value={resp} onChange={(e) => setResp(Number(e.target.value))} />
        </div>
        <div className="sim-slider-field">
          <label htmlFor="sao2-slider">
            <span>💨 Saturación arterial O₂</span>
            <span>{saO2}%</span>
          </label>
          <input id="sao2-slider" type="range" min="70" max="100" value={saO2} onChange={(e) => setSaO2(Number(e.target.value))} />
        </div>
      </div>

      {/* Composición de los 4 subsistemas */}
      <div className="sys-composition">
        <div className="sys-panel sys-main">
          <span className="sys-panel-label">🩸 Sangre · Sistema circulatorio</span>
          <div className="sim-canvas" style={{ marginBottom: 0 }}>
            <div className="sim-canvas-bg">
              <Aurora colorStops={['#7f1d1d', '#1d4ed8', '#0e7490']} blend={0.35} amplitude={0.7} speed={0.25} />
            </div>
            <Suspense fallback={<Loading />}>
              <ModelViewer src={circulatoryUrl} mode="animation" rate={bpm} height={430} />
            </Suspense>
          </div>
        </div>

        <div className="sys-details">
          <div className="sys-detail">
            <span className="sys-panel-label">🫀 Corazón</span>
            <Suspense fallback={<Loading />}>
              <Heart3D bpm={bpm} depth={depth} height={240} />
            </Suspense>
          </div>
          <div className="sys-detail">
            <span className="sys-panel-label">🫁 Pulmones</span>
            <Suspense fallback={<Loading />}>
              <ModelViewer src={lungsUrl} mode="breathe" rate={resp} height={240} autoRotate={false} />
            </Suspense>
          </div>
          <div className="sys-detail">
            <span className="sys-panel-label">🧠 Cerebro</span>
            <Suspense fallback={<Loading />}>
              <ModelViewer src={brainUrl} mode="pulse" rate={bpm} height={240} autoRotate={false} />
            </Suspense>
          </div>
        </div>
      </div>

      {/* Métricas acopladas */}
      <div className="sim-metrics">
        {metrics.map((m) => (
          <div className="metric-card" key={m.label}>
            <div className="metric-value">
              {m.value}
              {m.unit && <span className="metric-unit">{m.unit}</span>}
            </div>
            <div className="metric-label">{m.label}</div>
          </div>
        ))}
      </div>

      <div className="system-panel">
        <div className="system-panel-title">🌐 El cuerpo como un sistema de subsistemas acoplados</div>
        <div className="system-loop">
          <span className="system-node">Actividad (demanda O₂)</span>
          <span className="system-arrow">→</span>
          <span className="system-node">Corazón (FC + fuerza)</span>
          <span className="system-arrow">→</span>
          <span className="system-node">Gasto cardíaco</span>
          <span className="system-arrow">→</span>
          <span className="system-node">Pulmones (ventilación)</span>
          <span className="system-arrow">→</span>
          <span className="system-node">Sangre (O₂ a tejidos)</span>
          <span className="system-arrow">→</span>
          <span className="system-node">Cerebro (regula)</span>
        </div>
        <p className="info-panel-body" style={{ marginTop: '0.75rem', marginBottom: 0 }}>
          Ningún órgano trabaja solo: al aumentar la actividad, los músculos demandan más oxígeno.
          El cerebro activa el sistema simpático → el corazón acelera y contrae con más fuerza (sube el gasto
          cardíaco y la presión) → los pulmones ventilan más para oxigenar la sangre → la sangre extrae más O₂
          en los tejidos (baja la saturación venosa). Todo ocurre de forma sincronizada: una sola señal,
          una respuesta integrada.
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
