import { useEffect, useRef } from 'react';
import './heart.css';

const HEART_CX = 380;
const HEART_CY = 330;
const ATRIA_CX = 380;
const ATRIA_CY = 245;

// Ciclo cardíaco (fracciones del ciclo):
//  0.00 – 0.12  sístole auricular
//  0.12 – 0.45  sístole ventricular (contracción principal)
//  0.45 – 1.00  diástole (relajación y llenado)
const ATRIAL_START = 0.0;
const ATRIAL_END = 0.12;
const VENTRICULAR_START = 0.12;
const VENTRICULAR_END = 0.45;

const BLOOD_COLORS = {
  oxygenated: { vessel: '#ef4444', particle: '#fca5a5' },
  deoxygenated: { vessel: '#3b82f6', particle: '#93c5fd' },
};

// Rutas del flujo sanguíneo (también son las pistas de partículas).
// Sangre oxigenada (roja): aorta y venas pulmonares.
// Sangre desoxigenada (azul): venas cavas y arterias pulmonares.
const TRACKS = [
  { id: 'aorta', kind: 'oxygenated', visible: true, d: 'M 392 250 C 392 205 388 175 378 150 C 366 125 340 115 300 120 C 258 125 236 148 238 190 C 242 285 246 385 252 480' },
  { id: 'venaCava', kind: 'deoxygenated', visible: true, d: 'M 512 480 C 505 410 492 340 478 285' },
  { id: 'pulmArtery', kind: 'deoxygenated', visible: true, d: 'M 430 265 C 420 220 412 180 408 140' },
  { id: 'pulmVein', kind: 'oxygenated', visible: true, d: 'M 360 140 C 356 175 360 220 372 258' },
  { id: 'rightHeart', kind: 'deoxygenated', visible: false, d: 'M 478 285 C 470 320 460 360 445 400' },
  { id: 'leftHeart', kind: 'oxygenated', visible: false, d: 'M 392 250 C 384 300 372 360 358 430' },
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
    <svg viewBox="0 0 760 560" className="heart-svg" role="img" aria-label="Corazón anatómico y circulación sanguínea">
      <defs>
        <radialGradient id="myocardiumGrad" cx="45%" cy="35%" r="75%">
          <stop offset="0%" stopColor="#fda4af" />
          <stop offset="55%" stopColor="#ef4444" />
          <stop offset="100%" stopColor="#9f1239" />
        </radialGradient>
        <linearGradient id="oxygenatedGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f87171" />
          <stop offset="100%" stopColor="#b91c1c" />
        </linearGradient>
        <linearGradient id="deoxygenatedGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
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

      {/* Pulmones (contexto, detrás del corazón) */}
      <g className="lungs">
        <ellipse cx="290" cy="110" rx="92" ry="46" fill="url(#lungGrad)" opacity="0.8" />
        <ellipse cx="470" cy="110" rx="92" ry="46" fill="url(#lungGrad)" opacity="0.8" />
        <path d="M 200 108 C 240 120 340 118 380 104 M 380 104 C 420 118 520 120 560 108" fill="none" stroke="#9d174d" strokeWidth="2" opacity="0.5" />
        <text x="380" y="120" className="organ-label">PULMONES</text>
      </g>

      {/* Cuerpo (tejidos) */}
      <g className="body">
        <rect x="140" y="495" width="480" height="44" rx="22" className="body-shape" />
        <text x="380" y="523" className="organ-label">CUERPO (TEJIDOS)</text>
      </g>

      {/* ===== GRANDES VASOS ===== */}
      {/* Vena cava superior (desoxigenada) */}
      <path d="M 512 70 C 505 120 492 180 472 235" fill="none" stroke="url(#deoxygenatedGrad)" strokeWidth="15" strokeLinecap="round" opacity="0.85" />
      {/* Vena cava inferior (desoxigenada) */}
      <path d="M 512 480 C 505 410 492 340 478 285" fill="none" stroke="url(#deoxygenatedGrad)" strokeWidth="15" strokeLinecap="round" opacity="0.85" />

      {/* Tronco pulmonar → arterias pulmonares (desoxigenada) */}
      <path d="M 430 265 C 420 220 412 180 408 140" fill="none" stroke="url(#deoxygenatedGrad)" strokeWidth="13" strokeLinecap="round" opacity="0.85" />
      <path d="M 408 140 C 390 115 360 110 330 112" fill="none" stroke="url(#deoxygenatedGrad)" strokeWidth="10" strokeLinecap="round" opacity="0.7" />
      <path d="M 408 140 C 430 115 460 110 490 112" fill="none" stroke="url(#deoxygenatedGrad)" strokeWidth="10" strokeLinecap="round" opacity="0.7" />

      {/* Venas pulmonares (oxigenada) */}
      <path d="M 360 140 C 356 175 360 220 372 258" fill="none" stroke="url(#oxygenatedGrad)" strokeWidth="9" strokeLinecap="round" opacity="0.8" />
      <path d="M 420 140 C 424 175 420 220 408 255" fill="none" stroke="url(#oxygenatedGrad)" strokeWidth="9" strokeLinecap="round" opacity="0.8" />

      {/* Vasos externos visibles (pistas de partículas) */}
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

      {/* ===== CORAZÓN ===== */}
      <g ref={heartRef}>
        {/* Músculo cardíaco (silueta) */}
        <path
          d="M 350 448 C 345 400 342 350 356 308 C 350 290 350 268 360 252 C 370 236 385 228 400 228 C 418 228 440 232 458 244 C 478 258 490 282 490 310 C 490 340 485 370 475 392 C 468 410 460 428 445 438 C 430 447 405 452 378 452 C 368 452 358 450 350 448 Z"
          fill="url(#myocardiumGrad)"
          stroke="#7f1d1d"
          strokeWidth="3"
          filter="url(#softGlow)"
        />

        {/* Lado derecho (sangre desoxigenada): aurícula y ventrículo derechos */}
        <path
          d="M 400 228 C 418 228 440 232 458 244 C 478 258 490 282 490 310 C 490 340 485 370 475 392 C 468 410 460 428 445 438 C 430 447 405 452 378 452 C 368 452 358 450 350 448 C 380 370 392 300 400 228 Z"
          fill="url(#deoxygenatedGrad)"
          opacity="0.85"
        />
        {/* Lado izquierdo (sangre oxigenada): aurícula y ventrículo izquierdos */}
        <path
          d="M 400 228 C 385 228 370 236 360 252 C 350 268 350 290 356 308 C 342 350 345 400 350 448 C 380 370 392 300 400 228 Z"
          fill="url(#oxygenatedGrad)"
          opacity="0.85"
        />

        {/* Orejuelas (aurículas) */}
        <path d="M 458 250 C 438 244 430 254 434 267 C 439 258 448 255 458 250 Z" fill="url(#deoxygenatedGrad)" opacity="0.9" />
        <path d="M 362 252 C 350 258 346 270 354 278 C 358 268 366 262 362 252 Z" fill="url(#oxygenatedGrad)" opacity="0.9" />

        {/* Surco auriculoventricular (límite aurículas/ventrículos) */}
        <path d="M 356 300 C 380 288 420 288 470 300" fill="none" stroke="#7f1d1d" strokeWidth="2.5" opacity="0.6" />

        {/* Válvulas */}
        <path d="M 442 288 L 450 298 L 458 288" fill="none" stroke="#fff" strokeWidth="2.5" />
        <path d="M 372 288 L 380 298 L 388 288" fill="none" stroke="#fff" strokeWidth="2.5" />

        {/* Arterias coronarias */}
        <path d="M 400 232 C 430 240 450 262 462 300 C 470 330 468 360 456 390" fill="none" stroke="#fca5a5" strokeWidth="3" opacity="0.85" />
        <path d="M 396 232 C 388 280 380 340 362 420" fill="none" stroke="#fca5a5" strokeWidth="3" opacity="0.85" />

        {/* Etiquetas de cavidades */}
        <text x="452" y="262" className="chamber-label">AD</text>
        <text x="346" y="262" className="chamber-label">AI</text>
        <text x="452" y="352" className="chamber-label">VD</text>
        <text x="368" y="352" className="chamber-label">VI</text>
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
