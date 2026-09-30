// Day 12 — QR Code Generator using QRServer API and fetch()
// No API key required for QRServer. Example endpoint:
// https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=Hello&ecc=M&margin=2

// DOM
const inputText = document.getElementById('inputText');
const sizeInput = document.getElementById('size');
const marginInput = document.getElementById('margin');
const eccSelect = document.getElementById('ecc');

const generateBtn = document.getElementById('generateBtn');
const downloadBtn = document.getElementById('downloadBtn');
const openBtn = document.getElementById('openBtn');

const statusEl = document.getElementById('status');
const previewEl = document.getElementById('preview');

let currentObjectUrl = null; // track created object URL so we can revoke it

// Utility: build QRServer URL
function buildQrUrl({ data, size = 300, ecc = 'M', margin = 2 }) {
  const url = new URL('https://api.qrserver.com/v1/create-qr-code/');
  const px = Number(size) || 300;
  url.searchParams.set('size', `${px}x${px}`);
  url.searchParams.set('data', data || '');
  url.searchParams.set('ecc', ecc || 'M');
  url.searchParams.set('margin', String(margin || 0));
  // Optionally set format param if supported: url.searchParams.set('format','png');
  return url.toString();
}

// Show message
function setStatus(msg, isError = false) {
  statusEl.textContent = msg;
  statusEl.style.color = isError ? '#ffbaba' : '';
}

// Clean preview object URL
function revokeCurrentUrl() {
  if (currentObjectUrl) {
    URL.revokeObjectURL(currentObjectUrl);
    currentObjectUrl = null;
  }
  previewEl.innerHTML = '';
  downloadBtn.disabled = true;
  openBtn.disabled = true;
}

// Fetch QR image as blob and show preview
async function generateQr() {
  const data = inputText.value.trim();
  if (!data) {
    setStatus('Please enter text or URL to generate a QR code.', true);
    return;
  }

  const size = Math.max(100, Math.min(2000, Number(sizeInput.value) || 300));
  const margin = Math.max(0, Math.min(10, Number(marginInput.value) || 2));
  const ecc = eccSelect.value || 'M';

  const url = buildQrUrl({ data, size, ecc, margin });

  setStatus('Generating QR…');
  revokeCurrentUrl();

  try {
    // Fetch the image as a blob so we can offer download and open in tab
    const resp = await fetch(url, { cache: 'no-cache' });
    if (!resp.ok) throw new Error(`Network error ${resp.status}`);

    const blob = await resp.blob();
    // Defensive: ensure it is an image
    if (!blob.type.startsWith('image/')) {
      throw new Error('Invalid response (not an image).');
    }

    // Create object URL and show it
    currentObjectUrl = URL.createObjectURL(blob);
    const img = document.createElement('img');
    img.src = currentObjectUrl;
    img.alt = 'Generated QR code';
    img.onload = () => {
      setStatus('QR generated. You can download or open it in a new tab.');
    };
    img.onerror = () => {
      setStatus('Failed to load generated image.', true);
    };

    previewEl.appendChild(img);
    downloadBtn.disabled = false;
    openBtn.disabled = false;
  } catch (err) {
    console.error(err);
    setStatus('Failed to generate QR code. Try again.', true);
  }
}

// Download current image (as .png)
function downloadCurrentImage() {
  if (!currentObjectUrl) return;
  const link = document.createElement('a');
  link.href = currentObjectUrl;
  // create a filename from input (sanitize)
  const safe = inputText.value.trim().replace(/[^a-z0-9\-_.]/gi, '_').slice(0, 40) || 'qr';
  link.download = `${safe}.png`;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

// Open in new tab
function openInNewTab() {
  if (!currentObjectUrl) return;
  window.open(currentObjectUrl, '_blank');
}

// Events
generateBtn.addEventListener('click', (e) => {
  e.preventDefault();
  generateQr();
});

downloadBtn.addEventListener('click', (e) => {
  e.preventDefault();
  downloadCurrentImage();
});

openBtn.addEventListener('click', (e) => {
  e.preventDefault();
  openInNewTab();
});

// Convenience: generate on Ctrl+Enter
inputText.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
    e.preventDefault();
    generateQr();
  }
});

// Cleanup on unload
window.addEventListener('beforeunload', () => {
  revokeCurrentUrl();
});
