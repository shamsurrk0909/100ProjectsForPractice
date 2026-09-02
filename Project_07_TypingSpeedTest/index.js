// Day 10 — Typing Speed Test
// Concepts used: setInterval, clearInterval, event listeners, string comparison

// Sample texts (short list; add more as desired)
const SAMPLES = [
  "The quick brown fox jumps over the lazy dog.",
  "Practice makes progress. Keep typing to improve your speed and accuracy.",
  "Web development combines creativity with logic — build small projects every day.",
  "Typing fast is great, but typing accurately will get you further in the long run.",
];

// DOM
const quoteEl = document.getElementById("quote");
const inputEl = document.getElementById("input");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const durationSelect = document.getElementById("duration");

const timeEl = document.getElementById("time");
const wpmEl = document.getElementById("wpm");
const cpmEl = document.getElementById("cpm");
const accuracyEl = document.getElementById("accuracy");
const errorsEl = document.getElementById("errors");

const finalPanel = document.getElementById("final");
const finalWpm = document.getElementById("finalWpm");
const finalAcc = document.getElementById("finalAcc");
const finalCpm = document.getElementById("finalCpm");
const finalErr = document.getElementById("finalErr");
const tryAgainBtn = document.getElementById("tryAgain");

// State
let reference = ""; // text user must type
let timer = null;
let duration = 60; // seconds (default)
let remaining = 60;
let started = false;
let startTime = 0;
let typedChars = 0; // total typed (including corrections)
let correctChars = 0; // chars currently correct (position-wise)
let errors = 0; // positions currently incorrect
let lastInput = ""; // last input string

// Initialize a test
function pickSample() {
  const idx = Math.floor(Math.random() * SAMPLES.length);
  return SAMPLES[idx];
}

function renderReference(text) {
  reference = text;
  quoteEl.innerHTML = "";
  for (let i = 0; i < text.length; i++) {
    const span = document.createElement("span");
    span.className = "char";
    span.textContent = text[i];
    span.dataset.index = i;
    quoteEl.appendChild(span);
  }
  highlightCurrent(0);
}

// Highlight current index
function highlightCurrent(pos) {
  const spans = quoteEl.querySelectorAll(".char");
  spans.forEach((sp) => {
    sp.classList.remove("current");
  });
  const cur = quoteEl.querySelector(`.char[data-index="${pos}"]`);
  if (cur) cur.classList.add("current");
}

// Reset stats & UI
function resetTest(autoFocus = true) {
  clearInterval(timer);
  timer = null;
  started = false;
  duration = parseInt(durationSelect.value, 10) || 60;
  remaining = duration;
  startTime = 0;
  typedChars = 0;
  correctChars = 0;
  errors = 0;
  lastInput = "";
  updateStatsDisplay(0, 0, 100, 0);
  timeEl.textContent = formatTime(remaining);
  inputEl.value = "";
  finalPanel.classList.add("hidden");

  // new sample
  renderReference(pickSample());
  inputEl.disabled = false;
  if (autoFocus) inputEl.focus();
}

// Format seconds -> mm:ss
function formatTime(sec) {
  const s = Math.max(0, Math.floor(sec));
  const mm = Math.floor(s / 60);
  const ss = s % 60;
  return String(mm).padStart(2, "0") + ":" + String(ss).padStart(2, "0");
}

// Start timer
function startTest() {
  if (started) return;
  started = true;
  startTime = Date.now();
  // ensure duration updated from selector (in case changed)
  duration = parseInt(durationSelect.value, 10) || 60;
  remaining = duration;
  timeEl.textContent = formatTime(remaining);
  timer = setInterval(() => {
    const elapsed = (Date.now() - startTime) / 1000;
    const rem = Math.max(0, Math.round((duration - elapsed) * 10) / 10);
    remaining = rem;
    timeEl.textContent = formatTime(rem);
    // update live WPM/accuracy each tick
    updateLiveStats();
    if (rem <= 0) {
      endTest();
    }
  }, 100); // 100ms tick gives responsive UI without heavy CPU
}

