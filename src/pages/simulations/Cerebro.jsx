import { lazy, Suspense, useState } from 'react';
import { Link } from 'react-router-dom';
import SimulationWrapper from '../../components/shared/SimulationWrapper';
import { Aurora } from '../../reactbits';
import brainUrl from '../../assets/models/brain.glb?url';
import '../pages.css';
import './simulations.css';

const ModelViewer = lazy(() => import('../../components/three/ModelViewer'));

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

export default function Cerebro() {
  const [demanda, setDemanda] = useState(50);
  const bpm = Math.round(60 + (demanda / 100) * 80);
  const flujoCerebral = clamp(12 + (demanda / 100) * 8, 12, 20);

  const Apropiacion = (
    <>
      <h2>Representar el objeto de estudio: El Cerebro</h2>
      <p>El cerebro es el centro de control del sistema circulatorio. Representarlo como objeto de estudio nos permite visualizar cómo este órgano, aunque pesa apenas un 2% del peso corporal, demanda el 15-20% del flujo sanguíneo total por su constante necesidad de oxígeno y glucosa.</p>
      <div className="video-container">
        <iframe src="https://www.youtube.com/embed/AjkzLXGZqbg" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
      </div>
      <p>En la representación 3D se observa la estructura cerebral y cerebelosa. El cerebro actúa como regulador del sistema cardiovascular a través del Sistema Nervioso Autónomo (SNA), enviando señales simpáticas (acelerar) o parasimpáticas (frenar) al corazón según la demanda del cuerpo.</p>
    </>
  );

  const Actividad = (
    <>
      <h2>Actividad: Escalas, proporciones y cantidades cerebrales</h2>
      <div className="activity-steps">
        <div className="activity-step">
          <div className="step-number">1</div>
          <div className="step-content">
            <h4>Cuantifica la demanda en equilibrio</h4>
            <p>Ve a la pestaña <b>Simulador</b>. Con la demanda al 50%, registra los valores de FC (lpm) y Flujo Sanguíneo Cerebral (%). Estos son las cantidades de referencia del estado de equilibrio.</p>
          </div>
        </div>
        <div className="activity-step">
          <div className="step-number">2</div>
          <div className="step-content">
            <h4>Proporciones en alta demanda</h4>
            <p>Aumenta la demanda al 100%. Registra las nuevas cantidades y calcula: ¿en qué proporción aumentó la FC respecto al paso 1? ¿Cuánto creció el flujo cerebral en porcentaje? ¿Cuál es la escala de cambio entre estado simpático y equilibrio?</p>
          </div>
        </div>
        <div className="activity-step">
          <div className="step-number">3</div>
          <div className="step-content">
            <h4>Escala mínima de funcionamiento</h4>
            <p>Baja la demanda al 0%. Registra los valores mínimos del sistema. Compara los 3 estados (0%, 50%, 100%) y elabora una tabla con las cantidades, identificando las proporciones de cambio entre cada escala.</p>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <SimulationWrapper
      simNumber={4}
      title="El Cerebro"
      description="Conoce la regulación de la circulación y la alta demanda de flujo sanguíneo del cerebro."
      icon="🧠"
      info="El cerebro regula la frecuencia cardíaca y la presión, y aunque pesa poco, demanda cerca del 15-20% del flujo sanguíneo total por su constante necesidad de oxígeno y glucosa."
      apropiacion={Apropiacion}
      actividad={Actividad}
      evaluacionPath="/laboratorio/cerebro/evaluacion"
    >
      <div className="sim-canvas">
        <div className="sim-canvas-bg">
          <Aurora colorStops={['#4c1d95', '#1d4ed8', '#0e7490']} blend={0.35} amplitude={0.6} speed={0.25} />
        </div>
        <Suspense fallback={<div className="model3d-loading">Cargando modelo 3D…</div>}>
          <ModelViewer src={brainUrl} mode="pulse" rate={bpm} />
        </Suspense>
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
    </SimulationWrapper>
  );
}
