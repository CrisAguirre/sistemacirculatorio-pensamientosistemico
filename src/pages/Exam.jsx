import { useParams, Link } from 'react-router-dom';
import './pages.css';

export default function Exam() {
  const { id } = useParams();

  return (
    <div className="page">
      <div className="page-header">
        <Link to="/laboratorio" className="back-link">← Volver al Laboratorio</Link>
        <h1 className="page-title">Evaluación</h1>
        <p className="page-subtitle">
          Evaluación de la simulación <strong>{id}</strong> (en construcción).
        </p>
      </div>

      <div className="placeholder">
        <div>
          <div className="placeholder-icon">📝</div>
          <div className="placeholder-title">Evaluación en construcción</div>
          <p>Aquí se presentará la evaluación de la simulación {id}.</p>
        </div>
      </div>
    </div>
  );
}
