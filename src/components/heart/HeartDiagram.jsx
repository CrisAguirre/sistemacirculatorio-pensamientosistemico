import { useEffect, useRef } from 'react';
import './heart.css';

const HEART_CX = 380;
const HEART_CY = 320;
const ATRIA_CX = 380;
const ATRIA_CY = 262;

// Ciclo cardíaco (fracciones del ciclo):
//  0.00 – 0.12  sístole auricular
//  0.12 – 0.45  sístole ventricular (contracción principal)
//  0.45 – 1.00  diástole (relajación y llenado)
const ATRIAL_START = 0.0;
const ATRIAL_END = 0.12;
const VENTRICULAR_START = 0.12;
const VENTRICULAR_END = 0.45;

const HEART_OUTLINE =
  'M 380 232 C 340 232 306 240 288 258 C 268 280 260 308 264 340 C 268 372 288 398 356 412 C 424 398 444 372 448 340 C 452 308 444 280 424 258 C 406 240 394 232 380 232 Z';

const BLOOD_COLORS = {
  oxygenated: { vessel: '#ef4444', particle: '#fca5a5' },
  deoxygenated: { vessel: '#3b82f6', particle: '#93c5fd' },
};

const TRACKS = [
  { id: 'aorta', kind: 'oxygenated', visible: true, d: 'M 440 235 C 500 195 540 200 580 280 C 620 360 630 440 600 490' },
  { id: 'venaCava', kind: 'deoxygenated', visible: true, d: 'M 160 490 C 150 380 200 260 320 235' },
  { id: 'pulmArtery', kind: 'deoxygenated', visible: true, d: 'M 330 230 C 305 190 295 150 295 125' },
  { id: 'pulmVein', kind: 'oxygenated', visible: true, d: 'M 470 120 C 480 160 470 195 430 230' },
  { id: 'rightHeart', kind: 'deoxygenated', visible: false, d: 'M 318 240 C 318 280 324 320 340 362' },
  { id: 'leftHeart', kind: 'oxygenated', visible: false, d: 'M 442 240 C 442 280 436 320 420 362' },
];

const PARTICLES_PER_TRACK = 7;

function pulse(phase, start, end, depth) {
  if (phase < start || phase > end) return 1;
  const t = (phase - start) / (end - start);
  return 1 - depth * Math.sin(t * Math.PI);
}

