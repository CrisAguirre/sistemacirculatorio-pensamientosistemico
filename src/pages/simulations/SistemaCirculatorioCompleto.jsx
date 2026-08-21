import { lazy, Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import SimulationWrapper from '../../components/shared/SimulationWrapper';
import EvidenciaTextarea from '../../components/shared/EvidenciaTextarea';
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
      <h2>Lineamientos 5, 6 y 7: Visión de Totalidad del Sistema Circulatorio</h2>
      <p>Este es el laboratorio final. Aquí integramos todo lo aprendido (componentes, causalidad, representación, escalas) y aplicamos la <b>Visión de Totalidad</b> del pensamiento sistémico: los lineamientos 5, 6 y 7.</p>
      <div className="video-container">
        <iframe src="https://www.youtube.com/embed/JmC9nEvw4T8" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
      </div>
      <div className="deco-container">
        <div className="deco-icon deco-spin">⚙️</div>
        <div className="deco-connector"></div>
        <div className="deco-icon deco-float">🔄</div>
        <div className="deco-connector"></div>
        <div className="deco-icon deco-spin-reverse">⚙️</div>
      </div>
      <h3>♻️ Lineamiento 5 — Conservación</h3>
      <p>En un sistema cerrado, la materia no se crea ni se destruye, solo se <b>transforma y transporta</b>. La sangre oxigenada sale del corazón → entrega O₂ a los tejidos → se convierte en sangre desoxigenada → vuelve al corazón → pasa por los pulmones → se re-oxigena. El <b>volumen se conserva</b>: lo que sale por las arterias, regresa por las venas.</p>
      <h3>🎯 Lineamiento 6 — Propósito</h3>
      <p>Todo sistema existe para cumplir un <b>propósito superior</b>. El propósito del sistema circulatorio es <b>mantener vivas las células del cuerpo</b>, entregándoles oxígeno y nutrientes, y retirando sus desechos (CO₂, toxinas). Cada subsistema contribuye a este propósito: el corazón bombea, los pulmones oxigenan, el cerebro regula, la sangre transporta.</p>
      <h3>⚖️ Lineamiento 7 — Estabilidad y Cambio (Homeostasis)</h3>
      <p>El sistema circulatorio busca permanentemente la <b>estabilidad</b> (homeostasis): mantener la presión, la oxigenación y el flujo en rangos seguros. Pero el mundo cambia constantemente (ejercicio, enfermedad, estrés), y el sistema debe <b>adaptarse al cambio</b> sin perder su equilibrio. La capacidad de regresar al equilibrio después de una perturbación se llama <b>resiliencia</b>.</p>
      <p style={{marginTop:'0.75rem', padding:'0.75rem', background:'rgba(59,130,246,0.1)', borderRadius:'0.5rem', borderLeft:'3px solid #3b82f6'}}>En este laboratorio consolidarás tu <b>visión de totalidad</b>: el todo es mayor que la suma de sus partes. El sistema circulatorio no es solo un corazón + sangre + pulmones + cerebro; es la <b>interacción coordinada</b> entre ellos lo que produce la vida.</p>
    </>
  );

  const Actividad = (
    <>
      <h2>Actividad: Visión de Totalidad — El Sistema en Acción</h2>
      <div className="activity-steps">
        <div className="activity-step">
          <div className="step-number">1</div>
          <div className="step-content">
            <h4>Conservación en equilibrio (L5)</h4>
            <p>Ve a la pestaña <b>Simulador</b>. En reposo (Actividad = 0%), registra todas las métricas. Observa cómo el Gasto Cardíaco, la Ventilación y las saturaciones se <b>conservan en flujo constante</b>: lo que el corazón expulsa, regresa; el O₂ que entra por los pulmones, se consume en los tejidos y vuelve como CO₂. <b>La materia se conserva</b> en un ciclo cerrado.</p>
          </div>
        </div>
        <div className="activity-step">
          <div className="step-number">2</div>
          <div className="step-content">
            <h4>El Propósito bajo máxima demanda (L6)</h4>
            <p>Sube la "Actividad metabólica" al <b>100%</b>. Los músculos necesitan urgentemente oxígeno. El <b>propósito</b> del sistema es que <b>ninguna célula muera por falta de O₂</b>. ¿Cómo actúan <b>coordinadamente</b> los 4 subsistemas (corazón, pulmones, sangre, cerebro) para cumplir este propósito? Registra las métricas y describe la respuesta integrada.</p>
          </div>
        </div>
        <div className="activity-step">
          <div className="step-number">3</div>
          <div className="step-content">
            <h4>Homeostasis: Estabilidad ante el Cambio (L7)</h4>
            <p>Baja manualmente la "Saturación arterial de O₂" a <b>75%</b> (simulando un fallo pulmonar grave o un ambiente sin oxígeno). Este es un <b>cambio crítico</b>. Observa cómo el sistema intenta recuperar la <b>estabilidad</b>: ¿qué debería pasar con la FC y la FR para compensar? ¿Logra el sistema regresar a un estado viable? Esta capacidad de adaptarse es la <b>homeostasis</b>.</p>
          </div>
        </div>
      </div>
      <EvidenciaTextarea titulo="Evidencia: Sistema Circulatorio Completo" />
    </>
  );

  return (
    <SimulationWrapper
      simNumber={6}
      title="Sistema Circulatorio Completo"
      description="El cuerpo como un sistema integrado: corazón, sangre, pulmones y cerebro acoplados."
      icon="🔄"
      info="Visión de Totalidad (L5, L6, L7): mueve la actividad metabólica y observa cómo todo el sistema responde en conjunto. El corazón (FC), los pulmones (FR), la sangre (saturaciones) y el cerebro (flujo cerebral) se acoplan para cumplir su propósito (L6), conservar la materia en ciclo (L5) y mantener la estabilidad ante los cambios (L7). El todo es mayor que la suma de sus partes."
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
        <div className="system-panel-title">🌐 Visión de Totalidad: el cuerpo como un sistema integrado (L5, L6, L7)</div>
        <div className="system-loop">
          <span className="system-node">Actividad (demanda O₂)</span>
          <span className="system-arrow">→</span>
          <span className="system-node">Cerebro (regula — L6)</span>
          <span className="system-arrow">→</span>
          <span className="system-node">Corazón (FC + fuerza)</span>
          <span className="system-arrow">→</span>
          <span className="system-node">Gasto cardíaco</span>
          <span className="system-arrow">→</span>
          <span className="system-node">Pulmones (ventilación)</span>
          <span className="system-arrow">→</span>
          <span className="system-node">Sangre (O₂ → tejidos → CO₂ — L5)</span>
          <span className="system-arrow">→</span>
          <span className="system-node">Homeostasis (L7)</span>
        </div>
        <p className="info-panel-body" style={{ marginTop: '0.75rem', marginBottom: 0 }}>
          <b>Conservación (L5):</b> el volumen de sangre que sale del corazón regresa por las venas — nada se pierde.
          <b> Propósito (L6):</b> cada órgano contribuye a un fin común: mantener vivas las células.
          <b> Estabilidad y Cambio (L7):</b> ante el ejercicio o la enfermedad, el sistema se adapta sin perder su equilibrio.
          Esta <b>visión de totalidad</b> es la esencia del pensamiento sistémico: el todo es mayor que la suma de las partes.
        </p>
      </div>
    </SimulationWrapper>
  );
}
