import { Link } from 'react-router-dom';
import '../App.css';
import {
  SplitText,
  BlurText,
  GradientText,
  Aurora,
  Particles,
  FadeContent,
} from '../reactbits';

export default function Landing() {
  return (
    <div className="app">
      {/* ===== HERO ===== */}
      <section id="inicio" className="hero">
        <div className="hero-background">
          <Aurora
            colorStops={['#1e3a8a', '#1d4ed8', '#0e7490']}
            blend={0.35}
            amplitude={0.8}
            speed={0.3}
          />
          <Particles
            quantity={60}
            color="#60a5fa"
            size={0.6}
            staticity={40}
            ease={60}
          />
        </div>

        <div className="hero-content">
          <FadeContent delay={0.2} direction="up" distance={30}>
            <span className="hero-badge">
              <span className="pulse"></span>
              Pensamiento Sistémico · Grado 8°
            </span>
          </FadeContent>

          <FadeContent delay={0.35} direction="up" distance={24}>
            <div className="hero-banner">
              Estrategia de Aprendizaje Fundamentada en el Pensamiento Sistémico y Mediada por Recursos Digitales para Desarrollar Habilidades de Pensamiento Sistémico Sobre el Sistema Circulatorio en Estudiantes de Grado Octavo de la Institución Educativa Rancho Grande
            </div>
          </FadeContent>

          <div className="hero-title">
            <SplitText
              text="Explora el Sistema"
              delay={40}
              className="hero-title"
              animationFrom={{ opacity: 0, transform: 'translate3d(0,50px,0)' }}
              animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
            />
            <GradientText
              colors={['#60a5fa', '#06b6d4', '#93c5fd', '#60a5fa']}
              animationSpeed={3}
              className="hero-title"
            >
              Circulatorio
            </GradientText>
          </div>

          <div className="hero-subtitle">
            <BlurText
              text="Una experiencia de aprendizaje interactiva que te permitirá comprender cómo funciona tu corazón y el sistema circulatorio desde un enfoque sistémico."
              delay={20}
              animateBy="words"
              direction="bottom"
            />
          </div>

          <FadeContent delay={0.8} direction="up" distance={20}>
            <div className="hero-actions">
              <Link to="/laboratorio" className="btn btn-primary">
                🚀 Comenzar Aprendizaje
              </Link>
              <Link to="/recursos" className="btn btn-outline">
                📖 Ver Contenidos
              </Link>
            </div>
          </FadeContent>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section id="temas" className="features">
        <div className="container">
          <div className="features-header">
            <FadeContent direction="up">
              <h2>
                Aprende con{' '}
                <GradientText colors={['#60a5fa', '#06b6d4', '#60a5fa']} animationSpeed={4}>
                  Pensamiento Sistémico
                </GradientText>
              </h2>
              <p>
                Descubre cómo cada componente del sistema circulatorio interactúa
                formando un sistema complejo y fascinante.
              </p>
            </FadeContent>
          </div>

          <div className="features-grid">
            <FadeContent delay={0.1} direction="up">
              <div className="glass-card feature-card">
                <div className="feature-icon">❤️</div>
                <h3>El Corazón</h3>
                <p>
                  Comprende la estructura y función del corazón como bomba central
                  del sistema, sus cámaras, válvulas y el ciclo cardíaco.
                </p>
              </div>
            </FadeContent>

            <FadeContent delay={0.2} direction="up">
              <div className="glass-card feature-card">
                <div className="feature-icon">🩸</div>
                <h3>La Sangre</h3>
                <p>
                  Explora los componentes de la sangre: glóbulos rojos, blancos,
                  plaquetas y plasma. Entiende su rol en el transporte de nutrientes.
                </p>
              </div>
            </FadeContent>

            <FadeContent delay={0.3} direction="up">
              <div className="glass-card feature-card">
                <div className="feature-icon">🫁</div>
                <h3>Los Pulmones</h3>
                <p>
                  Descubre el intercambio gaseoso en los pulmones y su papel en la
                  oxigenación de la sangre.
                </p>
              </div>
            </FadeContent>

            <FadeContent delay={0.4} direction="up">
              <div className="glass-card feature-card">
                <div className="feature-icon">🧠</div>
                <h3>El Cerebro</h3>
                <p>
                  Conoce cómo el cerebro regula la circulación y su alta demanda
                  de flujo sanguíneo dentro del sistema.
                </p>
              </div>
            </FadeContent>

            <FadeContent delay={0.5} direction="up">
              <div className="glass-card feature-card">
                <div className="feature-icon">🔄</div>
                <h3>Circulación Mayor y Menor</h3>
                <p>
                  Descubre los dos circuitos de circulación: pulmonar y sistémica,
                  y cómo trabajan juntos para oxigenar todo el cuerpo.
                </p>
              </div>
            </FadeContent>

            <FadeContent delay={0.6} direction="up">
              <div className="glass-card feature-card">
                <div className="feature-icon">🔗</div>
                <h3>Interconexiones Sistémicas</h3>
                <p>
                  Analiza cómo el sistema circulatorio se relaciona con otros
                  sistemas del cuerpo humano desde el pensamiento sistémico.
                </p>
              </div>
            </FadeContent>
          </div>
        </div>
      </section>
    </div>
  );
}
