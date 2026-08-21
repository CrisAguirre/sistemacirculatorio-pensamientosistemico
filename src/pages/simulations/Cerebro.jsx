import { lazy, Suspense, useState } from 'react';
import { Link } from 'react-router-dom';
import EvidenciaTextarea from '../../components/shared/EvidenciaTextarea';
import SimulationWrapper from '../../components/shared/SimulationWrapper';
import SequenceCarousel from '../../components/shared/SequenceCarousel';
import { Aurora, FadeContent } from '../../reactbits';
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

  const Actividad = (
    <div className="actividad-immersive-container">
      <h2 className="text-neon-blue mb-3">Actividad Práctica: El Cerebro como Centro de Control Causal</h2>
      <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        Interactúa con el simulador variando la demanda y observa cómo el cerebro responde. 
        <strong style={{ color: '#60a5fa' }}> Por favor, agregue descripciones escritas, datos cuantitativos o palabras clave relacionadas con la temática de cada pregunta en su respectivo cajón de texto.</strong>
      </p>

      <div className="activity-steps-immersive" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>

        <div className="glass-panel" style={{ padding: '2rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, right: 0, width: '150px', height: '150px', background: 'radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 70%)', pointerEvents: 'none' }}></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div className="step-number" style={{ background: '#a855f7', boxShadow: '0 0 15px rgba(168,85,247,0.5)' }}>1</div>
            <h4 style={{ margin: 0, fontSize: '1.25rem', color: '#c084fc' }}>Componentes en reposo (L1)</h4>
          </div>
          <p style={{ lineHeight: '1.7', marginBottom: '1.5rem', color: '#e2e8f0' }}>
            Ve a la pestaña <strong>Desarrollo</strong>. Con la demanda al 50% (equilibrio), observa el componente activo del SNA en la métrica "Dominio del SNA". Registra la Frecuencia Cardíaca y el Flujo sanguíneo cerebral (%). Estos son los valores base donde ningún componente domina sobre otro.
          </p>
          <EvidenciaTextarea 
            titulo="Cerebro - Actividad 1: Reposo" 
            placeholder="Agregue aquí los valores basales registrados..."
          />
        </div>

        <div className="glass-panel" style={{ padding: '2rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, right: 0, width: '150px', height: '150px', background: 'radial-gradient(circle, rgba(239,68,68,0.15) 0%, transparent 70%)', pointerEvents: 'none' }}></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div className="step-number" style={{ background: '#ef4444', boxShadow: '0 0 15px rgba(239,68,68,0.5)' }}>2</div>
            <h4 style={{ margin: 0, fontSize: '1.25rem', color: '#f87171' }}>Simula el ejercicio: cadena causal simpática (L2)</h4>
          </div>
          <p style={{ lineHeight: '1.7', marginBottom: '1.5rem', color: '#e2e8f0' }}>
            Sube la demanda al 100% (simula ejercicio intenso). ¿Qué componente del SNA toma el control? Registra la nueva FC y el flujo cerebral. Explica cómo la causa (ejercicio) hizo que el cerebro ordene al corazón latir más rápido (efecto).
          </p>
          <EvidenciaTextarea 
            titulo="Cerebro - Actividad 2: Ejercicio Intenso" 
            placeholder="Describe el dominio del SNA y los valores registrados..."
          />
        </div>

        <div className="glass-panel" style={{ padding: '2rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, right: 0, width: '150px', height: '150px', background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)', pointerEvents: 'none' }}></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div className="step-number" style={{ background: '#3b82f6', boxShadow: '0 0 15px rgba(59,130,246,0.5)' }}>3</div>
            <h4 style={{ margin: 0, fontSize: '1.25rem', color: '#60a5fa' }}>Causalidad parasimpática: el freno vital (L2)</h4>
          </div>
          <p style={{ lineHeight: '1.7', marginBottom: '1.5rem', color: '#e2e8f0' }}>
            Baja la demanda al 0% (reposo total). ¿Qué componente entra a dominar? Explica por qué este mecanismo causal de "frenado" es vital para la supervivencia y qué pasaría sistémicamente si no existiera.
          </p>
          <EvidenciaTextarea 
            titulo="Cerebro - Actividad 3: Freno Vital" 
            placeholder="Describe el efecto del freno parasimpático en el sistema..."
          />
        </div>

      </div>
    </div>
  );

  return (
    <SimulationWrapper
      simNumber={3}
      title="El Cerebro"
      description="Conoce la regulación de la circulación y la alta demanda de flujo sanguíneo del cerebro."
      icon="🧠"
      info="El cerebro regula la frecuencia cardíaca y la presión, y aunque pesa poco, demanda cerca del 15-20% del flujo sanguíneo total por su constante necesidad de oxígeno y glucosa."
      actividad={Actividad}
      evaluacionPath="/laboratorio/cerebro/evaluacion"
    >
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ color: '#60a5fa', fontSize: '1.8rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '2rem', filter: 'drop-shadow(0 0 8px rgba(96,165,250,0.6))' }}>🔬</span>
          Simulador del Cerebro
        </h2>
      </div>

      <div className="sim-canvas">
        <div className="sim-canvas-bg">
          <Aurora colorStops={['#4c1d95', '#1d4ed8', '#0e7490']} blend={0.35} amplitude={0.6} speed={0.25} />
        </div>
        <Suspense fallback={<div className="model3d-loading">Cargando modelo 3D…</div>}}>
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