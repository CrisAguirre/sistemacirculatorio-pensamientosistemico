import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function SimulationWrapper({ simNumber, title, description, icon, info, children, apropiacion, actividad, evaluacionPath }) {
  const [activeTab, setActiveTab] = useState(apropiacion ? 'apropiacion' : 'simulador');
  const navigate = useNavigate();

  return (
    <div className="page sim-page">
      <div className="page-header">
        <Link to="/laboratorio" className="back-link">← Volver al Laboratorio</Link>
        <h1 className="page-title">
          {icon && <span className="page-title-icon">{icon}</span>}
          Simulación {simNumber}: {title}
        </h1>
        <p className="page-subtitle">{description}</p>
      </div>

      {info && (
        <div className="info-panel">
          <div className="info-panel-title">ℹ️ Información</div>
          <div className="info-panel-body">{info}</div>
        </div>
      )}

      <div className="sim-tabs">
        {apropiacion && (
          <button 
            className={`sim-tab ${activeTab === 'apropiacion' ? 'active' : ''}`}
            onClick={() => setActiveTab('apropiacion')}
          >
            🛠️ Apropiación
          </button>
        )}
        {actividad && (
          <button 
            className={`sim-tab ${activeTab === 'actividad' ? 'active' : ''}`}
            onClick={() => setActiveTab('actividad')}
          >
            📋 Actividad
          </button>
        )}
        <button 
          className={`sim-tab ${activeTab === 'simulador' ? 'active' : ''}`}
          onClick={() => setActiveTab('simulador')}
        >
          🔬 Simulador
        </button>
        {evaluacionPath && (
          <button 
            className="sim-tab sim-tab-eval"
            onClick={() => navigate(evaluacionPath)}
          >
            📝 Evaluación
          </button>
        )}
      </div>

      <div className="sim-content">
        {activeTab === 'apropiacion' && apropiacion && (
          <div className="apropiacion-content">
            {apropiacion}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '4rem', paddingBottom: '2rem' }}>
              <button 
                style={{ fontSize: '1.2rem', padding: '1rem 2.5rem', borderRadius: '50px', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', border: 'none', color: 'white', cursor: 'pointer', boxShadow: '0 4px 15px rgba(59,130,246,0.4)', transition: 'transform 0.2s, box-shadow 0.2s' }}
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  setActiveTab('actividad');
                }}
                onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(59,130,246,0.6)'; }}
                onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(59,130,246,0.4)'; }}
              >
                Continuar con la Actividad 📋 <span style={{ marginLeft: '10px', fontSize: '1.4rem' }}>&rarr;</span>
              </button>
            </div>
          </div>
        )}
        {activeTab === 'actividad' && actividad && (
          <div className="actividad-content">
            {actividad}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '4rem', paddingBottom: '2rem' }}>
              <button 
                style={{ fontSize: '1.2rem', padding: '1rem 2.5rem', borderRadius: '50px', background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', color: 'white', cursor: 'pointer', boxShadow: '0 4px 15px rgba(16,185,129,0.4)', transition: 'transform 0.2s, box-shadow 0.2s' }}
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  setActiveTab('simulador');
                }}
                onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(16,185,129,0.6)'; }}
                onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(16,185,129,0.4)'; }}
              >
                Ir al Simulador Interactivo 🔬 <span style={{ marginLeft: '10px', fontSize: '1.4rem' }}>&rarr;</span>
              </button>
            </div>
          </div>
        )}
        <div style={{ display: activeTab === 'simulador' ? 'block' : 'none' }}>
          {children}
          {evaluacionPath && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '4rem', paddingBottom: '2rem' }}>
              <button 
                style={{ fontSize: '1.2rem', padding: '1rem 2.5rem', borderRadius: '50px', background: 'linear-gradient(135deg, #f59e0b, #ea580c)', border: 'none', color: 'white', cursor: 'pointer', boxShadow: '0 4px 15px rgba(245,158,11,0.4)', transition: 'transform 0.2s, box-shadow 0.2s' }}
                onClick={() => navigate(evaluacionPath)}
                onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(245,158,11,0.6)'; }}
                onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(245,158,11,0.4)'; }}
              >
                Realizar Evaluación 📝 <span style={{ marginLeft: '10px', fontSize: '1.4rem' }}>&rarr;</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
