import SimCard from '../components/shared/SimCard';
import './pages.css';

export default function LaboratorioHub() {
  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Laboratorio de Simulaciones</h1>
        <p className="page-subtitle">
          Explora las 6 fases interactivas del sistema circulatorio desde el pensamiento sistémico.
        </p>
      </div>

      <section className="sim-block">
        <div className="block-header">
          <span className="block-icon">📚</span>
          <div>
            <h2 className="block-title">Módulo Introductorio</h2>
            <p className="block-desc">Fase 1</p>
          </div>
        </div>

        <div className="sim-grid">
          <SimCard
            simNumber={1}
            title="Laboratorio de Introducción"
            description="Presentación de la secuencia didáctica y concepto de sistema."
            icon="🎬"
            routePath="/laboratorio/introduccion"
          />
        </div>
      </section>

      <section className="sim-block">
        <div className="block-header">
          <span className="block-icon">🧩</span>
          <div>
            <h2 className="block-title">Componentes y Causalidad</h2>
            <p className="block-desc">Fases 2 y 3</p>
          </div>
        </div>

        <div className="sim-grid">
          <SimCard
            simNumber={2}
            title="La Sangre"
            description="Componentes celulares y su relación causa-efecto."
            icon="🩸"
            routePath="/laboratorio/sangre"
          />
          <SimCard
            simNumber={3}
            title="El Cerebro"
            description="Centro de control y la causalidad autonómica."
            icon="🧠"
            routePath="/laboratorio/cerebro"
          />
        </div>
      </section>

      <section className="sim-block">
        <div className="block-header">
          <span className="block-icon">🔍</span>
          <div>
            <h2 className="block-title">Representación y Escalas</h2>
            <p className="block-desc">Fases 4 y 5</p>
          </div>
        </div>

        <div className="sim-grid">
          <SimCard
            simNumber={4}
            title="El Corazón"
            description="Representación de la bomba central y sus volúmenes."
            icon="🫀"
            routePath="/laboratorio/corazon"
          />
          <SimCard
            simNumber={5}
            title="Los Pulmones"
            description="Escalas e intercambio gaseoso (O2/CO2)."
            icon="🫁"
            routePath="/laboratorio/pulmones"
          />
        </div>
      </section>

      <section className="sim-block">
        <div className="block-header">
          <span className="block-icon">🌐</span>
          <div>
            <h2 className="block-title">Visión de Totalidad</h2>
            <p className="block-desc">Fase 6</p>
          </div>
        </div>

        <div className="sim-grid">
          <SimCard
            simNumber={6}
            title="Sistema Circulatorio Completo"
            description="Visión general: Conservación, propósito y estabilidad."
            icon="🔄"
            routePath="/laboratorio/sistema-circulatorio"
          />
        </div>
      </section>
    </div>
  );
}
