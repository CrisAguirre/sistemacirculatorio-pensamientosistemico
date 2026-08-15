import { Link } from 'react-router-dom';
import SimulationWrapper from '../../components/shared/SimulationWrapper';
import '../pages.css';

export default function Pulmones() {
  return (
    <SimulationWrapper
      simNumber={3}
      title="Los Pulmones"
      description="Descubre el intercambio gaseoso y la oxigenación de la sangre."
      icon="🫁"
      info="Los pulmones realizan el intercambio gaseoso: incorporan oxígeno a la sangre y eliminan dióxido de carbono."
    >
      <div className="placeholder">
        <div className="placeholder-icon">🫁</div>
        <div className="placeholder-title">Simulación en construcción</div>
        <p>El contenido interactivo de esta simulación se construirá próximamente.</p>
        <Link to="/laboratorio/pulmones/evaluacion" className="btn btn-outline" style={{ marginTop: '1.25rem' }}>
          Ir a la evaluación
        </Link>
      </div>
    </SimulationWrapper>
  );
}
