import { useState } from 'react';
import { FadeContent } from '../reactbits';
import './pages.css';

const VIDEOS_SIMULACIONES = [
  {
    id: 'intro',
    title: 'Pensamiento Sistémico',
    desc: 'Video introductorio sobre el sistema circulatorio desde el pensamiento sistémico.',
    url: 'https://www.youtube.com/embed/JmC9nEvw4T8'
  },
  {
    id: 'sangre',
    title: 'La Sangre',
    desc: 'Exploración de los componentes de la sangre y sus funciones.',
    url: 'https://www.youtube.com/embed/TmOHclF31ww'
  },
  {
    id: 'cerebro',
    title: 'El Cerebro',
    desc: 'Cómo el cerebro controla y demanda flujo sanguíneo.',
    url: 'https://www.youtube.com/embed/AjkzLXGZqbg'
  },
  {
    id: 'corazon',
    title: 'El Corazón',
    desc: 'Estructura y funcionamiento de la bomba central del sistema.',
    url: '/assets/videos/corazon-anatomia.mp4',
    local: true
  },
  {
    id: 'pulmones',
    title: 'Los Pulmones',
    desc: 'Intercambio gaseoso y oxigenación en los alvéolos.',
    url: 'https://www.youtube.com/embed/uUpdItCbr24'
  }
];

const RECURSOS_CATS = [
  { id: 'videos', icon: '🎬', title: 'Videos de Simulaciones', desc: 'Recopilación de todos los videos descriptivos.' },
  { id: 'docs', icon: '📘', title: 'Material de estudio', desc: 'Guías y lecturas (Próximamente).' },
  { id: 'links', icon: '🔗', title: 'Enlaces de consulta', desc: 'Sitios recomendados (Próximamente).' },
];

export default function Recursos() {
  const [activeCategory, setActiveCategory] = useState(null);

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Recursos</h1>
        <p className="page-subtitle">Materiales de apoyo y contenido audiovisual para tu aprendizaje.</p>
      </div>

      {!activeCategory ? (
        <div className="resources-grid">
          {RECURSOS_CATS.map((r, i) => (
            <FadeContent key={r.id} delay={i * 0.15} duration={0.6} direction="up">
              <div 
                className="glass-card" 
                style={{ cursor: r.id === 'videos' ? 'pointer' : 'default', transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.02)' } }}
                onClick={() => r.id === 'videos' && setActiveCategory(r.id)}
              >
                <div className="feature-icon">{r.icon}</div>
                <h3>{r.title}</h3>
                <p>{r.desc}</p>
                {r.id === 'videos' && <span className="sim-card-arrow" style={{ float: 'right', marginTop: '10px' }}>→</span>}
              </div>
            </FadeContent>
          ))}
        </div>
      ) : (
        <div className="subpage-view animate-fade">
          <button className="btn btn-outline mb-4" onClick={() => setActiveCategory(null)}>
            ← Volver a Categorías
          </button>
          
          <div className="block-header" style={{ marginBottom: '2rem' }}>
            <span className="block-icon">🎬</span>
            <div>
              <h2 className="block-title">Videos Descriptivos</h2>
              <p className="block-desc">Recopilación de las cápsulas audiovisuales de cada laboratorio.</p>
            </div>
          </div>

          <div className="video-cards-grid">
            {VIDEOS_SIMULACIONES.map((v, i) => (
              <FadeContent key={v.id} delay={i * 0.15} duration={0.6} direction="up">
                <div className="glass-card video-card" style={{ padding: '0', overflow: 'hidden' }}>
                  <div className="video-wrapper" style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
                    {v.local ? (
                      <video
                        src={v.url}
                        title={v.title}
                        controls
                        preload="metadata"
                        playsInline
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0, background: '#000' }}
                      />
                    ) : (
                      <iframe
                        src={v.url}
                        title={v.title}
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    )}
                  </div>
                  <div style={{ padding: '1.5rem' }}>
                    <h3 style={{ margin: '0 0 0.5rem 0', fontFamily: 'var(--font-primary)' }}>{v.title}</h3>
                    <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{v.desc}</p>
                  </div>
                </div>
              </FadeContent>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
