// Digital Piano — Web Audio API + keyboard events

// NOTE: For best UX, user must interact (click) before AudioContext can be resumed in some browsers.
// We'll resume context on first user gesture.

const NOTE_NAMES = [
  // white and black layout for C4..C5 (12 semitones + C5)
  // We'll create a structure describing keys in left-to-right order
  {name:'C',  midi:60, color:'white', key:'a'},
  {name:'C#', midi:61, color:'black', key:'w'},
  {name:'D',  midi:62, color:'white', key:'s'},
  {name:'D#', midi:63, color:'black', key:'e'},
  {name:'E',  midi:64, color:'white', key:'d'},
  {name:'F',  midi:65, color:'white', key:'f'},
  {name:'F#', midi:66, color:'black', key:'t'},
  {name:'G',  midi:67, color:'white', key:'g'},
  {name:'G#', midi:68, color:'black', key:'y'},
  {name:'A',  midi:69, color:'white', key:'h'},
  {name:'A#', midi:70, color:'black', key:'u'},
  {name:'B',  midi:71, color:'white', key:'j'},
  {name:'C5', midi:72, color:'white', key:'k'}
];

// Basic MIDI to frequency
function midiToFreq(m) {
  return 440 * Math.pow(2, (m - 69) / 12);
}

// Audio setup
let audioCtx = null;
const master = { volume: 0.4, wave: 'sine', octaveShift: 0 }; // octaveShift in semitones (multiples of 12)
const activeVoices = new Map(); // map by identifier (keyboard key or element id)

// Create UI keys
const pianoEl = document.getElementById('piano');
const octaveLabel = document.getElementById('octaveLabel');
function buildKeyboard() {
  // White keys container (we will create whites in order and overlay blacks)
  const whiteContainer = document.createElement('div');
  whiteContainer.className = 'piano-row';
  pianoEl.appendChild(whiteContainer);

  // We'll also create an absolute layer for black keys to position them
  const blackLayer = document.createElement('div');
  blackLayer.className = 'black-positions';
  pianoEl.appendChild(blackLayer);

  NOTE_NAMES.forEach((n, i) => {
    const el = document.createElement('div');
    el.className = 'key ' + (n.color === 'white' ? 'white' : 'black');
    el.dataset.midi = n.midi;
    el.dataset.key = n.key;
    el.dataset.idx = i;
    el.innerHTML = `<div class="label">${n.name}<div style="font-size:11px;color:inherit;margin-top:6px">${n.key.toUpperCase()}</div></div>`;
    // Append to appropriate container
    if(n.color === 'white') whiteContainer.appendChild(el);
    else blackLayer.appendChild(el);
    // mouse events
    attachPointerHandlers(el);
  });
}
buildKeyboard();

// UI controls
const waveSelect = document.getElementById('waveSelect');
const volumeInput = document.getElementById('volume');
const octUp = document.getElementById('octUp');
const octDown = document.getElementById('octDown');

waveSelect.addEventListener('change', e => master.wave = e.target.value);
volumeInput.addEventListener('input', e => master.volume = parseFloat(e.target.value));
octUp.addEventListener('click', () => changeOctave(1));
octDown.addEventListener('click', () => changeOctave(-1));

function changeOctave(delta) {
  master.octaveShift = Math.max(-2, Math.min(2, master.octaveShift + delta)); // limit -2..+2
  const baseOct = 4 + master.octaveShift;
  octaveLabel.textContent = `Octave: ${baseOct}`;
}

// Helper: ensure audio context ready
function ensureAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    // Create a master gain node — we create per-voice gain nodes as children
    audioCtx.masterGain = audioCtx.createGain();
    audioCtx.masterGain.gain.value = master.volume;
    audioCtx.masterGain.connect(audioCtx.destination);
  }
  // sync master volume
  if (audioCtx.masterGain) audioCtx.masterGain.gain.value = master.volume;
}

// Play a note (create oscillator + gain with ADSR)
function playNote(midi, id) {
  ensureAudio();
  if (!audioCtx) return;
  const now = audioCtx.currentTime;
  const freq = midiToFreq(midi + master.octaveShift * 12);

  // If voice for this id already exists, ignore (prevents retrigger)
  if (activeVoices.has(id)) return;

  const osc = audioCtx.createOscillator();
  osc.type = master.wave || 'sine';
  osc.frequency.value = freq;

  const gain = audioCtx.createGain();
  gain.gain.value = 0.0001; // start almost silent

  osc.connect(gain);
  gain.connect(audioCtx.masterGain);

  // ADSR envelope (attack, decay, sustain, release in seconds)
  const attack = 0.01;
  const decay = 0.12;
  const sustain = 0.6;
  const release = 0.3;
  // schedule envelope
  gain.gain.cancelScheduledValues(now);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(1.0, now + attack);
  gain.gain.exponentialRampToValueAtTime(sustain, now + attack + decay);

  osc.start(now);

  activeVoices.set(id, { osc, gain, release, started: now, midi });

  // Visual
  const keyEl = findKeyElementByMidi(midi);
  if (keyEl) keyEl.classList.add('active');
}

