import { Link } from 'react-router-dom';
import SimulationWrapper from '../../components/shared/SimulationWrapper';
import '../pages.css';

export default function Cerebro() {
  return (
    <SimulationWrapper
      simNumber={4}
      title="El Cerebro"
      description="Conoce la regulación de la circulación y la alta demanda de flujo sanguíneo del cerebro."
      icon="🧠"
      info="El cerebro regula la frecuencia cardíaca y la presión, y demanda un alto porcentaje del flujo sanguíneo."
    >
      <div className="placeholder">
        <div className="placeholder-icon">🧠</div>
        <div className="placeholder-title">Simulación en construcción</div>
        <p>El contenido interactivo de esta simulación se construirá próximamente.</p>
        <Link to="/laboratorio/cerebro/evaluacion" className="btn btn-outline" style={{ marginTop: '1.25rem' }}>
          Ir a la evaluación
        </Link>
      </div>
    </SimulationWrapper>
  );
}
