import React, { useState, useEffect } from 'react';
import { evidenciaApi } from '../../api/evidencia';
import DrawingCanvas from '../../components/shared/DrawingCanvas';
import { Aurora, BlurText, FadeContent } from '../../reactbits';
import './introduccion.css';
import './introduccion_animations.css';

export default function Introduccion() {
  const [activeTab, setActiveTab] = useState('ejemplos');
  const [lluviaIdeas, setLluviaIdeas] = useState('');
  const [conclusion, setConclusion] = useState('');
  
  const [isLluviaIdeasSaved, setIsLluviaIdeasSaved] = useState(false);
  const [isConclusionSaved, setIsConclusionSaved] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    checkPreviousSubmissions();
  }, []);

  const checkPreviousSubmissions = async () => {
    try {
      const response = await evidenciaApi.listMine();
      const evidencias = response.data || [];
      
      const prevLluvia = evidencias.find(e => 
        e.titulo === 'Lluvia de Ideas: Laboratorio de Introducción' || 
        e.titulo === 'Apreciación: Laboratorio de Introducción'
      );
      if (prevLluvia) {
        setLluviaIdeas(prevLluvia.contenido);
        setIsLluviaIdeasSaved(true);
      }
      
      const prevConclusion = evidencias.find(e => 
        e.titulo === 'Síntesis Final: Laboratorio de Introducción'
      );
      if (prevConclusion) {
        setConclusion(prevConclusion.contenido);
        setIsConclusionSaved(true);
      }
    } catch (error) {
      console.error('Error al cargar evidencias previas:', error);
    }
  };

  const saveLluviaIdeas = async () => {
    if (isLluviaIdeasSaved || !lluviaIdeas.trim()) return;
    
    setLoading(true);
    setMessage('');
    try {
      await evidenciaApi.create({
        titulo: 'Lluvia de Ideas: Laboratorio de Introducción',
        contenido: lluviaIdeas,
        tipoArchivo: 'texto'
      });
      setIsLluviaIdeasSaved(true);
      setMessage('Lluvia de Ideas guardada con éxito en la sección de evidencias.');
    } catch (error) {
      console.error(error);
      setMessage('Error al guardar la Lluvia de Ideas.');
    } finally {
      setLoading(false);
    }
  };

  const saveConclusion = async () => {
    if (isConclusionSaved || !conclusion.trim()) return;
    
    setLoading(true);
    setMessage('');
    try {
      await evidenciaApi.create({
        titulo: 'Síntesis Final: Laboratorio de Introducción',
        contenido: conclusion,
        tipoArchivo: 'texto'
      });
      setIsConclusionSaved(true);
      setMessage('Conclusión guardada con éxito en la sección de evidencias.');
    } catch (error) {
      console.error(error);
      setMessage('Error al guardar la conclusión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="intro-lab-container">
      <div className="intro-header">
        <h1 className="text-neon-blue">Laboratorio de Introducción</h1>
        <p className="subtitle">Presentación de la secuencia didáctica y pensamiento sistémico</p>
      </div>

      <div className="tab-navigation">
        <button 
          className={activeTab === 'ejemplos' ? 'active' : ''} 
          onClick={() => { setActiveTab('ejemplos'); setMessage(''); }}
        >
          <span className="tab-icon">🪐</span> Ejemplos de Sistemas
        </button>
        <button 
          className={activeTab === 'actividad' ? 'active' : ''} 
          onClick={() => { setActiveTab('actividad'); setMessage(''); }}
        >
          <span className="tab-icon">🎨</span> Actividad
        </button>
        <button 
          className={activeTab === 'sintesis' ? 'active' : ''} 
          onClick={() => { setActiveTab('sintesis'); setMessage(''); }}
        >
          <span className="tab-icon">📝</span> Síntesis Final
        </button>
      </div>

      <div className="tab-content glass-panel">
        {/* 1: EJEMPLOS DE SISTEMAS (Ahora incluye Lluvia de Ideas) */}
        {activeTab === 'ejemplos' && (
          <div className="video-section animate-fade">
            
            {/* NUEVA SECCIÓN: CONCEPTO DEL SISTEMA */}
            <div className="concepto-sistema-section mb-5 glass-panel" style={{ position: 'relative', overflow: 'hidden', padding: '2.5rem' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, opacity: 0.3, pointerEvents: 'none' }}>
                <Aurora colorStops={["#1e293b", "#3b82f6", "#0f172a"]} blend={0.6} amplitude={1.2} speed={1.0} />
              </div>
              <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                <BlurText 
                  text="¿Qué es un Sistema?" 
                  className="text-neon-blue mb-4"
                  style={{ fontSize: '2.2rem', fontWeight: 'bold' }}
                  delay={50} 
                />
                
                <FadeContent delay={0.4} duration={0.8} direction="up">
                  <div className="concepto-interactivo mx-auto" style={{ maxWidth: '800px' }}>
                    <p style={{ fontSize: '1.2rem', lineHeight: '1.7', marginBottom: '1.5rem', color: '#e2e8f0' }}>
                      Imagina un montón de piezas de reloj esparcidas sobre una mesa. Por sí solas, no pueden dar la hora. 
                      Pero cuando se <strong>interconectan</strong> de la manera correcta, surge una nueva capacidad: medir el tiempo.
                    </p>
                    <p style={{ fontSize: '1.1rem', color: '#cbd5e1', marginBottom: '2.5rem' }}>
                      Un <strong>sistema</strong> es exactamente eso: un conjunto de elementos que interactúan entre sí para lograr 
                      un <strong>propósito común</strong>. Lo importante no son solo las partes, sino <em>cómo se relacionan</em>.
                    </p>
                    
                    <div className="anim-interconnection" style={{ margin: '0 auto', transform: 'scale(1.2)', transformOrigin: 'center' }}>
                      <div className="node node-1">Parte A</div>
                      <div className="node node-2">Parte B</div>
                      <div className="node node-3">Parte C</div>
                      <div className="connection line-1"></div>
                      <div className="connection line-2"></div>
                      <div className="connection line-3"></div>
                    </div>
                  </div>
                </FadeContent>
              </div>
            </div>

            <hr className="separator mb-5" />

            <h3>🪐 Ejemplos de Sistemas</h3>
            <p className="section-desc">
              Ahora que entiendes el concepto, analicemos estos tres sistemas cotidianos para comprender mejor
              las relaciones sistémicas:
            </p>

            <div className="sim-stack-intro">
              {/* 1. Sistema Solar Completo */}
              <div className="sim-item full-width">
                <h4>El Sistema Solar</h4>
                <div className="sim-visual solar-visual">
                  <div className="stars"></div>
                  <div className="shooting-star"></div>
                  <div className="solar-system-full">
                    <div className="sun-glow"></div>
                    <div className="orbit orbit-mercury"><div className="planet planet-mercury"></div></div>
                    <div className="orbit orbit-venus"><div className="planet planet-venus"></div></div>
                    <div className="orbit orbit-earth">
                      <div className="planet planet-earth">
                        <div className="orbit-moon"><div className="moon"></div></div>
                      </div>
                    </div>
                    <div className="orbit orbit-mars"><div className="planet planet-mars"></div></div>
                    <div className="orbit orbit-jupiter"><div className="planet planet-jupiter"></div></div>
                    <div className="orbit orbit-saturn">
                      <div className="planet planet-saturn">
                        <div className="saturn-rings"></div>
                      </div>
                    </div>
                    <div className="orbit orbit-uranus"><div className="planet planet-uranus"></div></div>
                    <div className="orbit orbit-neptune"><div className="planet planet-neptune"></div></div>
                  </div>
                </div>
                <p className="sim-caption">El sistema solar se compone de una estrella central (el Sol) y 8 planetas principales que orbitan a diferentes distancias y velocidades debido a la fuerza gravitacional. En el enfoque sistémico, la alteración de la masa o de la órbita de uno solo de estos cuerpos masivos desequilibraría toda la estructura gravitatoria.</p>
              </div>

              {/* 2. Sistema Eléctrico (Casa) */}
              <div className="sim-item full-width">
                <h4>Sistema Eléctrico Doméstico</h4>
                <div className="sim-visual electric-visual">
                  <picture>
                    <source media="(min-width: 769px)" srcSet="/assets/images/isometric_house.png" />
                    <img src="/assets/images/isometric_house_mobile.png" className="isometric-bg" alt="Casa Isométrica" />
                  </picture>
                  <div className="isometric-overlay house-circuit-overlay">
                    <svg className="circuit-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
                      <path className="wire-main" d="M 85 88 L 85 70 L 50 70 L 50 48 L 22 48 L 22 30" />
                      <path className="wire-branch" d="M 50 70 L 25 70" />
                      <path className="wire-branch" d="M 50 70 L 72 70" />
                      <path className="wire-branch" d="M 22 30 L 40 30" />
                      <path className="wire-branch" d="M 22 48 L 68 48 L 68 30" />
                      <circle className="energy-dot ed-1" r="1.2">
                        <animateMotion dur="3s" repeatCount="indefinite" path="M 85 88 L 85 70 L 50 70 L 50 48 L 22 48 L 22 30" />
                      </circle>
                      <circle className="energy-dot ed-2" r="1">
                        <animateMotion dur="2.5s" repeatCount="indefinite" begin="0.5s" path="M 50 70 L 25 70" />
                      </circle>
                      <circle className="energy-dot ed-3" r="1">
                        <animateMotion dur="2.5s" repeatCount="indefinite" begin="1s" path="M 50 70 L 72 70" />
                      </circle>
                      <circle className="energy-dot ed-4" r="1">
                        <animateMotion dur="2s" repeatCount="indefinite" begin="1.5s" path="M 22 30 L 40 30" />
                      </circle>
                    </svg>
                    <div className="circuit-source">⚡</div>
                  </div>
                </div>
                <p className="sim-caption">Un hogar cuenta con un sistema eléctrico compuesto por una fuente de energía, una red de conductores (cables) y nodos de consumo (focos, enchufes). Si un nodo falla, el sistema busca rutas alternas, pero si la fuente o la red principal se interrumpe, el sistema completo deja de funcionar y pierde su propósito.</p>
              </div>

              {/* 3. Sistema de Transporte (Ciudad) */}
              <div className="sim-item full-width">
                <h4>Sistema de Transporte Urbano</h4>
                <div className="sim-visual city-visual">
                  <picture>
                    <source media="(min-width: 769px)" srcSet="/assets/images/isometric_city.png" />
                    <img src="/assets/images/isometric_city_mobile.png" className="isometric-bg" alt="Ciudad Isométrica" />
                  </picture>
                  <div className="city-map isometric-overlay">
                    <div className="car-iso car-iso-1"></div>
                    <div className="car-iso car-iso-2"></div>
                    <div className="car-iso car-iso-3"></div>
                    <div className="car-iso car-iso-4"></div>
                  </div>
                </div>
                <p className="sim-caption">Una ciudad es una red de flujos continuos. Sus vías interconectadas, señales, vehículos y pasajeros forman el sistema de transporte. Desde una óptica sistémica, un embotellamiento en una pequeña intersección (cuello de botella) puede generar retrasos en cascada, paralizando zonas distantes de la urbe.</p>
              </div>
            </div>

            <hr className="separator mt-5" />

            <h3>💡 Lluvia de Ideas: Analizando los Ejemplos</h3>
            <p className="section-desc">
              Con base en los ejemplos observados arriba, realiza una lluvia de ideas. Anota por lo menos 3 interconexiones o elementos clave para que <strong>estos sistemas (Solar, Eléctrico, Transporte) funcionen correctamente</strong>. <em>(Por ahora no pienses en el sistema circulatorio, enfócate solo en los 3 ejemplos mostrados)</em>.
            </p>

            <div className="input-group">
              <textarea 
                value={lluviaIdeas}
                onChange={(e) => setLluviaIdeas(e.target.value)}
                disabled={isLluviaIdeasSaved} 
                placeholder="Escribe aquí tu lluvia de ideas..."
                className="glass-textarea" 
                rows="6"
              ></textarea>
            </div>

            <div className="action-footer">
              <button 
                className="btn-save" 
                onClick={saveLluviaIdeas}
                disabled={isLluviaIdeasSaved || !lluviaIdeas.trim() || loading}
              >
                {isLluviaIdeasSaved ? '✓ Lluvia de Ideas Guardada' : (loading ? 'Guardando...' : 'Guardar Evidencia')}
              </button>
            </div>
            {message && activeTab === 'ejemplos' && <p className="status-msg">{message}</p>}
          </div>
        )}

        {/* 2: ACTIVIDAD (AHORA TIENE EL VIDEO Y EL LIENZO) */}
        {activeTab === 'actividad' && (
          <div className="actividad-section animate-fade">
            <h3 className="mb-3">📽️ Proyección de Introducción</h3>
            <p className="section-desc">
              Ahora, observa este video para comprender cómo el pensamiento sistémico
              se aplica al estudio del Sistema Circulatorio humano.
            </p>
            <div className="video-container" style={{ marginBottom: '20px' }}>
              <iframe src="https://www.youtube.com/embed/JmC9nEvw4T8" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
            </div>
            
            <div className="inspiring-text glass-panel mt-4 mb-5">
              <p className="text-neon-blue"><strong>Tu cuerpo es el sistema más perfecto.</strong></p>
              <p>
                Los latidos de tu corazón, el oxígeno que respiras y la sangre que fluye por tus venas
                no son hechos aislados. Todo está conectado en un inmenso tejido de relaciones interdependientes.
                Al comprender las reglas invisibles que rigen tu sistema circulatorio, no solo adquieres el poder de 
                analizar su funcionamiento, sino la capacidad de <strong>tomar decisiones saludables que transformen positivamente 
                tu calidad de vida</strong>.
              </p>
            </div>

            <hr className="separator" />

            <h3>🎨 Actividad: Representación del Sistema Circulatorio</h3>
            <p className="section-desc mb-4">
              Antes de adentrarnos en las simulaciones de los siguientes laboratorios, queremos conocer
              tu modelo mental actual. Utiliza el siguiente lienzo para dibujar cómo imaginas que está
              conectado el sistema circulatorio (corazón, pulmones, vasos sanguíneos).
            </p>
            <DrawingCanvas />
          </div>
        )}

        {/* 3: SÍNTESIS FINAL CON ANIMACIÓN SISTÉMICA */}
        {activeTab === 'sintesis' && (
          <div className="sintesis-section animate-fade">
            <h3>🧩 Comprendiendo el Enfoque Sistémico</h3>
            <p className="section-desc">
              Antes de redactar tu conclusión, interactúa con estos conceptos clave para consolidar 
              tu entendimiento del pensamiento sistémico.
            </p>

            <SystemicAnimations />

            <hr className="separator mt-5" />

            <h3>📝 Síntesis Final</h3>
            <p className="section-desc">
              A modo de cierre de esta sesión introductoria, redacta una conclusión personal o síntesis final
              sobre la importancia de abordar la salud cardiovascular y el cuerpo humano desde una visión sistémica.
            </p>

            <div className="input-group">
              <textarea 
                value={conclusion}
                onChange={(e) => setConclusion(e.target.value)}
                disabled={isConclusionSaved}
                placeholder="Redacta tu síntesis final aquí..." 
                className="glass-textarea" 
                rows="8"
              ></textarea>
            </div>

            <div className="action-footer">
              <button 
                className="btn-save" 
                onClick={saveConclusion}
                disabled={isConclusionSaved || !conclusion.trim() || loading}
              >
                {isConclusionSaved ? '✓ Conclusión Guardada' : (loading ? 'Guardando...' : 'Guardar Evidencia')}
              </button>
            </div>
            {message && activeTab === 'sintesis' && <p className="status-msg">{message}</p>}
          </div>
        )}
      </div>
    </div>
  );
}

// Subcomponente de Animaciones Interactivas del Enfoque Sistémico
const SystemicAnimations = () => {
  const [activeConcept, setActiveConcept] = useState(0);
  
  const concepts = [
    {
      title: "Totalidad e Interconexión",
      desc: "Un sistema es más que la suma de sus partes. Si aíslas una pieza, pierde su función.",
      icon: "🧩"
    },
    {
      title: "Causalidad y Retroalimentación",
      desc: "Las acciones tienen efectos en cadena. La causa A produce B, y B vuelve a regular a A.",
      icon: "🔄"
    },
    {
      title: "Propósito y Homeostasis",
      desc: "Todo sistema tiene un objetivo global. En tu cuerpo, el objetivo es mantenerte con vida (equilibrio).",
      icon: "🎯"
    }
  ];

  return (
    <div className="systemic-animations glass-panel" style={{ position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, opacity: 0.5, pointerEvents: 'none' }}>
        <Aurora colorStops={["#1e293b", "#2563eb", "#0f172a"]} blend={0.5} amplitude={1.2} speed={0.8} />
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div className="concept-tabs">
          {concepts.map((c, i) => (
            <button key={i} className={`concept-btn ${activeConcept === i ? 'active' : ''}`} onClick={() => setActiveConcept(i)}>
              <span className="concept-icon">{c.icon}</span> 
              <span className="concept-title">{c.title}</span>
            </button>
          ))}
        </div>
        
        <div className="concept-content">
          <div style={{ marginBottom: '1rem', minHeight: '32px' }}>
            <BlurText 
              key={activeConcept} 
              text={concepts[activeConcept].title} 
              className="text-neon-blue"
              style={{ fontSize: '1.25rem', fontWeight: 'bold' }}
              delay={40} 
            />
          </div>
          <p className="concept-desc">{concepts[activeConcept].desc}</p>
          
          <div className="concept-visual">
            {activeConcept === 0 && (
              <div className="anim-interconnection">
                <div className="node node-1">Corazón</div>
                <div className="node node-2">Cerebro</div>
                <div className="node node-3">Pulmones</div>
                <div className="connection line-1"></div>
                <div className="connection line-2"></div>
                <div className="connection line-3"></div>
              </div>
            )}
            {activeConcept === 1 && (
              <div className="anim-causality">
                <div className="gear gear-1">⚙️</div>
                <div className="gear gear-2">⚙️</div>
                <div className="gear gear-3">⚙️</div>
              </div>
            )}
            {activeConcept === 2 && (
              <div className="anim-homeostasis">
                <div className="scale">
                  <div className="scale-base"></div>
                  <div className="scale-arm">
                    <div className="weight weight-l">O₂</div>
                    <div className="weight weight-r">CO₂</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
