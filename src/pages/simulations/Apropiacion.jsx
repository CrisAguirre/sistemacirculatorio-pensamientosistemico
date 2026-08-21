import React from 'react';
import './simulations.css';

export default function Apropiacion() {
  return (
    <div className="sim-page">
      <div className="sim-header">
        <h1 className="sim-title">Apropiación</h1>
        <p className="sim-desc">
          En este espacio el docente guiará una reflexión grupal para que apropies los conceptos de pensamiento sistémico
          relacionados con el sistema circulatorio.
        </p>
      </div>

      <div className="sim-content">
        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
          <span style={{ fontSize: '4rem', display: 'block', marginBottom: '20px' }}>👨‍🏫</span>
          <h3>Espacio de Construcción Colectiva</h3>
          <p style={{ color: '#d1d5db', marginTop: '10px' }}>
            Presta atención a las instrucciones de tu profesor sobre cómo estos conceptos se conectan con las simulaciones
            que realizarás más adelante. Este contenido se llenará posteriormente según la guía de la sesión.
          </p>
        </div>
      </div>
    </div>
  );
}
