import { lazy, Suspense, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import EvidenciaTextarea from '../../components/shared/EvidenciaTextarea';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ReferenceArea, ResponsiveContainer, Legend } from 'recharts';
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

  // --- Historial para gráfica de enfermedades pulmonares ---
  const [chartData, setChartData] = useState([]);
  const sampleRef = useRef(0);

  function getLungDiagnosis(satO2, satCo2) {
    if (satO2 < 85 && satCo2 >= 7) return 'EPOC / Insuf. respiratoria';
    if (satO2 < 90) return 'Hipoxemia';
    if (satCo2 >= 8) return 'Hipercapnia';
    if (satO2 < 95) return 'Oxigenación baja';
    return 'Normal';
  }

  function addSample() {
    sampleRef.current += 1;
    setChartData((prev) => {
      const next = [...prev, { t: sampleRef.current, O2: o2, CO2: co2, FR: respRate }];
      return next.length > 15 ? next.slice(-15) : next;
    });
  }

  const currentDiag = getLungDiagnosis(o2, co2);
  const diagColor = currentDiag === 'Normal' ? '#22c55e' : currentDiag.includes('EPOC') ? '#ef4444' : '#f59e0b';

  const Actividad = (
    <div>
      <h2>Actividad: Representación Gráfica de Enfermedades Pulmonares</h2>
      <div className="activity-steps">
        <div className="activity-step">
          <div className="step-number">1</div>
          <div className="step-content">
            <h4>Representación basal (L3)</h4>
            <p>Ve a la pestaña <strong>Desarrollo</strong>. Observa el ritmo respiratorio del modelo 3D. Con O₂ = 98%, CO₂ = 5% y FR = 14, presiona "Registrar punto" en la gráfica. Este punto estará en la zona de salud normal.</p>
          </div>
        </div>
        <div className="activity-step">
          <div className="step-number">2</div>
          <div className="step-content">
            <h4>Escala de enfermedad: Hipoxemia (L4)</h4>
            <p>Baja la saturación de O₂ a 80% y sube el CO₂ a 8% (esto simula un paciente con EPOC). Registra el punto en la gráfica y observa cómo las cantidades entran en la zona de peligro. ¿Qué proporción de oxígeno se perdió respecto al estado basal?</p>
          </div>
        </div>
        <div className="activity-step">
          <div className="step-number">3</div>
          <div className="step-content">
            <h4>Compensación respiratoria (L4)</h4>
            <p>Ahora sube la FR a 30 resp/min (el cuerpo intenta compensar). Registra el punto. ¿Logra el sistema recuperar la escala normal? Analiza en tu gráfica los 3 estados y elabora una tabla con las cantidades, enfermedades detectadas y las proporciones de cambio.</p>
          </div>
        </div>
      </div>
      <EvidenciaTextarea titulo="Evidencia: Laboratorio de Pulmones" />
    </div>
  );

  return (
    <SimulationWrapper
      simNumber={5}
      title="Los Pulmones"
      description="Descubre el intercambio gaseoso y la oxigenación de la sangre."
      icon="🫁"
      info="Los pulmones realizan el intercambio gaseoso en los alvéolos: incorporan oxígeno (O₂) a la sangre y eliminan dióxido de carbono (CO₂) con cada respiración. Gira el modelo y ajusta la frecuencia respiratoria para ver el ritmo de la respiración."
      actividad={Actividad}
      evaluacionPath="/laboratorio/pulmones/evaluacion"
    >
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ color: '#60a5fa', fontSize: '1.8rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '2rem', filter: 'drop-shadow(0 0 8px rgba(96,165,250,0.6))' }}>🔬</span>
          Simulador de los Pulmones
        </h2>
      </div>

      <div className="sim-canvas">
        <div className="sim-canvas-bg">
          <Aurora colorStops={['#be185d', '#1d4ed8', '#0e7490']} blend={0.35} amplitude={0.6} speed={0.25} />
        </div>
        <Suspense fallback={<div className="model3d-loading">Cargando modelo 3D...</div>}>
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

      {/* Diagnóstico actual */}
      <div className="system-panel" style={{ marginBottom: '1rem', textAlign: 'center' }}>
        <div className="system-panel-title">🩺 Diagnóstico pulmonar actual</div>
        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: diagColor, margin: '0.5rem 0' }}>{currentDiag}</div>
        <p className="info-panel-body" style={{ margin: 0, fontSize: '0.85rem' }}>
          O₂ = {o2}% · CO₂ = {co2}% · FR = {respRate} resp/min
        </p>
      </div>

      {/* Gráfica de enfermedades pulmonares (Representación L3 + Escalas L4) */}
      <div className="system-panel">
        <div className="system-panel-title">📊 Representación: O₂ y CO₂ vs Medición (Lineamientos 3 y 4)</div>
        <p className="info-panel-body" style={{ margin: '0.5rem 0', fontSize: '0.85rem' }}>
          Modifica los sliders y presiona "Registrar punto" para construir tu gráfica. Las zonas de color representan las escalas de enfermedad pulmonar.
        </p>
        <div style={{ width: '100%', height: 280 }}>
          <ResponsiveContainer>
            <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="t" label={{ value: 'Medición', position: 'insideBottom', offset: -2, style: { fill: '#94a3b8', fontSize: 12 } }} tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis domain={[0, 100]} label={{ value: '% / resp', angle: -90, position: 'insideLeft', style: { fill: '#94a3b8', fontSize: 12 } }} tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#f1f5f9' }} />
              <Legend wrapperStyle={{ color: '#94a3b8', fontSize: 12 }} />
              <ReferenceArea y1={0} y2={85} fill="#ef4444" fillOpacity={0.12} label={{ value: 'Hipoxemia severa', position: 'insideTopLeft', style: { fill: '#ef4444', fontSize: 11, fontWeight: 600 } }} />
              <ReferenceArea y1={85} y2={95} fill="#f59e0b" fillOpacity={0.10} label={{ value: 'O₂ bajo', position: 'insideTopLeft', style: { fill: '#f59e0b', fontSize: 11, fontWeight: 600 } }} />
              <ReferenceArea y1={95} y2={100} fill="#22c55e" fillOpacity={0.10} label={{ value: 'O₂ Normal', position: 'insideTopLeft', style: { fill: '#22c55e', fontSize: 11, fontWeight: 600 } }} />
              <ReferenceLine y={95} stroke="#22c55e" strokeDasharray="4 4" />
              <ReferenceLine y={85} stroke="#ef4444" strokeDasharray="4 4" />
              <Line type="monotone" dataKey="O2" name="Saturación O₂ (%)" stroke="#22c55e" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="CO2" name="CO₂ en sangre (%)" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="FR" name="Frec. Respiratoria" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
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