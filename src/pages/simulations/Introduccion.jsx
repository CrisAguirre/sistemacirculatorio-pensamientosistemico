import React, { useState, useEffect } from 'react';
import { evidenciaApi } from '../../api/evidencia';
import './introduccion.css';

export default function Introduccion() {
  const [activeTab, setActiveTab] = useState('ejemplos');
  const [lluviaIdeas, setLluviaIdeas] = useState('');
  const [conclusion, setConclusion] = useState('');
  
  const [isLluviaIdeasSaved, setIsLluviaIdeasSaved] = useState(false);
  const [isConclusionSaved, setIsConclusionSaved] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Video URL: "El sistema circulatorio del cuerpo humano para niños" (Smile and Learn / Educational)
  const videoUrl = 'https://www.youtube.com/embed/ndj0BqE2_qE?start=0';

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
          className={activeTab === 'lluvia' ? 'active' : ''} 
          onClick={() => { setActiveTab('lluvia'); setMessage(''); }}
        >
          <span className="tab-icon">💡</span> Lluvia de Ideas
        </button>
        <button 
          className={activeTab === 'sintesis' ? 'active' : ''} 
          onClick={() => { setActiveTab('sintesis'); setMessage(''); }}
        >
          <span className="tab-icon">📝</span> Síntesis Final
        </button>
      </div>

      <div className="tab-content glass-panel">
        {/* 1: EJEMPLOS DE SISTEMAS */}
        {activeTab === 'ejemplos' && (
          <div className="video-section animate-fade">
            <h3>🪐 Ejemplos de Sistemas</h3>
            <p className="section-desc">
              Antes de ver el video introductorio, analicemos estos tres sistemas cotidianos para entender
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
          </div>
        )}

        {/* 2: LLUVIA DE IDEAS */}
        {activeTab === 'lluvia' && (
          <div className="foro-section animate-fade">
            <h3 className="mb-3">📽️ Proyección de Introducción</h3>
            <p className="section-desc">
              Ahora, observa este video para comprender cómo el pensamiento sistémico
              se aplica al estudio del Sistema Circulatorio humano.
            </p>
            <div className="video-wrapper">
              <iframe 
                src={videoUrl} 
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Video Sistema Circulatorio"
              ></iframe>
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

            <h3>💡 Lluvia de Ideas</h3>
            <p className="section-desc">
              Con base en los ejemplos observados y el video, realiza una lluvia de ideas. Anota al menos 3 interconexiones
              o elementos que consideres clave para entender el sistema circulatorio como un sistema completo.
            </p>

            <div className="input-group">
              <textarea 
                value={lluviaIdeas}
                onChange={(e) => setLluviaIdeas(e.target.value)}
                disabled={isLluviaIdeasSaved} 
                placeholder="Escribe aquí tu lluvia de ideas..."
                className="glass-textarea" 
                rows="8"
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
            {message && <p className="status-msg">{message}</p>}
          </div>
        )}

        {/* 3: SÍNTESIS FINAL */}
        {activeTab === 'sintesis' && (
          <div className="sintesis-section animate-fade">
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
            {message && <p className="status-msg">{message}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
