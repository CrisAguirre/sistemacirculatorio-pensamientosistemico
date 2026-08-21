import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sessionApi } from '../api/session';
import './pages.css';

const LINEAMIENTOS = {
  1: 'Componentes',
  2: 'Causalidad',
  3: 'Escalas',
  4: 'Representación',
  5: 'Conservación',
  6: 'Propósito',
  7: 'Estabilidad',
};

export default function Sesiones() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    sessionApi
      .list()
      .then(setSessions)
      .catch((e) => setError(e.message || 'Error al cargar sesiones'))
      .finally(() => setLoading(false));
  }, []);

  const handleCardClick = (sessionNumber) => {
    if (sessionNumber === 1) {
      navigate('/laboratorio/introduccion');
    } else if (sessionNumber === 2) {
      navigate('/laboratorio/apropiacion');
    } else {
      // For session 3 onwards, fallback or do nothing for now as per user instruction
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Mis Sesiones</h1>
        <p className="page-subtitle">
          Recorrido de 7 sesiones para fortalecer tu pensamiento sistémico sobre el sistema circulatorio.
        </p>
      </div>

      {loading && <div className="placeholder"><p>Cargando sesiones…</p></div>}
      {error && <div className="auth-error">{error}</div>}

      <div className="resources-grid">
        {sessions.map((s) => (
          <div 
            className="glass-card" 
            key={s.number} 
            style={{ position: 'relative', cursor: 'pointer', transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.02)' } }}
            onClick={() => handleCardClick(s.number)}
          >
            {s.completed && (
              <span style={{ position: 'absolute', top: '1rem', right: '1rem', fontSize: '1.4rem' }}>✅</span>
            )}
            <div className="sim-card-number">Sesión {s.number}</div>
            <h3 style={{ fontFamily: 'var(--font-primary)', margin: '0.5rem 0' }}>{s.title}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.5, marginBottom: '0.75rem' }}>
              {s.objective}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '0.75rem' }}>
              {s.lineamientos.map((l) => (
                <span key={l} className="state-btn-label" style={{ fontSize: '0.68rem', padding: '0.2rem 0.5rem', background: 'rgba(59,130,246,0.12)', borderRadius: 'var(--radius-full)' }}>
                  {LINEAMIENTOS[l]}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

