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
      <h2>Lineamientos 1 y 2: Componentes y Causalidad en la Sangre</h2>
      <p>Desde el <b>pensamiento sistémico</b>, entender un sistema requiere primero <b>identificar sus componentes</b> (Lineamiento 1) y luego <b>establecer las relaciones de causa y efecto</b> entre ellos (Lineamiento 2). La sangre es el vehículo perfecto para explorar ambos lineamientos, ya que conecta todos los subsistemas del cuerpo.</p>
      <div className="video-container">
        <iframe src="https://www.youtube.com/embed/TmOHclF31ww" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
      </div>
      <h3>🔬 Lineamiento 1 — Componentes del sistema</h3>
      <p>La sangre tiene <b>4 componentes funcionales</b>, cada uno con un rol específico dentro del sistema circulatorio:</p>
      <ul style={{ paddingLeft: '1.2rem', lineHeight: 1.8 }}>
        <li><b>Glóbulos rojos (eritrocitos):</b> transportan el oxígeno (O₂) desde los pulmones hacia los tejidos gracias a la hemoglobina.</li>
        <li><b>Glóbulos blancos (leucocitos):</b> defienden el cuerpo detectando y atacando agentes invasores.</li>
        <li><b>Plaquetas:</b> sellan las heridas formando tapones que detienen el sangrado.</li>
        <li><b>Plasma:</b> el medio líquido que transporta nutrientes, hormonas y desechos.</li>
      </ul>
      <h3>⚡ Lineamiento 2 — Causalidad durante el ejercicio</h3>
      <p>Cuando haces <b>ejercicio físico</b> (la <i>causa</i>), los músculos demandan más oxígeno. Esto desencadena una <b>cadena causal</b> en el sistema: el cerebro detecta la demanda → envía señales simpáticas al corazón → el corazón late más rápido → la sangre circula a mayor velocidad → los glóbulos rojos entregan más O₂ a los músculos → los músculos producen más CO₂ → la sangre lo recoge y lo lleva a los pulmones para eliminarlo.</p>
      <p>Esta cadena demuestra que <b>ningún componente actúa solo</b>: el efecto de una causa se propaga por todo el sistema.</p>
    </>
  );

  const Actividad = (
    <>
      <h2>Actividad: Cadena Causal del Ejercicio en la Sangre</h2>
      <div className="activity-steps">
        <div className="activity-step">
          <div className="step-number">1</div>
          <div className="step-content">
            <h4>Identifica los componentes en reposo (L1)</h4>
            <p>Ve a la pestaña <b>Simulador</b>. Explora los 4 modos (Transporte O₂, Defensa, Coagulación, Nutrientes) y anota <b>qué componente de la sangre</b> cumple cada función. Con la FC en 75 lpm, registra el Gasto Cardíaco y la Saturación de O₂. Este es el <b>estado basal</b> del sistema.</p>
          </div>
        </div>
        <div className="activity-step">
          <div className="step-number">2</div>
          <div className="step-content">
            <h4>Simula el ejercicio: causa → efecto (L2)</h4>
            <p>Sube la Frecuencia Cardíaca a <b>150 lpm</b> (esto simula que estás corriendo). Observa el <b>efecto causal</b>: ¿cuánto aumentó el Gasto Cardíaco (L/min) respecto al paso 1? Explica por qué los <b>glóbulos rojos</b> (componente) deben circular más rápido cuando hay ejercicio (causa).</p>
          </div>
        </div>
        <div className="activity-step">
          <div className="step-number">3</div>
          <div className="step-content">
            <h4>Causalidad inversa: fallo de un componente (L2)</h4>
            <p>Baja la Saturación de O₂ al <b>65%</b> (esto simula anemia severa: los glóbulos rojos no pueden transportar suficiente O₂). ¿Qué <b>efecto</b> tiene este fallo en el sistema? ¿Por qué el corazón debería <b>aumentar aún más su frecuencia</b> para compensar? Registra cómo el fallo de un solo componente desencadena una cadena de efectos en todo el sistema.</p>
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
