import './pages.css';

export default function Results() {
  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Resultados</h1>
        <p className="page-subtitle">Tu progreso y resultados en las simulaciones (en construcción).</p>
      </div>

      <div className="placeholder">
        <div>
          <div className="placeholder-icon">🏆</div>
          <div className="placeholder-title">Resultados en construcción</div>
          <p>Aquí verás tu puntaje y progreso en cada simulación.</p>
        </div>
      </div>
    </div>
  );
}