// End test
function endTest() {
  clearInterval(timer);
  timer = null;
  started = false;
  inputEl.disabled = true;
  // final stats
  const minutes = (duration - remaining) / 60 || duration / 60;
  const finalWPM =
    Math.round(
      correctChars / 5 / ((duration - remaining) / 60 || duration / 60),
    ) || 0;
  const finalCPM =
    Math.round(correctChars / ((duration - remaining) / 60 || duration / 60)) ||
    0;
  const acc =
    typedChars > 0 ? Math.round((correctChars / typedChars) * 100) : 100;

  finalWpm.textContent = finalWPM;
  finalCpm.textContent = finalCPM;
  finalAcc.textContent = acc + "%";
  finalErr.textContent = errors;

  // show final panel
  finalPanel.classList.remove("hidden");

  // update live display once more
  updateStatsDisplay(finalWPM, finalCPM, acc, errors);
}

// Compute and display live stats
function updateLiveStats() {
  // elapsed = duration - remaining
  const elapsedSeconds = Math.max(0, duration - remaining);
  const minutes = Math.max(elapsedSeconds / 60, 1 / 60); // avoid division by zero early
  const liveWPM = Math.round(correctChars / 5 / minutes) || 0;
  const liveCPM = Math.round(correctChars / minutes) || 0;
  const acc =
    typedChars > 0 ? Math.round((correctChars / typedChars) * 100) : 100;
  updateStatsDisplay(liveWPM, liveCPM, acc, errors);
}

// Update stats UI
function updateStatsDisplay(wpm, cpm, acc, err) {
  wpmEl.textContent = wpm;
  cpmEl.textContent = cpm;
  accuracyEl.textContent = acc + "%";
  errorsEl.textContent = err;
}

// Handle typing input
inputEl.addEventListener("input", (e) => {
  const value = inputEl.value;
  // Auto-start on first real input
  if (!started && value.length > 0) {
    startTest();
  }

  // typedChars counts every character the user has typed (including corrections)
  // We'll approximate typedChars by the total length typed (including backspaces we cannot directly count),
  // so we track previous value length and difference.
  // A simple approach: increment typedChars by the number of characters added since last input.
  // If user deleted (new length < last length), we won't increment typedChars.
  if (value.length > lastInput.length) {
    typedChars += value.length - lastInput.length;
  }
  lastInput = value;

  // Compare each typed character with reference
  correctChars = 0;
  errors = 0;
  const spans = quoteEl.querySelectorAll(".char");
  for (let i = 0; i < spans.length; i++) {
    const ch = spans[i].textContent;
    const typed = value[i];
    spans[i].classList.remove("correct", "incorrect", "current");
    if (typed == null || typed === "") {
      // not typed yet
    } else if (typed === ch) {
      spans[i].classList.add("correct");
      correctChars++;
    } else {
      spans[i].classList.add("incorrect");
      errors++;
    }
  }
  // if user typed beyond length, count those as errors but do not render spans
  if (value.length > reference.length) {
    // extra chars typed
    const extra = value.length - reference.length;
    errors += extra;
    // typedChars already included them
  }

  // highlight current position (cursor)
  const pos = Math.min(value.length, reference.length - 1);
  highlightCurrent(pos + (value.length === 0 ? 0 : 0)); // simple highlight logic

  // update live stats
  updateLiveStats();
});

// Start / Restart / Try Again handlers
startBtn.addEventListener("click", () => {
  if (!started) {
    inputEl.focus();
    // If no typing yet, start immediately and don't clear typed input
    startTest();
  }
});
restartBtn.addEventListener("click", () => {
  resetTest(true);
});
tryAgainBtn.addEventListener("click", () => {
  resetTest(true);
});

// Accessibility: pressing Enter in textarea does not submit anything; we keep normal typing behavior

// Initial setup
resetTest(true);

// Optional: allow pressing Escape to reset quickly
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    resetTest(true);
  }
});
