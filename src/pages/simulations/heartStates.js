// Estados fisiológicos del corazón — valores de referencia educativos
// (basados en rangos de la American Heart Association y fisiología cardiovascular estándar:
//  FC normal en reposo 60-100 lpm; PA normal ~120/80 mmHg; gasto cardíaco ~5 L/min en reposo).

export const HEART_STATES = [
  {
    id: 'normal',
    label: 'Normal',
    icon: '✅',
    bpm: 75,
    systolic: 120,
    diastolic: 80,
    strength: 0.6, // fuerza de contracción (0 débil .. 1 fuerte)
    flow: 1.0, // velocidad relativa del flujo sanguíneo
    irregular: false,
    depth: 0.14, // profundidad del latido (contracción)
    color: '#3b82f6',
    title: 'Funcionamiento óptimo (homeostasis)',
    desc: 'Frecuencia y presión dentro del rango saludable. El corazón bombea de forma eficiente y regular.',
    system:
      'Equilibrio sistémico: el sistema nervioso simpático y parasimpático se compensan para mantener estable el organismo.',
  },
  {
    id: 'descansado',
    label: 'Descansado',
    icon: '🛋️',
    bpm: 60,
    systolic: 110,
    diastolic: 70,
    strength: 0.45,
    flow: 0.7,
    irregular: false,
    depth: 0.11,
    color: '#06b6d4',
    title: 'En reposo (dominio parasimpático)',
    desc: 'El nervio vago (parasimpático) frena el corazón. Frecuencia baja y contracción tranquila.',
    system:
      'El sistema parasimpático reduce la frecuencia: el corazón trabaja al mínimo necesario, ahorrando energía.',
  },
  {
    id: 'agitado',
    label: 'Agitado',
    icon: '🏃',
    bpm: 140,
    systolic: 150,
    diastolic: 85,
    strength: 0.95,
    flow: 1.9,
    irregular: false,
    depth: 0.2,
    color: '#f59e0b',
    title: 'Ejercicio / agitación (dominio simpático)',
    desc: 'Adrenalina y noradrenalina aceleran el corazón. Contracción fuerte y flujo rápido para oxigenar los músculos.',
    system:
      'Los músculos demandan más O₂: el cerebro activa el simpático, que aumenta frecuencia y fuerza (retroalimentación de demanda).',
  },
  {
    id: 'nervioso',
    label: 'Nervioso',
    icon: '😰',
    bpm: 105,
    systolic: 130,
    diastolic: 85,
    strength: 0.72,
    flow: 1.25,
    irregular: true,
    depth: 0.16,
    color: '#a855f7',
    title: 'Ansiedad / nerviosismo',
    desc: 'La activación simpática produce palpitaciones y un ritmo ligeramente irregular.',
    system:
      'Las emociones activan el sistema límbico → simpático → corazón. Es la conexión mente-cuerpo del pensamiento sistémico.',
  },
  {
    id: 'hipotension',
    label: 'Hipotensión',
    icon: '📉',
    bpm: 95,
    systolic: 85,
    diastolic: 55,
    strength: 0.3,
    flow: 0.55,
    irregular: false,
    depth: 0.07,
    color: '#10b981',
    title: 'Presión baja (< 90/60 mmHg)',
    desc: 'El corazón late más rápido pero con poca fuerza para compensar la caída de presión.',
    system:
      'Retroalimentación compensatoria: los barorreceptores detectan la caída de presión y ordenan taquicardia para mantener el flujo.',
  },
  {
    id: 'hipertension',
    label: 'Hipertensión',
    icon: '⚠️',
    bpm: 82,
    systolic: 160,
    diastolic: 100,
    strength: 0.9,
    flow: 1.1,
    irregular: false,
    depth: 0.18,
    color: '#ef4444',
    title: 'Presión alta (≥ 140/90 mmHg)',
    desc: 'El corazón bombea contra más resistencia (poscarga). Contracción fuerte y sostenida.',
    system:
      'El corazón trabaja contra una resistencia elevada: con el tiempo se sobrecarga y engrosa su pared (hipertrofia).',
  },
];

export function getState(id) {
  return HEART_STATES.find((s) => s.id === id) || HEART_STATES[0];
}
