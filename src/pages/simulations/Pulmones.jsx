import { lazy, Suspense, useState } from 'react';
import { Link } from 'react-router-dom';
import SimulationWrapper from '../../components/shared/SimulationWrapper';
import { Aurora } from '../../reactbits';
import lungsUrl from '../../assets/models/lungs.glb?url';
import '../pages.css';
import './simulations.css';

const ModelViewer = lazy(() => import('../../components/three/ModelViewer'));

export default function Pulmones() {
  const [respRate, setRespRate] = useState(14);
  const [o2, setO2] = useState(98);
  const [co2, setCo2] = useState(5);

  const Apropiacion = (
    <>
      <h2>Representar el objeto de estudio: Los Pulmones</h2>
      <p>Los pulmones son los órganos responsables del intercambio gaseoso. Representarlos como objeto de estudio nos permite visualizar cómo están estructurados internamente: millones de alvéolos conectados a una red de capilares donde la sangre intercambia oxígeno por dióxido de carbono.</p>
      <div className="video-container">
        <iframe src="https://www.youtube.com/embed/uUpdItCbr24" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
      </div>
      <p>En la representación 3D puedes observar el movimiento rítmico de inhalación y exhalación. Los pulmones son la interfaz entre el medio externo (aire) y el medio interno (sangre), permitiendo la entrada del oxígeno y la salida del dióxido de carbono para mantener el equilibrio del sistema.</p>
    </>
  );

  const Actividad = (
    <>
      <h2>Actividad: Escalas, proporciones y cantidades respiratorias</h2>
      <div className="activity-steps">
        <div className="activity-step">
          <div className="step-number">1</div>
          <div className="step-content">
            <h4>Mide el ritmo respiratorio</h4>
            <p>Ve a la pestaña <b>Simulador</b>. Registra la Frecuencia Respiratoria en reposo (14 resp/min). Ahora auméntala a 30 resp/min. Calcula: ¿en qué proporción aumentó? ¿Cuántas respiraciones más por minuto se realizan?</p>
          </div>
        </div>
        <div className="activity-step">
          <div className="step-number">2</div>
          <div className="step-content">
            <h4>Escalas de saturación de O₂</h4>
            <p>Desciende la saturación de O₂ a niveles bajos (menor a 90%). Registra el valor exacto y calcula el porcentaje de disminución respecto al 98% normal. ¿A partir de qué cantidad porcentual el indicador cambia de estado?</p>
          </div>
        </div>
        <div className="activity-step">
          <div className="step-number">3</div>
          <div className="step-content">
            <h4>Proporciones de CO₂</h4>
            <p>Aumenta el nivel de CO₂ al máximo (10%). Registra las 3 métricas (FR, O₂, CO₂) simultáneamente. Analiza la relación proporcional: cuando el CO₂ sube, ¿qué le debería ocurrir a la frecuencia respiratoria para compensar?</p>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <SimulationWrapper
      simNumber={3}
      title="Los Pulmones"
      description="Descubre el intercambio gaseoso y la oxigenación de la sangre."
      icon="🫁"
      info="Los pulmones realizan el intercambio gaseoso en los alvéolos: incorporan oxígeno (O₂) a la sangre y eliminan dióxido de carbono (CO₂) con cada respiración. Gira el modelo y ajusta la frecuencia respiratoria para ver el ritmo de la respiración."
      apropiacion={Apropiacion}
      actividad={Actividad}
      evaluacionPath="/laboratorio/pulmones/evaluacion"
    >
      <div className="sim-canvas">
        <div className="sim-canvas-bg">
          <Aurora colorStops={['#be185d', '#1d4ed8', '#0e7490']} blend={0.35} amplitude={0.6} speed={0.25} />
        </div>
        <Suspense fallback={<div className="model3d-loading">Cargando modelo 3D…</div>}>
          <ModelViewer src={lungsUrl} mode="breathe" rate={respRate} />
        </Suspense>
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
    </SimulationWrapper>
  );
}
