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
      <h2>Lineamientos 1 y 2: Componentes y Causalidad en el Cerebro</h2>
      <p>En el laboratorio anterior viste los componentes de la sangre y cómo el ejercicio desencadena una cadena causal. Ahora profundizamos: <b>¿quién da la orden de iniciar esa cadena?</b> El cerebro es el <b>componente director</b> (L1) que interpreta las señales y dispara los efectos causales (L2) en todo el sistema circulatorio.</p>
      <div className="video-container">
        <iframe src="https://www.youtube.com/embed/AjkzLXGZqbg" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
      </div>
      <h3>🧠 Lineamiento 1 — Componentes de control</h3>
      <p>El cerebro controla el sistema circulatorio a través del <b>Sistema Nervioso Autónomo (SNA)</b>, que tiene dos ramas (componentes funcionales):</p>
      <ul style={{ paddingLeft: '1.2rem', lineHeight: 1.8 }}>
        <li><b>Rama Simpática (↑):</b> se activa durante el <b>ejercicio</b> o el estrés. Envía señales que aceleran el corazón, aumentan la presión arterial y priorizan el flujo sanguíneo hacia los músculos.</li>
        <li><b>Rama Parasimpática (↓):</b> se activa en <b>reposo</b>. Frena el corazón y reduce la presión, permitiendo la recuperación del sistema.</li>
      </ul>
      <h3>⚡ Lineamiento 2 — El cerebro como disparador causal</h3>
      <p>La causalidad es directa y bidireccional:</p>
      <ul style={{ paddingLeft: '1.2rem', lineHeight: 1.8 }}>
        <li><b>Ejercicio (causa)</b> → Músculos demandan O₂ → <b>Cerebro detecta</b> la caída de O₂ → Activa simpático → <b>Corazón acelera</b> (efecto).</li>
        <li><b>Reposo (causa)</b> → Demanda baja → <b>Cerebro detecta</b> equilibrio → Activa parasimpático → <b>Corazón frena</b> (efecto).</li>
      </ul>
      <p>El cerebro no solo recibe información: <b>es a la vez consumidor</b> (necesita el 15-20% del flujo sanguíneo total) <b>y regulador</b> del sistema. Esta doble función lo convierte en un nodo crítico de la red causal.</p>
    </>
  );

  const Actividad = (
    <>
      <h2>Actividad: El Cerebro como Centro de Control Causal</h2>
      <div className="activity-steps">
        <div className="activity-step">
          <div className="step-number">1</div>
          <div className="step-content">
            <h4>Componentes en reposo (L1)</h4>
            <p>Ve a la pestaña <b>Simulador</b>. Con la demanda al <b>50%</b> (equilibrio), observa el componente activo del SNA en la métrica "Dominio del SNA". Registra la FC y el Flujo sanguíneo cerebral (%). Estos son los valores base donde <b>ningún componente</b> domina sobre otro.</p>
          </div>
        </div>
        <div className="activity-step">
          <div className="step-number">2</div>
          <div className="step-content">
            <h4>Simula el ejercicio: cadena causal simpática (L2)</h4>
            <p>Sube la demanda al <b>100%</b> (simula ejercicio intenso). ¿Qué <b>componente del SNA</b> toma el control? Registra la nueva FC y el flujo cerebral. La <b>causa</b> (ejercicio) hizo que el cerebro ordene al corazón latir más rápido (efecto). Además, observa que el cerebro se auto-asigna más sangre, porque él también necesita más O₂ para procesar tanta información.</p>
          </div>
        </div>
        <div className="activity-step">
          <div className="step-number">3</div>
          <div className="step-content">
            <h4>Causalidad parasimpática: el freno vital (L2)</h4>
            <p>Baja la demanda al <b>0%</b> (reposo total). ¿Qué componente entra a dominar? Explica por qué este mecanismo causal de "frenado" es <b>vital para la supervivencia</b>: sin él, el corazón se desgastaría latiendo constantemente a máxima velocidad. Registra cómo el sistema busca recuperarse después del ejercicio.</p>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <SimulationWrapper
      simNumber={3}
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
