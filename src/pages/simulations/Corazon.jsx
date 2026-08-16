import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
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

  return (
    <SimulationWrapper
      simNumber={1}
      title="El Corazón"
      description="Simula el corazón como una bomba dentro de un sistema: cambia su estado y observa cómo responde."
      icon="🫀"
      info="El corazón no trabaja solo: es un subsistema que responde a la demanda de oxígeno y a las señales del sistema nervioso. Observa el ECG, escucha los latidos y cambia el estado para ver la respuesta del sistema."
    >
      {/* Selector de estados + sonido */}
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

      {/* Diagrama animado */}
      <div className="heart-stage">
        <div className="heart-stage-bg">
          <Aurora colorStops={['#7f1d1d', '#1d4ed8', '#0e7490']} blend={0.4} amplitude={0.7} speed={0.25} />
        </div>
        <Suspense fallback={<div className="heart3d-loading">Cargando corazón 3D…</div>}>
          <Heart3D bpm={bpm} depth={depth} irregular={irregular} onLub={onLub} onDub={onDub} />
        </Suspense>
      </div>

      {/* Monitor ECG */}
      <ECGMonitor bpm={bpm} irregular={irregular} />

      {/* Leyenda */}
      <div className="heart-legend">
        <span><span className="legend-dot legend-red" /> Sangre oxigenada</span>
        <span><span className="legend-dot legend-blue" /> Sangre desoxigenada</span>
        <span><span className="legend-dot legend-ecg" /> Electrocardiograma (ECG)</span>
      </div>

      {/* Métricas */}
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

      {/* Exploración libre */}
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

      {/* Enfoque sistémico */}
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

      <div className="placeholder" style={{ marginTop: '1.5rem' }}>
        <Link to="/laboratorio/corazon/evaluacion" className="btn btn-outline">
          Ir a la evaluación
        </Link>
      </div>
    </SimulationWrapper>
  );
}
