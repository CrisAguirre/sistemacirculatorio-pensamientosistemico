import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const btnBase = {
  fontSize: '1.2rem',
  padding: '1rem 2.5rem',
  borderRadius: '50px',
  border: 'none',
  color: 'white',
  cursor: 'pointer',
  transition: 'transform 0.2s, box-shadow 0.2s',
};

function NavButton({ label, gradient, shadowColor, onClick }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '4rem', paddingBottom: '2rem' }}>
      <button
        style={{ ...btnBase, background: gradient, boxShadow: `0 4px 15px ${shadowColor}` }}
        onClick={onClick}
        onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 6px 20px ${shadowColor}`; }}
        onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 4px 15px ${shadowColor}`; }}
      >
        {label} <span style={{ marginLeft: '10px', fontSize: '1.4rem' }}>&rarr;</span>
      </button>
    </div>
  );
}

export default function SimulationWrapper({ simNumber, title, description, icon, info, children, apropiacion, actividad, evaluacionPath }) {
  const [activeTab, setActiveTab] = useState('inicio');
  const navigate = useNavigate();

  const goTo = (tab) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setActiveTab(tab);
  };

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
        <button
          className={`sim-tab ${activeTab === 'inicio' ? 'active' : ''}`}
          onClick={() => setActiveTab('inicio')}
        >
          🏠 Inicio
        </button>
        <button
          className={`sim-tab ${activeTab === 'desarrollo' ? 'active' : ''}`}
          onClick={() => setActiveTab('desarrollo')}
        >
          📚 Desarrollo
        </button>
        {evaluacionPath && (
          <button
            className="sim-tab sim-tab-eval"
            onClick={() => navigate(evaluacionPath)}
          >
            📝 Cierre
          </button>
        )}
      </div>

      <div className="sim-content">
        {activeTab === 'apropiacion' && apropiacion && (
          <div className="apropiacion-content">
            {apropiacion}
            <NavButton
              label="Continuar con el Inicio 🏠"
              gradient="linear-gradient(135deg, #3b82f6, #8b5cf6)"
              shadowColor="rgba(59,130,246,0.6)"
              onClick={() => goTo('inicio')}
            />
          </div>
        )}
        {activeTab === 'inicio' && (
          <div className="inicio-content">
            {children}
            <NavButton
              label="Continuar con el Desarrollo 📚"
              gradient="linear-gradient(135deg, #3b82f6, #8b5cf6)"
              shadowColor="rgba(59,130,246,0.6)"
              onClick={() => goTo('desarrollo')}
            />
          </div>
        )}
        {activeTab === 'desarrollo' && (
          <div className="desarrollo-content">
            {actividad}
            {evaluacionPath && (
              <NavButton
                label="Realizar Evaluación 📝"
                gradient="linear-gradient(135deg, #f59e0b, #ea580c)"
                shadowColor="rgba(245,158,11,0.6)"
                onClick={() => navigate(evaluacionPath)}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}