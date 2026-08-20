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
          <div className="apropiacion-content">{apropiacion}</div>
        )}
        {activeTab === 'actividad' && actividad && (
          <div className="actividad-content">{actividad}</div>
        )}
        <div style={{ display: activeTab === 'simulador' ? 'block' : 'none' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
