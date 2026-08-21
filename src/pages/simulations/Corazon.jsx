import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import EvidenciaTextarea from '../../components/shared/EvidenciaTextarea';
import CustomVideoPlayer from '../../components/shared/CustomVideoPlayer';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ReferenceArea, ResponsiveContainer, Legend } from 'recharts';
import SimulationWrapper from '../../components/shared/SimulationWrapper';
import ECGMonitor from '../../components/heart/ECGMonitor';
import { Aurora } from '../../reactbits';
import { heartSound, ensureAudio, closeAudio } from '../../components/heart/heartSound';
import { HEART_STATES, getState } from './heartStates';
import '../../components/heart/heart.css';
import '../pages.css';

const Heart3D = lazy(() => import('../../components/heart/Heart3D'));

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function paCategory(systolic, diastolic) {
  if (systolic < 90 || diastolic < 60) return 'danger';
  if (systolic >= 140 || diastolic >= 90) return 'danger';
  if (systolic >= 120 || diastolic >= 80) return 'warn';
  return 'ok';
}

function fcCategory(bpm) {
  if (bpm < 60 || bpm > 100) return 'warn';
  return 'ok';
}

export default function Corazon() {
  const [selected, setSelected] = useState('normal');
  const [fc, setFc] = useState(75);
  const [sys, setSys] = useState(120);
  const [soundOn, setSoundOn] = useState(false);

  const soundRef = useRef(false);

  useEffect(() => {
    soundRef.current = soundOn;
    if (soundOn) ensureAudio();
    else closeAudio();
  }, [soundOn]);

  useEffect(() => () => closeAudio(), []);

  const onLub = useCallback(() => {
    if (soundRef.current) heartSound.lub();
  }, []);

  const onDub = useCallback(() => {
    if (soundRef.current) heartSound.dub();
  }, []);

  const state = selected ? getState(selected) : null;

  const bpm = state ? state.bpm : fc;
  const systolic = state ? state.systolic : sys;
  const diastolic = state ? state.diastolic : Math.round(sys * 0.62);
  const strength = state ? state.strength : clamp((sys - 70) / 100, 0.2, 1);
  const depth = state ? state.depth : 0.06 + strength * 0.14;
  const irregular = state ? state.irregular : false;

  const cardiacOutput = ((bpm * (50 + strength * 60)) / 1000).toFixed(1);

  // --- Historial para la gráfica de enfermedades cardíacas ---
  const [chartData, setChartData] = useState([]);
  const sampleRef = useRef(0);

  function getDiagnosis(heartRate) {
    if (heartRate < 50) return 'Bradicardia severa';
    if (heartRate < 60) return 'Bradicardia';
    if (heartRate <= 100) return 'Normal';
    if (heartRate <= 150) return 'Taquicardia';
    return 'Taquicardia severa';
  }

  function addSample() {
    sampleRef.current += 1;
    setChartData((prev) => {
      const next = [...prev, { t: sampleRef.current, FC: bpm, PA: systolic }];
      return next.length > 15 ? next.slice(-15) : next;
    });
  }

  function selectState(id) {
    const s = getState(id);
    setSelected(id);
    setFc(s.bpm);
    setSys(s.systolic);
  }

  function onFcChange(e) {
    setSelected(null);
    setFc(Number(e.target.value));
  }

  function onSysChange(e) {
    setSelected(null);
    setSys(Number(e.target.value));
  }

  const currentDiag = getDiagnosis(bpm);
  const diagColor = currentDiag === 'Normal' ? '#22c55e' : currentDiag.includes('severa') ? '#ef4444' : '#f59e0b';

  const Actividad = (
    <div>
      <h2>Actividad: Representación Gráfica de Enfermedades Cardíacas</h2>
      <div className="activity-steps">
        <div className="activity-step">
          <div className="step-number">1</div>
          <div className="step-content">
            <h4>Representación basal — Latido Normal (L3)</h4>
            <p>Ve a la pestaña <strong>Desarrollo</strong>. Selecciona "Latido Normal" y observa la representación 3D y el ECG. Presiona el botón "Registrar punto" debajo de la gráfica para guardar esta primera medición en la zona verde (Normal). Anota la FC y el Gasto Cardíaco.</p>
          </div>
        </div>
        <div className="activity-step">
          <div className="step-number">2</div>
          <div className="step-content">
            <h4>Escala de enfermedad: Taquicardia (L4)</h4>
            <p>Usa el deslizador para subir la FC a 160 lpm. Registra el punto en la gráfica. Observa cómo la línea entra en la zona roja (Taquicardia severa). ¿En qué proporción aumentó el Gasto Cardíaco? ¿Qué enfermedades o síntomas se asocian a permanecer en esta escala?</p>
          </div>
        </div>
        <div className="activity-step">
          <div className="step-number">3</div>
          <div className="step-content">
            <h4>Escala opuesta: Bradicardia (L4)</h4>
            <p>Baja la FC a 45 lpm y registra el punto. La gráfica ahora representa visualmente (L3) el contraste entre ambas escalas extremas. Elabora una tabla con los 3 estados y analiza: cuando la cantidad sale de la escala normal, qué enfermedad aparece y cómo afecta al sistema.</p>
          </div>
        </div>
      </div>
      <EvidenciaTextarea titulo="Evidencia: Laboratorio del Corazón" />
    </div>
  );

  return (
    <SimulationWrapper
      simNumber={4}
      title="El Corazón"
      description="Simula el corazón como una bomba dentro de un sistema: cambia su estado y observa cómo responde."
      icon="🫀"
      info="El corazón bombea la sangre a través de sus grandes vasos: la aorta (roja) lleva sangre oxigenada del ventrículo izquierdo al cuerpo; el tronco pulmonar (azul) lleva sangre desoxigenada del ventrículo derecho a los pulmones; las venas cavas retornan la sangre del cuerpo a la aurícula derecha; y las venas pulmonares traen la sangre oxigenada de los pulmones a la aurícula izquierda. Observa el ECG, escucha los latidos y cambia el estado para ver la respuesta del sistema."
      actividad={Actividad}
      evaluacionPath="/laboratorio/corazon/evaluacion"
    >
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ color: '#60a5fa', fontSize: '1.8rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '2rem', filter: 'drop-shadow(0 0 8px rgba(96,165,250,0.6))' }}>🔬</span>
          Simulador del Corazón
        </h2>
      </div>

      <div className="heart-toolbar">
        <div className="heart-controls">
          {HEART_STATES.map((s) => (
            <button
              key={s.id}
              type="button"
              className={`state-btn ${selected === s.id ? 'active' : ''}`}
              style={{ '--state-color': s.color }}
              onClick={() => selectState(s.id)}
            >
              <span className="state-btn-icon">{s.icon}</span>
              <span className="state-btn-label">{s.label}</span>
            </button>
          ))}
        </div>
        <button
          type="button"
          className={`sound-btn ${soundOn ? 'on' : ''}`}
          onClick={() => setSoundOn((v) => !v)}
          title={soundOn ? 'Silenciar latidos' : 'Activar sonido de latidos'}
        >
          {soundOn ? '🔊' : '🔇'} {soundOn ? 'Sonido activado' : 'Escuchar latidos'}
        </button>
      </div>

      {state && (
        <div className="system-panel" style={{ marginBottom: '1rem' }}>
          <div className="system-panel-title">{state.icon} {state.title}</div>
          <p className="info-panel-body" style={{ margin: 0 }}>{state.desc}</p>
        </div>
      )}

      <div className="heart-stage">
        <div className="heart-stage-bg">
          <Aurora colorStops={['#7f1d1d', '#1d4ed8', '#0e7490']} blend={0.4} amplitude={0.7} speed={0.25} />
        </div>
        <Suspense fallback={<div className="heart3d-loading">Cargando corazón 3D...</div>}>
          <Heart3D bpm={bpm} depth={depth} irregular={irregular} onLub={onLub} onDub={onDub} />
        </Suspense>
      </div>

      <ECGMonitor bpm={bpm} irregular={irregular} />

      <div className="heart-legend">
        <span><span className="legend-dot legend-red" /> Sangre oxigenada</span>
        <span><span className="legend-dot legend-blue" /> Sangre desoxigenada</span>
        <span><span className="legend-dot legend-ecg" /> Electrocardiograma (ECG)</span>
      </div>
      <div className="heart-legend">
        <span>🔴 Aorta → cuerpo</span>
        <span>🔵 Tronco pulmonar → pulmones</span>
        <span>🔵 Venas cavas → aurícula derecha</span>
        <span>🔴 Venas pulmonares → aurícula izquierda</span>
      </div>

      <div className="heart-metrics">
        <div className="metric-card">
          <div className={`metric-value ${fcCategory(bpm)}`}>{bpm}</div>
          <div className="metric-label">Frecuencia cardíaca (lpm)</div>
        </div>
        <div className="metric-card">
          <div className={`metric-value ${paCategory(systolic, diastolic)}`}>{systolic}/{diastolic}</div>
          <div className="metric-label">Presión arterial (mmHg)</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">{cardiacOutput}</div>
          <div className="metric-label">Gasto cardíaco (L/min)</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">{Math.round(strength * 100)}%</div>
          <div className="metric-label">Fuerza de contracción</div>
        </div>
      </div>

      <div className="heart-sliders">
        <div className="slider-field">
          <label htmlFor="fc-slider">
            <span>Frecuencia cardíaca</span>
            <span>{bpm} lpm</span>
          </label>
          <input id="fc-slider" type="range" min="40" max="200" value={bpm} onChange={onFcChange} />
        </div>
        <div className="slider-field">
          <label htmlFor="sys-slider">
            <span>Presión sistólica</span>
            <span>{systolic} mmHg</span>
          </label>
          <input id="sys-slider" type="range" min="70" max="190" value={systolic} onChange={onSysChange} />
        </div>
      </div>

      <div className="system-panel" style={{ marginBottom: '1rem', textAlign: 'center' }}>
        <div className="system-panel-title">🩺 Diagnóstico actual</div>
        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: diagColor, margin: '0.5rem 0' }}>{currentDiag}</div>
        <p className="info-panel-body" style={{ margin: '0.5rem 0', fontSize: '0.85rem' }}>
          FC = {bpm} lpm · PA = {systolic}/{diastolic} mmHg · Gasto = {cardiacOutput} L/min
        </p>
      </div>

      <div className="system-panel">
        <div className="system-panel-title">📊 Representación: FC vs Medición (Lineamientos 3 y 4)</div>
        <p className="info-panel-body" style={{ margin: '0.5rem 0', fontSize: '0.85rem' }}>
          Modifica los sliders y presiona "Registrar punto" para construir tu gráfica. Las zonas de color representan las escalas de enfermedad.
        </p>
        <div style={{ width: '100%', height: 280 }}>
          <ResponsiveContainer>
            <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="t" label={{ value: 'Medición', position: 'insideBottom', offset: -2, style: { fill: '#94a3b8', fontSize: 12 } }} tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis domain={[30, 210]} label={{ value: 'lpm / mmHg', angle: -90, position: 'insideLeft', style: { fill: '#94a3b8', fontSize: 12 } }} tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#f1f5f9' }} />
              <Legend wrapperStyle={{ color: '#94a3b8', fontSize: 12 }} />
              <ReferenceArea y1={30} y2={60} fill="#f59e0b" fillOpacity={0.12} label={{ value: 'Bradicardia', position: 'insideTopLeft', style: { fill: '#f59e0b', fontSize: 11, fontWeight: 600 } }} />
              <ReferenceArea y1={60} y2={100} fill="#22c55e" fillOpacity={0.10} label={{ value: 'Normal', position: 'insideTopLeft', style: { fill: '#22c55e', fontSize: 11, fontWeight: 600 } }} />
              <ReferenceArea y1={100} y2={150} fill="#f59e0b" fillOpacity={0.12} label={{ value: 'Taquicardia', position: 'insideTopLeft', style: { fill: '#f59e0b', fontSize: 11, fontWeight: 600 } }} />
              <ReferenceArea y1={150} y2={210} fill="#ef4444" fillOpacity={0.15} label={{ value: 'Taquicardia severa', position: 'insideTopLeft', style: { fill: '#ef4444', fontSize: 11, fontWeight: 600 } }} />
              <ReferenceLine y={60} stroke="#f59e0b" strokeDasharray="4 4" />
              <ReferenceLine y={100} stroke="#f59e0b" strokeDasharray="4 4" />
              <ReferenceLine y={150} stroke="#ef4444" strokeDasharray="4 4" />
              <Line type="monotone" dataKey="FC" name="Frecuencia Cardíaca" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="PA" name="Presión Sistólica" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '0.75rem' }}>
          <button type="button" className="sim-btn active" onClick={addSample} style={{ padding: '0.5rem 1.5rem' }}>
            📌 Registrar punto
          </button>
          <button type="button" className="sim-btn" onClick={() => { setChartData([]); sampleRef.current = 0; }} style={{ padding: '0.5rem 1.5rem' }}>
            🗑️ Limpiar gráfica
          </button>
        </div>
      </div>

      <div className="system-panel">
        <div className="system-panel-title">🔁 Bucle de retroalimentación (pensamiento sistémico)</div>
        <div className="system-loop">
          <span className="system-node">Estímulo</span>
          <span className="system-arrow">→</span>
          <span className="system-node">Cerebro</span>
          <span className="system-arrow">→</span>
          <span className="system-node">SNA (simpático / parasimpático)</span>
          <span className="system-arrow">→</span>
          <span className="system-node">Corazón (frecuencia + fuerza)</span>
          <span className="system-arrow">→</span>
          <span className="system-node">Presión arterial</span>
          <span className="system-arrow">→</span>
          <span className="system-node">Barorreceptores</span>
          <span className="system-arrow">→</span>
          <span className="system-node">Cerebro</span>
        </div>
        <p className="info-panel-body" style={{ marginTop: '0.75rem', marginBottom: 0 }}>
          El corazón es un subsistema en retroalimentación constante: percibe la demanda del cuerpo y se adapta.
          Comprender estas conexiones (y no el órgano aislado) es la esencia del pensamiento sistémico.
        </p>
      </div>
    </SimulationWrapper>
  );
}