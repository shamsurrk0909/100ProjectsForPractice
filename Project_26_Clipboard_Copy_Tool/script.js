// Day 17 — Clipboard Copy Tool
// Uses navigator.clipboard when available, with document.execCommand fallback.

// DOM
const statusEl = document.getElementById('status');
const copyButtons = Array.from(document.querySelectorAll('.copy-btn'));
const copyAllBtn = document.getElementById('copyAll');

// Helper: read text from an element (input/textarea/code/block)
function readTextFromTarget(selectorOrEl) {
  const el = typeof selectorOrEl === 'string' ? document.querySelector(selectorOrEl) : selectorOrEl;
  if (!el) return '';
  // inputs & textareas
  if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') return el.value;
  // code / pre / div — use textContent
  return el.textContent || el.innerText || '';
}

// Primary copy function using clipboard API with fallback
async function copyText(text) {
  if (!text && text !== '') {
    return { ok: false, message: 'Nothing to copy' };
  }

  // Try modern API first
  if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    try {
      await navigator.clipboard.writeText(text);
      return { ok: true };
    } catch (err) {
      // fallthrough to fallback
      console.warn('Clipboard API failed, falling back to legacy method', err);
    }
  }

  // Fallback approach: create a temporary textarea, select, execCommand
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    // avoid flash on screen
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    ta.style.top = '0';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();

    const successful = document.execCommand('copy');
    document.body.removeChild(ta);
    if (successful) return { ok: true };
    return { ok: false, message: 'Copy command unsuccessful' };
  } catch (err) {
    console.error('Fallback copy failed', err);
    return { ok: false, message: err && err.message ? err.message : 'Copy failed' };
  }
}

// UI feedback helper
function showStatus(msg, success = true) {
  statusEl.textContent = msg;
  statusEl.style.color = success ? '' : '#ffbaba';
}

// Button feedback: temporary change text + class
function indicateButtonCopied(btn) {
  const original = btn.textContent;
  btn.classList.add('copied');
  btn.textContent = 'Copied!';
  setTimeout(() => {
    btn.classList.remove('copied');
    btn.textContent = original;
  }, 1200);
}

// Attach per-button handlers
copyButtons.forEach(btn => {
  btn.addEventListener('click', async (e) => {
    e.preventDefault();
    const target = btn.dataset.copyTarget;
    if (!target) {
      showStatus('No target found to copy.', false);
      return;
    }
    const text = readTextFromTarget(target);
    if (!text) {
      showStatus('Nothing to copy.', false);
      return;
    }
    const res = await copyText(text);
    if (res.ok) {
      indicateButtonCopied(btn);
      showStatus('Copied to clipboard.');
    } else {
      showStatus('Copy failed: ' + (res.message || 'unknown error'), false);
    }
  });
});

// Copy all fields example: combines shortText + email + message + code
copyAllBtn.addEventListener('click', async (e) => {
  e.preventDefault();
  const parts = [];
  const shortText = readTextFromTarget('#shortText');
  const email = readTextFromTarget('#email');
  const message = readTextFromTarget('#message');
  const code = readTextFromTarget('#codeBlock');

  if (shortText) parts.push(shortText);
  if (email) parts.push(email);
  if (message) parts.push(message);
  if (code) parts.push('Code:\n' + code);

  const combined = parts.join('\n\n');
  if (!combined) {
    showStatus('Nothing to copy.', false);
    return;
  }

  const res = await copyText(combined);
  if (res.ok) {
    showStatus('All fields copied to clipboard.');
    // visual feedback on the copyAll button
    copyAllBtn.textContent = 'Copied!';
    setTimeout(() => (copyAllBtn.textContent = 'Copy All Fields'), 1200);
  } else {
    showStatus('Copy failed: ' + (res.message || 'unknown error'), false);
  }
});

// Accessibility: allow Enter/Space to trigger copy when button focused (native)
copyButtons.forEach(b => {
  b.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      b.click();
    }
  });
});

// Optional: show support notice if Clipboard API not available
(function checkSupport(){
  if (!navigator.clipboard || typeof navigator.clipboard.writeText !== 'function') {
    showStatus('Clipboard API unavailable — using fallback copy method.');
  }
})();
