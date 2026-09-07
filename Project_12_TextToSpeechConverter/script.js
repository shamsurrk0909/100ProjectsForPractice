// Day 18 — Text-to-Speech Converter using Web Speech API

const textEl = document.getElementById('text');
const voiceSelect = document.getElementById('voiceSelect');
const rateEl = document.getElementById('rate');
const pitchEl = document.getElementById('pitch');
const volumeEl = document.getElementById('volume');
const rateVal = document.getElementById('rateVal');
const pitchVal = document.getElementById('pitchVal');
const volVal = document.getElementById('volVal');

const playBtn = document.getElementById('playBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resumeBtn = document.getElementById('resumeBtn');
const stopBtn = document.getElementById('stopBtn');

const statusEl = document.getElementById('status');

let synth = window.speechSynthesis || null;
let voices = [];
let utter = null; // current SpeechSynthesisUtterance

// Utils
function setStatus(msg, isError=false) {
  statusEl.textContent = msg;
  statusEl.style.color = isError ? '#ffbaba' : '';
}

// Check support
if (!synth) {
  // No Web Speech API support
  setStatus('Speech Synthesis API not supported in this browser.', true);
  // disable controls
  [playBtn, pauseBtn, resumeBtn, stopBtn].forEach(b => b.disabled = true);
  voiceSelect.disabled = true;
} else {
  // populate voices (async; some browsers load voices after some time)
  function loadVoices() {
    voices = synth.getVoices().sort((a,b) => a.name.localeCompare(b.name));
    voiceSelect.innerHTML = '';
    voices.forEach((v,i) => {
      const opt = document.createElement('option');
      opt.value = i;
      opt.textContent = `${v.name} ${v.lang ? ' — ' + v.lang : ''}${v.default ? ' (default)' : ''}`;
      voiceSelect.appendChild(opt);
    });
    // choose a default voice close to user's lang or the first
    const userLang = navigator.language || navigator.userLanguage || '';
    const preferredIndex = voices.findIndex(v => v.lang && v.lang.startsWith(userLang.split('-')[0]));
    voiceSelect.value = preferredIndex >= 0 ? preferredIndex : 0;
    setStatus('Voices loaded. Ready.');
  }

  loadVoices();
  // Chrome/Edge may fire 'voiceschanged'
  synth.onvoiceschanged = loadVoices;
}

// Sync UI labels for sliders
rateEl.addEventListener('input', () => rateVal.textContent = rateEl.value);
pitchEl.addEventListener('input', () => pitchVal.textContent = pitchEl.value);
volumeEl.addEventListener('input', () => volVal.textContent = volumeEl.value);

// Create a new utterance with current settings
function createUtterance() {
  if (!synth) return null;
  const text = textEl.value.trim();
  if (!text) return null;

  const u = new SpeechSynthesisUtterance(text);
  const voiceIndex = parseInt(voiceSelect.value, 10);
  if (!isNaN(voiceIndex) && voices[voiceIndex]) u.voice = voices[voiceIndex];
  u.rate = Number(rateEl.value) || 1;
  u.pitch = Number(pitchEl.value) || 1;
  u.volume = Number(volumeEl.value);
  // event handlers
  u.onstart = () => {
    setStatus('Speaking...');
    playBtn.disabled = true;
    pauseBtn.disabled = false;
    stopBtn.disabled = false;
    resumeBtn.disabled = true;
  };
  u.onend = () => {
    setStatus('Finished speaking.');
    playBtn.disabled = false;
    pauseBtn.disabled = true;
    resumeBtn.disabled = true;
    stopBtn.disabled = true;
    utter = null;
  };
  u.onerror = (e) => {
    console.error('Speech error', e);
    setStatus('Speech error occurred.', true);
    playBtn.disabled = false;
    pauseBtn.disabled = true;
    resumeBtn.disabled = true;
    stopBtn.disabled = true;
    utter = null;
  };
  u.onpause = () => {
    setStatus('Paused.');
    pauseBtn.disabled = true;
    resumeBtn.disabled = false;
  };
  u.onresume = () => {
    setStatus('Resumed.');
    pauseBtn.disabled = false;
    resumeBtn.disabled = true;
  };
  return u;
}

// Play
playBtn.addEventListener('click', () => {
  if (!synth) return;
  // If already speaking, stop first
  if (synth.speaking) {
    // stop current to restart with new settings
    synth.cancel();
    utter = null;
  }
  const u = createUtterance();
  if (!u) {
    setStatus('Please enter some text to speak.', true);
    return;
  }
  utter = u;
  // Some browsers require user gesture; we already are in click handler.
  synth.speak(utter);
});

// Pause
pauseBtn.addEventListener('click', () => {
  if (!synth) return;
  if (synth.speaking && !synth.paused) {
    synth.pause();
    // onpause event will update UI
  }
});

// Resume
resumeBtn.addEventListener('click', () => {
  if (!synth) return;
  if (synth.paused) {
    synth.resume();
    // onresume event will update UI
  }
});

// Stop / Cancel
stopBtn.addEventListener('click', () => {
  if (!synth) return;
  if (synth.speaking) {
    synth.cancel();
    // onend/onerror will update UI
    setStatus('Stopped.');
    playBtn.disabled = false;
    pauseBtn.disabled = true;
    resumeBtn.disabled = true;
    stopBtn.disabled = true;
    utter = null;
  }
});

// Optional: update UI when user changes voice while speaking — restart speech
voiceSelect.addEventListener('change', () => {
  if (!synth) return;
  if (synth.speaking) {
    // restart with new voice
    synth.cancel();
    const u = createUtterance();
    if (u) {
      utter = u;
      synth.speak(utter);
    }
  }
});

// If user edits text while speaking, consider restarting (simple approach)
textEl.addEventListener('input', () => {
  if (!synth) return;
  if (synth.speaking) {
    // small debounce to avoid too frequent restarts
    if (window._ttsTimer) clearTimeout(window._ttsTimer);
    window._ttsTimer = setTimeout(() => {
      if (synth.speaking) {
        synth.cancel();
        const u = createUtterance();
        if (u) synth.speak(u);
      }
    }, 500);
  }
});

// Initialize controls state
(function initControls() {
  playBtn.disabled = false;
  pauseBtn.disabled = true;
  resumeBtn.disabled = true;
  stopBtn.disabled = true;
})();
