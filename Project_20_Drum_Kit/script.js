/* Day 11 — Drum Kit
   Place sample files (recommended names) in a folder named `sounds/`:
   sounds/kick.wav
   sounds/snare.wav
   sounds/hihat.wav
   sounds/tom.wav
   sounds/crash.wav
   sounds/ride.wav
   sounds/clap.wav
   sounds/perc.wav
*/

// Mapping: each pad has an id, display label, keyboard key, and sample filename
const PADS = [
  { id: 'kick', label: 'Kick', key: 'a', file: 'kick.wav', type: 'kick' },
  { id: 'snare', label: 'Snare', key: 's', file: 'snare.wav', type: 'snare' },
  { id: 'hihat', label: 'Hi-Hat', key: 'd', file: 'hihat.wav', type: 'hat' },
  { id: 'tom', label: 'Tom', key: 'f', file: 'tom.wav', type: 'tom' },
  { id: 'crash', label: 'Crash', key: 'g', file: 'crash.wav', type: 'crash' },
  { id: 'ride', label: 'Ride', key: 'h', file: 'ride.wav', type: 'ride' },
  { id: 'clap', label: 'Clap', key: 'j', file: 'clap.wav', type: 'snare' },
  { id: 'perc', label: 'Perc', key: 'k', file: 'perc.wav', type: 'perc' }
];

// Elements
const kitEl = document.getElementById('kit');

// Web Audio context & buffers
let audioCtx = null;
const buffers = new Map();       // id -> AudioBuffer or null
const audioElements = new Map(); // id -> HTMLAudioElement fallback
const SOUND_PATH = 'sounds/';    // folder where sound files are kept

// Build pads dynamically in DOM
function buildPads() {
  PADS.forEach(p => {
    const pad = document.createElement('button');
    pad.className = 'pad';
    pad.id = 'pad-' + p.id;
    pad.setAttribute('data-id', p.id);
    pad.setAttribute(
      'aria-label',
      `${p.label} drum pad, key ${p.key.toUpperCase()}`
    );

    pad.innerHTML = `
      <div class="label">${p.label}</div>
      <div class="key">${p.key.toUpperCase()}</div>
      <div class="sub">Click or press ${p.key.toUpperCase()}</div>
    `;

    kitEl.appendChild(pad);

    // pointer events
    pad.addEventListener('pointerdown', ev => {
      ev.preventDefault();
      const rect = pad.getBoundingClientRect();
      const relY = Math.max(
        0,
        Math.min(1, (ev.clientY - rect.top) / rect.height)
      );
      const velocity = 1 - relY; // louder at top
      triggerPad(p.id, velocity);
    });

    document.addEventListener('pointerup', () =>
      pad.classList.remove('active')
    );
  });
}

// Initialize Web Audio & load sample files
async function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    audioCtx.master = audioCtx.createGain();
    audioCtx.master.gain.value = 0.9;
    audioCtx.master.connect(audioCtx.destination);
  }

  await Promise.all(
    PADS.map(async p => {
      const url = SOUND_PATH + p.file;

      try {
        const resp = await fetch(url, { cache: 'force-cache' });
        if (!resp.ok) throw new Error('Not found');
        const arrayBuffer = await resp.arrayBuffer();
        const decoded = await audioCtx.decodeAudioData(arrayBuffer);
        buffers.set(p.id, decoded);
      } catch (err) {
        buffers.set(p.id, null);
        try {
          const audio = new Audio(url);
          audio.preload = 'auto';
          audioElements.set(p.id, audio);
        } catch {
          audioElements.set(p.id, null);
        }
      }
    })
  );
}

// Play using AudioBuffer or fallback
function playBuffer(id, velocity = 1) {
  const buf = buffers.get(id);
  if (!audioCtx) return;

  const now = audioCtx.currentTime;

  if (buf) {
    const src = audioCtx.createBufferSource();
    src.buffer = buf;
    const gain = audioCtx.createGain();
    gain.gain.value = Math.max(0.08, Math.min(1, velocity));
    src.connect(gain);
    gain.connect(audioCtx.master);
    src.start(now);

    src.onended = () => {
      try {
        src.disconnect();
        gain.disconnect();
      } catch {}
    };
  } else {
    const el = audioElements.get(id);
    if (el) {
      const clone = el.cloneNode();
      clone.volume = Math.max(0.08, Math.min(1, velocity));
      clone.play().catch(() => {});
    } else {
      synthDrum(id, velocity);
    }
  }
}

