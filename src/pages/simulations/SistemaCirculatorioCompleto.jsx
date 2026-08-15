import { Link } from 'react-router-dom';
import SimulationWrapper from '../../components/shared/SimulationWrapper';
import '../pages.css';

export default function SistemaCirculatorioCompleto() {
  return (
    <SimulationWrapper
      simNumber={5}
      title="Sistema Circulatorio Completo"
      description="Integra corazón, sangre, pulmones y cerebro en una visión de sistema completo."
      icon="🔄"
      info="La simulación general integra todos los componentes: la sangre recorre el circuito completo coordinada por el corazón, oxigenada por los pulmones y regulada por el cerebro."
    >
      <div className="placeholder">
        <div className="placeholder-icon">🔄</div>
        <div className="placeholder-title">Simulación en construcción</div>
        <p>El contenido interactivo de esta simulación se construirá próximamente.</p>
        <Link to="/laboratorio/sistema-circulatorio/evaluacion" className="btn btn-outline" style={{ marginTop: '1.25rem' }}>
          Ir a la evaluación
        </Link>
      </div>
    </SimulationWrapper>
  );
}
