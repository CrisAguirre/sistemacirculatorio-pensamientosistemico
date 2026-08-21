import { lazy, Suspense, useState } from 'react';
import { Link } from 'react-router-dom';
import SimulationWrapper from '../../components/shared/SimulationWrapper';
import { Aurora } from '../../reactbits';
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

  const Apropiacion = (
    <>
      <h2>Representar el objeto de estudio: La Sangre</h2>
      <p>La sangre es el medio de transporte del sistema circulatorio. Para representarla como objeto de estudio, debemos visualizar sus componentes y cómo circulan: los glóbulos rojos que llevan oxígeno, los glóbulos blancos de defensa, las plaquetas de coagulación y el plasma que los transporta.</p>
      <div className="video-container">
        <iframe src="https://www.youtube.com/embed/TmOHclF31ww" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
      </div>
      <p>La representación gráfica del sistema circulatorio completo (modelo 3D) nos permite observar cómo la sangre recorre los vasos, identificar las rutas de ida y vuelta, y comprender por qué no es un fluido aislado sino el conector que integra todos los subsistemas del cuerpo.</p>
    </>
  );

  const Actividad = (
    <>
      <h2>Actividad: Escalas, proporciones y cantidades de la sangre</h2>
      <div className="activity-steps">
        <div className="activity-step">
          <div className="step-number">1</div>
          <div className="step-content">
            <h4>Proporciones del flujo sanguíneo</h4>
            <p>Ve a la pestaña <b>Simulador</b>. Selecciona los distintos modos (Transporte O₂, Defensa, Coagulación, Nutrientes). Identifica la proporción relativa de cada componente: ¿cuál ocupa mayor volumen en la sangre?</p>
          </div>
        </div>
        <div className="activity-step">
          <div className="step-number">2</div>
          <div className="step-content">
            <h4>Cuantifica el gasto cardíaco</h4>
            <p>Usa el control de Frecuencia Cardíaca y auméntala al máximo (180 lpm). Observa el valor del Gasto Cardíaco (L/min) y calcula: si el volumen sistólico es ~70 ml, ¿cuántos litros de sangre bombea el corazón en 1 minuto? Compara con el valor mostrado.</p>
          </div>
        </div>
        <div className="activity-step">
          <div className="step-number">3</div>
          <div className="step-content">
            <h4>Escalas de saturación</h4>
            <p>Reduce la Saturación de Oxígeno al 70%. Observa el cambio de escala del indicador (verde → naranja → rojo). Registra los valores y analiza: ¿a partir de qué porcentaje el sistema considera que hay alerta? ¿Qué proporción de oxígeno se perdió respecto al valor normal (98%)?</p>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <SimulationWrapper
      simNumber={2}
      title="La Sangre"
      description="La sangre circula por todo el sistema: observa el corazón latir y ajusta su ritmo."
      icon="🩸"
      info="La sangre es el medio de transporte del sistema circulatorio: lleva oxígeno, nutrientes y células de defensa a todo el cuerpo. Observa cómo el corazón impulsa la sangre a través de la red de vasos."
      apropiacion={Apropiacion}
      actividad={Actividad}
      evaluacionPath="/laboratorio/sangre/evaluacion"
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
