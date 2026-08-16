import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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

const ACTIVITIES = {
  foro: { label: 'Foro', to: (s) => `/foro/${s.number}` },
  video: { label: 'Video', to: () => '/recursos' },
  cuestionario: { label: 'Cuestionario', to: (s) => (s.sims[0] ? `/laboratorio/${s.sims[0]}/evaluacion` : null) },
  simulacion: { label: 'Simulación', to: () => '/laboratorio' },
  diagrama: { label: 'Diagrama', to: () => '/evidencias' },
  informe: { label: 'Informe', to: () => '/evidencias' },
  analisis: { label: 'Análisis', to: () => '/evidencias' },
  sintesis: { label: 'Síntesis', to: () => '/evidencias' },
  postest: { label: 'Postest', to: () => '/postest' },
  calculo: { label: 'Cálculo', to: () => '/laboratorio' },
};

export default function Sesiones() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    sessionApi
      .list()
      .then(setSessions)
      .catch((e) => setError(e.message || 'Error al cargar sesiones'))
      .finally(() => setLoading(false));
  }, []);

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
          <div className="glass-card" key={s.number} style={{ position: 'relative' }}>
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
            {s.sims.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.75rem' }}>
                {s.sims.map((slug) => (
                  <Link key={slug} to={`/laboratorio/${slug}`} className="btn btn-outline" style={{ padding: '0.3rem 0.7rem', fontSize: '0.75rem' }}>
                    {slug.replace('-', ' ')}
                  </Link>
                ))}
              </div>
            )}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {s.activities.map((a) => {
                const act = ACTIVITIES[a];
                const to = act?.to(s);
                if (!act) return null;
                return to ? (
                  <Link key={a} to={to} className="btn btn-primary" style={{ padding: '0.3rem 0.7rem', fontSize: '0.75rem' }}>
                    {act.label}
                  </Link>
                ) : null;
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
