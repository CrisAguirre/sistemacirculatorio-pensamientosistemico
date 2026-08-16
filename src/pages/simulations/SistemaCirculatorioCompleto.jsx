import { lazy, Suspense, useState } from 'react';
import { Link } from 'react-router-dom';
import SimulationWrapper from '../../components/shared/SimulationWrapper';
import { Aurora } from '../../reactbits';
import circulatoryUrl from '../../assets/models/circulatory_system.glb?url';
import '../pages.css';
import './simulations.css';

const ModelViewer = lazy(() => import('../../components/three/ModelViewer'));

export default function SistemaCirculatorioCompleto() {
  const [bpm, setBpm] = useState(75);
  const [demanda, setDemanda] = useState(50);

  const gasto = ((bpm * 70) / 1000).toFixed(1);
  const satArterial = 98;
  const satVenosa = Math.round(75 - (demanda / 100) * 30);

  return (
    <SimulationWrapper
      simNumber={5}
      title="Sistema Circulatorio Completo"
      description="Integra corazón, sangre, pulmones y cerebro en una visión de sistema completo."
      icon="🔄"
      info="Explora el modelo 3D del sistema circulatorio humano. Gira y acerca para observar cómo el corazón, los vasos y los órganos se conectan en un solo sistema."
    >
      <div className="sim-canvas">
        <div className="sim-canvas-bg">
          <Aurora colorStops={['#7f1d1d', '#1d4ed8', '#0e7490']} blend={0.35} amplitude={0.7} speed={0.25} />
        </div>
        <Suspense fallback={<div className="model3d-loading">Cargando modelo 3D…</div>}>
          <ModelViewer src={circulatoryUrl} mode="none" autoRotate height={560} />
        </Suspense>
      </div>

      <div className="sim-sliders">
        <div className="sim-slider-field">
          <label htmlFor="sc-bpm-slider">
            <span>Frecuencia cardíaca</span>
            <span>{bpm} lpm</span>
          </label>
          <input id="sc-bpm-slider" type="range" min="40" max="180" value={bpm} onChange={(e) => setBpm(Number(e.target.value))} />
        </div>
        <div className="sim-slider-field">
          <label htmlFor="sc-demanda-slider">
            <span>Demanda de oxígeno (actividad)</span>
            <span>{demanda}%</span>
          </label>
          <input id="sc-demanda-slider" type="range" min="0" max="100" value={demanda} onChange={(e) => setDemanda(Number(e.target.value))} />
        </div>
      </div>

      <div className="sim-metrics">
        <div className="metric-card">
          <div className="metric-value">{gasto}</div>
          <div className="metric-label">Gasto cardíaco (L/min)</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">{satArterial}%</div>
          <div className="metric-label">Saturación arterial (sale del corazón)</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">{satVenosa}%</div>
          <div className="metric-label">Saturación venosa (retorna al corazón)</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">{bpm}</div>
          <div className="metric-label">Frecuencia cardíaca</div>
        </div>
      </div>

      <div className="system-panel">
        <div className="system-panel-title">🌐 El sistema circulatorio como un todo integrado</div>
        <p className="info-panel-body" style={{ marginTop: '0.5rem', marginBottom: 0 }}>
          Observa el bucle completo: el corazón bombea → la sangre oxigenada sale por las arterias →
          los tejidos consumen oxígeno → la sangre desoxigenada regresa por las venas → los pulmones la
          vuelven a oxigenar. Cada componente (corazón, sangre, pulmones, cerebro) es un subsistema,
          y juntos forman un sistema con propiedades que ninguno tiene por separado: la circulación.
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