// Stop a note — release envelope then stop
function stopNote(id) {
  if (!audioCtx) return;
  const voice = activeVoices.get(id);
  if (!voice) return;
  const now = audioCtx.currentTime;
  const { gain, osc, release } = voice;
  // ramp down
  gain.gain.cancelScheduledValues(now);
  gain.gain.setValueAtTime(gain.gain.value, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + release);
  // stop oscillator after release
  osc.stop(now + release + 0.05);
  // cleanup after delay
  setTimeout(() => {
    try { gain.disconnect(); osc.disconnect(); } catch (e) {}
    activeVoices.delete(id);
  }, (release + 0.1) * 1000);

  // Visual
  const keyEl = findKeyElementById(id);
  if (keyEl) keyEl.classList.remove('active');
}

// Utility to find DOM key element by midi
function findKeyElementByMidi(midi) {
  return pianoEl.querySelector(`.key[data-midi="${midi}"]`);
}
function findKeyElementById(id) {
  // id format: 'kbd_h' or 'mouse_3' etc
  if (id.startsWith('kbd_')) {
    const keyChar = id.slice(4);
    return pianoEl.querySelector(`.key[data-key="${keyChar}"]`);
  } else if (id.startsWith('mouse_')) {
    const idx = id.slice(6); // index used in dataset idx
    return pianoEl.querySelector(`.key[data-idx="${idx}"]`);
  }
  return null;
}

// Keyboard handling: map characters to midi via NOTE_NAMES
const keyToMidi = {};
NOTE_NAMES.forEach(n => keyToMidi[n.key] = n.midi);

// Track which keyboard keys are down to avoid repeats
const keysDown = new Set();

document.addEventListener('keydown', (e) => {
  // ignore when focus in input elements (none here, but safe)
  if (e.repeat) return; // ignore repeat events — we want hold behavior via keydown once
  const k = e.key.toLowerCase();
  if (keyToMidi[k] !== undefined) {
    // resume audio context on first user action if needed
    if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
    const midi = keyToMidi[k];
    const id = 'kbd_' + k;
    playNote(midi, id);
    keysDown.add(k);
    e.preventDefault();
  }
});

document.addEventListener('keyup', (e) => {
  const k = e.key.toLowerCase();
  if (keyToMidi[k] !== undefined) {
    const id = 'kbd_' + k;
    stopNote(id);
    keysDown.delete(k);
    e.preventDefault();
  }
});

// Pointer (mouse/touch) handlers for clickable keys
function attachPointerHandlers(keyEl) {
  // Each key element has dataset.idx and dataset.midi
  const idx = keyEl.dataset.idx;
  const midi = parseInt(keyEl.dataset.midi, 10);
  // For identification we use mouse_<idx>
  const id = 'mouse_' + idx;

  const start = (ev) => {
    // resume audio if needed
    if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
    playNote(midi, id);
    ev.preventDefault();
  };
  const end = (ev) => {
    stopNote(id);
    ev.preventDefault();
  };

  keyEl.addEventListener('mousedown', start);
  keyEl.addEventListener('touchstart', start, {passive:false});
  // stop on mouseup anywhere (in case pointer leaves key)
  document.addEventListener('mouseup', end);
  document.addEventListener('touchend', end);
  document.addEventListener('touchcancel', end);
}

// allow clicking anywhere first to unlock audio in mobile browsers
document.addEventListener('pointerdown', () => {
  if (!audioCtx) ensureAudio();
}, { once: true });

// Keyboard legend for accessibility: show active when audio context suspended/resumed
// (no-op function here but kept for extension)
function updateMasterGain() {
  if (audioCtx && audioCtx.masterGain) audioCtx.masterGain.gain.value = master.volume;
}
volumeInput.addEventListener('input', () => {
  master.volume = parseFloat(volumeInput.value);
  if (audioCtx) updateMasterGain();
});

// Clean up voices on visibility change to avoid stuck notes
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // stop all voices fast
    for (const id of Array.from(activeVoices.keys())) stopNote(id);
    if (audioCtx && audioCtx.state === 'running') audioCtx.suspend();
  } else {
    if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
  }
});

// initial octave label
changeOctave(0);

// Extra: allow clicking a key by mouse to focus resume audio
pianoEl.addEventListener('click', (e) => {
  if (!audioCtx) ensureAudio();
});
