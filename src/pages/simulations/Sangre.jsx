import { Link } from 'react-router-dom';
import SimulationWrapper from '../../components/shared/SimulationWrapper';
import '../pages.css';

export default function Sangre() {
  return (
    <SimulationWrapper
      simNumber={2}
      title="La Sangre"
      description="Explora los componentes de la sangre y su rol de transporte por el organismo."
      icon="🩸"
      info="La sangre es el medio de transporte del sistema: lleva oxígeno, nutrientes y células de defensa a todo el cuerpo."
    >
      <div className="placeholder">
        <div className="placeholder-icon">🩸</div>
        <div className="placeholder-title">Simulación en construcción</div>
        <p>El contenido interactivo de esta simulación se construirá próximamente.</p>
        <Link to="/laboratorio/sangre/evaluacion" className="btn btn-outline" style={{ marginTop: '1.25rem' }}>
          Ir a la evaluación
        </Link>
      </div>
    </SimulationWrapper>
  );
}