// Basic synthesized fallback for missing samples
function synthDrum(id, velocity = 1) {
  if (!audioCtx) return;
  const now = audioCtx.currentTime;
  const type = (PADS.find(p => p.id === id) || {}).type || 'perc';

  if (type === 'kick') {
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(150, now);
    o.frequency.exponentialRampToValueAtTime(40, now + 0.15);
    g.gain.setValueAtTime(0.001, now);
    g.gain.exponentialRampToValueAtTime(0.8 * velocity, now + 0.02);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    o.connect(g);
    g.connect(audioCtx.master);
    o.start(now);
    o.stop(now + 0.6);
  } else if (type === 'snare' || type === 'perc') {
    const bufferSize = audioCtx.sampleRate * 0.2;
    const noise = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = noise.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] =
        (Math.random() * 2 - 1) *
        Math.exp(-i / (bufferSize * 0.05));
    }
    const src = audioCtx.createBufferSource();
    src.buffer = noise;
    const bp = audioCtx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = 1800;
    const g = audioCtx.createGain();
    g.gain.setValueAtTime(0.001, now);
    g.gain.exponentialRampToValueAtTime(0.8 * velocity, now + 0.005);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
    src.connect(bp);
    bp.connect(g);
    g.connect(audioCtx.master);
    src.start(now);
    src.stop(now + 0.2);
  } else if (type === 'hat' || type === 'ride') {
    const bufferSize = audioCtx.sampleRate * 0.06;
    const noise = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = noise.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] =
        (Math.random() * 2 - 1) *
        Math.exp(-i / (bufferSize * 0.02));
    }
    const src = audioCtx.createBufferSource();
    src.buffer = noise;
    const hp = audioCtx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = 5000;
    const g = audioCtx.createGain();
    g.gain.setValueAtTime(0.001, now);
    g.gain.exponentialRampToValueAtTime(0.8 * velocity, now + 0.002);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
    src.connect(hp);
    hp.connect(g);
    g.connect(audioCtx.master);
    src.start(now);
    src.stop(now + 0.08);
  } else {
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.type = 'square';
    o.frequency.value = 1000;
    g.gain.value = 0.0001;
    g.gain.exponentialRampToValueAtTime(0.6 * velocity, now + 0.001);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
    o.connect(g);
    g.connect(audioCtx.master);
    o.start(now);
    o.stop(now + 0.1);
  }
}

// Trigger pad + animation
function triggerPad(id, velocity = 1) {
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }

  const padEl = document.getElementById('pad-' + id);
  if (padEl) {
    padEl.classList.add('active');
    setTimeout(() => padEl.classList.remove('active'), 160);
  }

  playBuffer(id, velocity);
}

// Keyboard mappings
const keyToPad = {};
PADS.forEach(p => (keyToPad[p.key] = p.id));

const keysDown = new Set();

document.addEventListener('keydown', e => {
  if (e.repeat) return;

  const k = e.key.toLowerCase();
  const padId = keyToPad[k];

  if (padId) {
    if (!audioCtx) {
      initAudio().catch(() => {});
    } else if (audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }

    const velocity = e.shiftKey ? 0.6 : 1;
    triggerPad(padId, velocity);
    keysDown.add(k);
    e.preventDefault();
  }
});

document.addEventListener('keyup', e => {
  const k = e.key.toLowerCase();
  keysDown.delete(k);
});

// Build UI on page load
buildPads();

// Auto init on first click anywhere
document.addEventListener('pointerdown', async function initOnce() {
  document.removeEventListener('pointerdown', initOnce);
  try {
    await initAudio();
  } catch (e) {
    console.warn('Audio init failed, using synth fallback.', e);
  }
});

// Debug
window.triggerPad = triggerPad;
