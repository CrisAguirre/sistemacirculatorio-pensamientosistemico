// Motor de audio del corazón: genera los sonidos "lub" (S1) y "dub" (S2)
// usando la Web Audio API. El "lub" (cierre de válvulas AV) es más grave;
// el "dub" (cierre de válvulas semilunares) es un poco más agudo y corto.

let ctx = null;

export function ensureAudio() {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      ctx = new AudioCtx();
    } catch {
      ctx = null;
    }
  }
  if (ctx && ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }
  return ctx;
}

export function closeAudio() {
  if (ctx) {
    ctx.close().catch(() => {});
    ctx = null;
  }
}

function thump(freq, dur) {
  const ac = ensureAudio();
  if (!ac) return;
  const t = ac.currentTime;

  const osc = ac.createOscillator();
  const gain = ac.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, t);
  osc.frequency.exponentialRampToValueAtTime(freq * 0.4, t + dur);

  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(0.5, t + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);

  osc.connect(gain);
  gain.connect(ac.destination);
  osc.start(t);
  osc.stop(t + dur + 0.02);
}

export const heartSound = {
  lub: () => thump(72, 0.16),
  dub: () => thump(98, 0.11),
};
