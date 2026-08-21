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
      <h2>Aplicación de Lineamientos: Componentes y Causalidad</h2>
      <p>El cerebro es el órgano ideal para aplicar los <b>Lineamientos 1 y 2</b> del pensamiento sistémico: identificar los componentes de control y establecer mecanismos de causa y efecto.</p>
      <div className="video-container">
        <iframe src="https://www.youtube.com/embed/AjkzLXGZqbg" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
      </div>
      <p><b>(Lineamiento 1)</b> El componente principal de control del sistema cardiovascular es el Sistema Nervioso Autónomo (SNA), subdividido en ramas simpática y parasimpática.<br/><br/>
      <b>(Lineamiento 2)</b> La causalidad es directa: una alta demanda de energía (causa) hace que el cerebro envíe señales simpáticas que aceleran el corazón (efecto). Una baja demanda (causa) activa señales parasimpáticas que lo frenan (efecto).</p>
    </>
  );

  const Actividad = (
    <>
      <h2>Actividad: Componentes del SNA y su Efecto Causal</h2>
      <div className="activity-steps">
        <div className="activity-step">
          <div className="step-number">1</div>
          <div className="step-content">
            <h4>Componente en Equilibrio (L1)</h4>
            <p>Ve a la pestaña <b>Simulador</b>. Con la demanda al 50%, observa el componente activo en "Dominio del SNA". En este estado base, anota cuál es el flujo sanguíneo cerebral y la frecuencia cardíaca.</p>
          </div>
        </div>
        <div className="activity-step">
          <div className="step-number">2</div>
          <div className="step-content">
            <h4>Causalidad Simpática (L2)</h4>
            <p>Aumenta la demanda al 100% (causa). ¿Qué componente del SNA toma el control? Registra el efecto inmediato en la frecuencia cardíaca y en el flujo sanguíneo que el cerebro se auto-asigna para soportar la carga.</p>
          </div>
        </div>
        <div className="activity-step">
          <div className="step-number">3</div>
          <div className="step-content">
            <h4>Causalidad Parasimpática (L2)</h4>
            <p>Baja la demanda al 0% (causa). ¿Qué componente entra a dominar? Analiza el efecto de "frenado" en el corazón y deduce por qué este mecanismo causal es vital para evitar el desgaste del órgano.</p>
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
