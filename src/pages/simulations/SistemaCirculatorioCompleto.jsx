import { lazy, Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import SimulationWrapper from '../../components/shared/SimulationWrapper';
import { Aurora } from '../../reactbits';
import '../pages.css';
import './simulations.css';

const BodyComposition = lazy(() => import('../../components/three/BodyComposition'));

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

  const metrics = [
    { label: 'Gasto cardíaco', value: `${co}`, unit: 'L/min' },
    { label: 'Presión arterial', value: `${sys}/${dia}`, unit: 'mmHg' },
    { label: 'Volumen sistólico', value: `${sv}`, unit: 'ml' },
    { label: 'Saturación arterial O₂', value: `${saO2}%`, unit: '' },
    { label: 'Saturación venosa O₂', value: `${svO2}%`, unit: '' },
    { label: 'Flujo cerebral', value: `${cbf}`, unit: 'L/min' },
    { label: 'Ventilación', value: `${ve}`, unit: 'L/min' },
  ];

  const Apropiacion = (
    <>
      <h2>Representar el objeto de estudio: El Sistema Circulatorio Completo</h2>
      <p>El sistema circulatorio es más que la suma de sus partes. Representarlo como sistema completo nos permite visualizar cómo los 4 subsistemas (corazón, sangre, pulmones y cerebro) operan de forma integrada, formando un circuito cerrado que mantiene la vida.</p>
      <div className="video-container">
        <iframe src="https://www.youtube.com/embed/JmC9nEvw4T8" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
      </div>
      <p>En la representación 3D se observan los 4 modelos posicionados anatómicamente dentro del cuerpo humano. Esta vista integrada permite comprender la homeostasis: el equilibrio dinámico que el sistema busca mantener ante cualquier perturbación externa como el ejercicio o una crisis de salud.</p>
    </>
  );

  const Actividad = (
    <>
      <h2>Actividad: Escalas, proporciones y cantidades del sistema integrado</h2>
      <div className="activity-steps">
        <div className="activity-step">
          <div className="step-number">1</div>
          <div className="step-content">
            <h4>Registra las cantidades base</h4>
            <p>Ve a la pestaña <b>Simulador</b>. En reposo (Actividad metabólica = 0%), registra todas las métricas: Gasto Cardíaco (L/min), Presión arterial (mmHg), Volumen sistólico (ml), Saturación arterial y venosa de O₂ (%), Flujo cerebral (L/min) y Ventilación (L/min).</p>
          </div>
        </div>
        <div className="activity-step">
          <div className="step-number">2</div>
          <div className="step-content">
            <h4>Compara escalas en ejercicio extremo</h4>
            <p>Sube la actividad metabólica al 100%. Registra las mismas métricas y calcula la proporción de cambio de cada una respecto al reposo. ¿Cuál variable cambió en mayor proporción? ¿Cuál cambió menos? ¿Por qué?</p>
          </div>
        </div>
        <div className="activity-step">
          <div className="step-number">3</div>
          <div className="step-content">
            <h4>Relaciones cuantitativas cruzadas</h4>
            <p>Baja manualmente la saturación arterial de O₂ a 75%. Observa las métricas derivadas y analiza: ¿en qué cantidad debería aumentar la FC o la FR para compensar esa caída? Elabora una tabla comparativa de los 3 estados (reposo, ejercicio, crisis).</p>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <SimulationWrapper
      simNumber={5}
      title="Sistema Circulatorio Completo"
      description="El cuerpo como un sistema integrado: corazón, sangre, pulmones y cerebro acoplados."
      icon="🔄"
      info="Mueve la actividad metabólica y observa cómo todo el sistema responde en conjunto: el corazón late más rápido, los pulmones respiran más, la presión sube y la sangre entrega más oxígeno. Es la esencia del pensamiento sistémico."
      apropiacion={Apropiacion}
      actividad={Actividad}
      evaluacionPath="/laboratorio/sistema-circulatorio/evaluacion"
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

      {/* Composición de los 4 subsistemas dentro del cuerpo */}
      <div className="sim-canvas">
        <div className="sim-canvas-bg">
          <Aurora colorStops={['#7f1d1d', '#1d4ed8', '#0e7490']} blend={0.35} amplitude={0.7} speed={0.25} />
        </div>
        <Suspense fallback={<div className="model3d-loading" style={{ height: 600 }}>Cargando modelos 3D…</div>}>
          <BodyComposition bpm={bpm} resp={resp} />
        </Suspense>
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
    </SimulationWrapper>
  );
}
