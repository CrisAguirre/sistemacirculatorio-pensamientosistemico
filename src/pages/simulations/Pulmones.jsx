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
      <h2>Aplicación de Lineamientos: Representación y Escalas</h2>
      <p>Los pulmones son fundamentales para el intercambio gaseoso. En este componente aplicamos los <b>Lineamientos 3 y 4</b>: representar el objeto de estudio y cuantificar sus escalas, proporciones y cantidades.</p>
      <div className="video-container">
        <iframe src="https://www.youtube.com/embed/uUpdItCbr24" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
      </div>
      <p><b>(Lineamiento 3)</b> La representación 3D del movimiento rítmico (inhalación y exhalación) nos muestra los pulmones no solo anatómica sino funcionalmente: como la interfaz estructural entre el aire externo y la sangre interna.<br/><br/>
      <b>(Lineamiento 4)</b> Para comprenderlos, debemos establecer las cantidades en este intercambio: medir la frecuencia respiratoria, los porcentajes (proporciones) de oxígeno que ingresan al sistema, y el CO₂ que se desecha, determinando las escalas de normalidad y peligro.</p>
    </>
  );

  const Actividad = (
    <>
      <h2>Actividad: Cuantificando la Representación Respiratoria</h2>
      <div className="activity-steps">
        <div className="activity-step">
          <div className="step-number">1</div>
          <div className="step-content">
            <h4>Representación y Escala Basal (L3, L4)</h4>
            <p>Ve a la pestaña <b>Simulador</b> y observa la representación del ritmo respiratorio. Registra las cantidades iniciales: Frecuencia Respiratoria en reposo (resp/min), Saturación de O₂ (%) y CO₂ en sangre (%).</p>
          </div>
        </div>
        <div className="activity-step">
          <div className="step-number">2</div>
          <div className="step-content">
            <h4>Escalas de saturación (L4)</h4>
            <p>Desciende la saturación de O₂ a niveles bajos (menor a 90%). Registra el valor exacto y calcula la proporción: ¿qué porcentaje de oxigenación se ha perdido respecto al 98% ideal? ¿A partir de qué cantidad la alerta pasa de verde a rojo?</p>
          </div>
        </div>
        <div className="activity-step">
          <div className="step-number">3</div>
          <div className="step-content">
            <h4>Proporciones de compensación (L4)</h4>
            <p>Aumenta el nivel de CO₂ al máximo (10%). Registra simultáneamente las 3 métricas. Analiza la relación matemática: si la cantidad de CO₂ aumenta drásticamente en la sangre, ¿en qué proporción debe subir el ritmo respiratorio para compensarlo?</p>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <SimulationWrapper
      simNumber={5}
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