export default function HeartDiagram({ bpm, depth, flow, irregular, onLub, onDub }) {
  const heartRef = useRef(null);
  const atriaRef = useRef(null);
  const paramsRef = useRef({ bpm, depth, flow, irregular });
  const callbacksRef = useRef({ onLub, onDub });
  const prevPhaseRef = useRef(0);
  const pathRefs = useRef({});
  const particleRefs = useRef({});

  useEffect(() => {
    paramsRef.current = { bpm, depth, flow, irregular };
  }, [bpm, depth, flow, irregular]);

  useEffect(() => {
    callbacksRef.current = { onLub, onDub };
  }, [onLub, onDub]);

  useEffect(() => {
    let raf;
    const start = performance.now();

    function tick(now) {
      const p = paramsRef.current;
      const beatMs = 60000 / p.bpm;
      const elapsed = now - start;

      let cycle = (elapsed / beatMs) % 1;
      if (p.irregular) {
        const jitter = Math.sin(elapsed / 180) * 0.06 + Math.sin(elapsed / 97) * 0.04;
        cycle = (cycle + jitter + 1) % 1;
      }

      // Sístole ventricular (contracción principal) → corazón entero
      const vScale = pulse(cycle, VENTRICULAR_START, VENTRICULAR_END, p.depth);
      if (heartRef.current) {
        heartRef.current.setAttribute(
          'transform',
          `translate(${HEART_CX} ${HEART_CY}) scale(${vScale}) translate(${-HEART_CX} ${-HEART_CY})`
        );
      }

      // Sístole auricular (pre-contracción sutil de las aurículas)
      const aScale = pulse(cycle, ATRIAL_START, ATRIAL_END, 0.08);
      if (atriaRef.current) {
        atriaRef.current.setAttribute(
          'transform',
          `translate(${ATRIA_CX} ${ATRIA_CY}) scale(${aScale}) translate(${-ATRIA_CX} ${-ATRIA_CY})`
        );
      }

      // Sonidos cardíacos: S1 ("lub") al inicio de la sístole ventricular,
      // S2 ("dub") al inicio de la diástole.
      const prev = prevPhaseRef.current;
      if (prev < VENTRICULAR_START && cycle >= VENTRICULAR_START) {
        callbacksRef.current.onLub?.();
      }
      if (prev < VENTRICULAR_END && cycle >= VENTRICULAR_END) {
        callbacksRef.current.onDub?.();
      }
      prevPhaseRef.current = cycle;

      // Flujo sanguíneo (velocidad proporcional al gasto cardíaco).
      for (const track of TRACKS) {
        const pathEl = pathRefs.current[track.id];
        if (!pathEl) continue;
        const len = pathEl.getTotalLength();
        for (let i = 0; i < PARTICLES_PER_TRACK; i++) {
          const el = particleRefs.current[`${track.id}-${i}`];
          if (!el) continue;
          const fraction = ((elapsed * p.flow) / 12000 + i / PARTICLES_PER_TRACK) % 1;
          const pt = pathEl.getPointAtLength(fraction * len);
          el.setAttribute('cx', pt.x);
          el.setAttribute('cy', pt.y);
        }
      }

      raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <svg viewBox="0 0 760 560" className="heart-svg" role="img" aria-label="Corazón y circulación sanguínea">
      <defs>
        <radialGradient id="heartGrad" cx="45%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#fda4af" />
          <stop offset="55%" stopColor="#ef4444" />
          <stop offset="100%" stopColor="#9f1239" />
        </radialGradient>
        <radialGradient id="lungGrad" cx="50%" cy="40%" r="75%">
          <stop offset="0%" stopColor="#f9a8d4" />
          <stop offset="100%" stopColor="#db2777" />
        </radialGradient>
        <filter id="softGlow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Pulmones */}
      <g className="lungs">
        <ellipse cx="295" cy="95" rx="70" ry="42" fill="url(#lungGrad)" opacity="0.85" />
        <ellipse cx="465" cy="95" rx="70" ry="42" fill="url(#lungGrad)" opacity="0.85" />
        <text x="380" y="100" className="organ-label">PULMONES</text>
      </g>

      {/* Cuerpo */}
      <g className="body">
        <rect x="140" y="490" width="480" height="44" rx="22" className="body-shape" />
        <text x="380" y="518" className="organ-label">CUERPO (TEJIDOS)</text>
      </g>

      {/* Vasos externos (visibles, también son pistas de partículas) */}
      {TRACKS.filter((t) => t.visible).map((t) => (
        <path
          key={t.id}
          ref={(el) => { pathRefs.current[t.id] = el; }}
          d={t.d}
          fill="none"
          stroke={BLOOD_COLORS[t.kind].vessel}
          strokeWidth="13"
          strokeLinecap="round"
          opacity="0.5"
        />
      ))}

      {/* Corazón (contracción ventricular) */}
      <g ref={heartRef}>
        {/* Músculo cardíaco */}
        <path
          d={HEART_OUTLINE}
          fill="url(#heartGrad)"
          stroke="#7f1d1d"
          strokeWidth="3"
          filter="url(#softGlow)"
        />

        {/* Ventrículos */}
        <ellipse cx="330" cy="358" rx="32" ry="36" fill="#1d4ed8" opacity="0.5" />
        <ellipse cx="420" cy="358" rx="28" ry="38" fill="#ef4444" opacity="0.5" />

        {/* Aurículas (sístole auricular) */}
        <g ref={atriaRef}>
          <ellipse cx="325" cy="262" rx="30" ry="22" fill="#1d4ed8" opacity="0.55" />
          <ellipse cx="432" cy="262" rx="24" ry="22" fill="#ef4444" opacity="0.5" />
        </g>

        {/* Septo interventricular */}
        <path d="M 380 258 C 372 300 368 340 356 408" fill="none" stroke="#7f1d1d" strokeWidth="3" />
        {/* Límite aurículas/ventrículos */}
        <path d="M 300 302 C 330 296 430 296 458 302" fill="none" stroke="#7f1d1d" strokeWidth="2.5" />

        {/* Válvulas */}
        <path d="M 342 296 L 352 304 L 362 296" fill="none" stroke="#fff" strokeWidth="2" />
        <path d="M 398 296 L 408 304 L 418 296" fill="none" stroke="#fff" strokeWidth="2" />

        {/* Arterias coronarias */}
        <path d="M 380 260 C 356 278 346 318 366 366" fill="none" stroke="#fca5a5" strokeWidth="2.5" opacity="0.7" />
        <path d="M 380 260 C 404 278 414 318 398 366" fill="none" stroke="#fca5a5" strokeWidth="2.5" opacity="0.7" />

        {/* Etiquetas de cavidades */}
        <text x="322" y="282" className="chamber-label">AD</text>
        <text x="438" y="282" className="chamber-label">AI</text>
        <text x="320" y="352" className="chamber-label">VD</text>
        <text x="438" y="352" className="chamber-label">VI</text>
      </g>

      {/* Pistas internas (flujo dentro del corazón, invisibles) */}
      {TRACKS.filter((t) => !t.visible).map((t) => (
        <path
          key={t.id}
          ref={(el) => { pathRefs.current[t.id] = el; }}
          d={t.d}
          fill="none"
          stroke="none"
        />
      ))}

      {/* Partículas de sangre */}
      {TRACKS.map((t) =>
        Array.from({ length: PARTICLES_PER_TRACK }).map((_, i) => (
          <circle
            key={`${t.id}-${i}`}
            ref={(el) => { particleRefs.current[`${t.id}-${i}`] = el; }}
            cx={HEART_CX}
            cy={HEART_CY}
            r={i % 2 === 0 ? 5 : 3.5}
            fill={BLOOD_COLORS[t.kind].particle}
          />
        ))
      )}
    </svg>
  );
}
