import SimCard from '../components/shared/SimCard';
import './pages.css';

export default function LaboratorioHub() {
  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Laboratorio de Simulaciones</h1>
        <p className="page-subtitle">
          Explora las 5 simulaciones interactivas del sistema circulatorio desde el pensamiento sistémico.
        </p>
      </div>

      <section className="sim-block">
        <div className="block-header">
          <span className="block-icon">📚</span>
          <div>
            <h2 className="block-title">Módulo Introductorio</h2>
            <p className="block-desc">Simulaciones introductorias — 0</p>
          </div>
        </div>

        <div className="sim-grid">
          <SimCard
            simNumber={0}
            title="Laboratorio de Introducción"
            description="Presentación de la secuencia didáctica y pensamiento sistémico."
            icon="🎬"
            routePath="/laboratorio/introduccion"
          />
          <SimCard
            simNumber={0.5}
            title="Apropiación"
            description="Espacio de construcción y reflexión grupal."
            icon="🛠️"
            routePath="/laboratorio/apropiacion"
          />
        </div>
      </section>

      <section className="sim-block">
        <div className="block-header">
          <span className="block-icon">🧩</span>
          <div>
            <h2 className="block-title">Componentes del Sistema</h2>
            <p className="block-desc">Simulaciones segmentadas — 1 a 4</p>
          </div>
        </div>

        <div className="sim-grid">
          <SimCard
            simNumber={1}
            title="El Corazón"
            description="Bomba central: cámaras, válvulas y ciclo cardíaco."
            icon="🫀"
            routePath="/laboratorio/corazon"
          />
          <SimCard
            simNumber={2}
            title="La Sangre"
            description="Componentes y función de transporte de la sangre."
            icon="🩸"
            routePath="/laboratorio/sangre"
          />
          <SimCard
            simNumber={3}
            title="Los Pulmones"
            description="Intercambio gaseoso y oxigenación de la sangre."
            icon="🫁"
            routePath="/laboratorio/pulmones"
          />
          <SimCard
            simNumber={4}
            title="El Cerebro"
            description="Regulación de la circulación y demanda de flujo."
            icon="🧠"
            routePath="/laboratorio/cerebro"
          />
        </div>
      </section>

      <section className="sim-block">
        <div className="block-header">
          <span className="block-icon">🌐</span>
          <div>
            <h2 className="block-title">Integración Sistémica</h2>
            <p className="block-desc">Simulación general — 5</p>
          </div>
        </div>

        <div className="sim-grid">
          <SimCard
            simNumber={5}
            title="Sistema Circulatorio Completo"
            description="Integra corazón, sangre, pulmones y cerebro en una visión de sistema completo."
            icon="🔄"
            routePath="/laboratorio/sistema-circulatorio"
          />
        </div>
      </section>
    </div>
  );
}
