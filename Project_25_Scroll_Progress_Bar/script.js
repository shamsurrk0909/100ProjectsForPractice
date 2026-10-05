// Day 16 — Scroll Progress Bar
// Uses requestAnimationFrame for smooth updates and avoids heavy work on each scroll event.

// DOM elements
const progress = document.getElementById('scrollProgress');
const progressBar = document.getElementById('scrollProgressBar');

// Config: auto-hide when at top
const AUTO_HIDE_AT_TOP = true; // set false to always show bar

// internal state
let ticking = false; // rAF flag

function calculateScrollPercent() {
  const doc = document.documentElement;
  const body = document.body;

  // Total scrollable height = document height - viewport height
  const scrollTop = window.pageYOffset || doc.scrollTop || body.scrollTop || 0;
  const scrollHeight = Math.max(
    doc.scrollHeight || 0,
    body.scrollHeight || 0
  );
  const clientHeight = doc.clientHeight || window.innerHeight || 0;
  const scrollable = Math.max(0, scrollHeight - clientHeight);

  // avoid division by zero on short pages
  const fraction = scrollable === 0 ? 0 : (scrollTop / scrollable);
  const percent = Math.min(100, Math.max(0, fraction * 100));
  return { percent, scrollTop, scrollable };
}

function updateProgress() {
  ticking = false;
  const { percent, scrollTop } = calculateScrollPercent();

  // update bar width and aria attribute
  progressBar.style.width = percent + '%';
  progress.setAttribute('aria-valuenow', Math.round(percent));

  // auto-hide logic (optional): hide when at top (no scroll)
  if (AUTO_HIDE_AT_TOP) {
    if (scrollTop <= 2) {
      progress.classList.add('hidden');
    } else {
      progress.classList.remove('hidden');
    }
  }
}

// Scroll event handler — minimal work; schedule rAF if not already scheduled
function onScroll() {
  if (!ticking) {
    window.requestAnimationFrame(updateProgress);
    ticking = true;
  }
}

// Also update on resize since viewport height changes scrollable area
function onResize() {
  if (!ticking) {
    window.requestAnimationFrame(updateProgress);
    ticking = true;
  }
}

// initialize
function init() {
  // initial update (in case page loads scrolled or refreshed)
  updateProgress();

  // attach listeners
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize);
  // also update when content loads images or fonts change layout
  window.addEventListener('DOMContentLoaded', updateProgress);
  window.addEventListener('load', updateProgress);
}

init();
