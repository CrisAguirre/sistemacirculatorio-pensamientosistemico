import './pages.css';

const recursos = [
  { icon: '📘', title: 'Material de estudio', desc: 'Guías y lecturas del sistema circulatorio.' },
  { icon: '🎬', title: 'Videos', desc: 'Recursos audiovisuales de apoyo.' },
  { icon: '🔗', title: 'Enlaces de consulta', desc: 'Sitios recomendados para profundizar.' },
  { icon: '📝', title: 'Banco de preguntas', desc: 'Ejercicios y evaluaciones de práctica.' },
];

export default function Recursos() {
  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Recursos</h1>
        <p className="page-subtitle">Materiales de apoyo para tu aprendizaje (en construcción).</p>
      </div>

      <div className="resources-grid">
        {recursos.map((r) => (
          <div key={r.title} className="glass-card">
            <div className="feature-icon">{r.icon}</div>
            <h3>{r.title}</h3>
            <p>{r.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
