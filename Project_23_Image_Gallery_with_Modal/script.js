// Day 14 — Image Gallery with Modal
// Concepts: DOM traversal, event delegation, keyboard events, focus management

// --- Sample image data ---
// Replace these with your own image URLs and captions.
// Use full-size 'src' and thumbnail 'thumb' when you have separate assets.
// For demo, thumbs are same as src (you can scale in CSS).
const IMAGES = [
  { src: 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?q=80&w=1600&auto=format&fit=crop', thumb: '', title: 'Mountain sunrise' },
  { src: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1600&auto=format&fit=crop', thumb: '', title: 'Forest path' },
  { src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1600&auto=format&fit=crop', thumb: '', title: 'Ocean waves' },
  { src: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop', thumb: '', title: 'City skyline' },
  { src: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80&w=1600&auto=format&fit=crop', thumb: '', title: 'Desert dunes' },
  { src: 'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?q=80&w=1600&auto=format&fit=crop', thumb: '', title: 'Coffee cup' },
  { src: 'https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?q=80&w=1600&auto=format&fit=crop', thumb: '', title: 'Night stars' },
  { src: 'https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?q=80&w=1600&auto=format&fit=crop', thumb: '', title: 'Green leaves' }
];
// If thumb is empty, we'll use scaled src (css handles cropping)

// --- DOM references ---
const galleryEl = document.getElementById('gallery');
const lightbox = document.getElementById('lightbox');
const lbImage = document.getElementById('lbImage');
const lbCaption = document.getElementById('lbTitle');
const lbCloseBtn = document.querySelector('.lb-close');
const lbPrevBtn = document.querySelector('.lb-prev');
const lbNextBtn = document.querySelector('.lb-next');
const lbOverlay = document.querySelector('.lightbox-overlay');

let currentIndex = -1;
let lastFocusedEl = null;

// --- Render gallery thumbnails ---
function renderGallery() {
  galleryEl.innerHTML = '';
  IMAGES.forEach((img, i) => {
    const a = document.createElement('button'); // use button for accessibility; behaves like a focusable element
    a.className = 'thumb';
    a.type = 'button';
    a.dataset.index = i;
    a.setAttribute('aria-label', `${img.title} — Open image`);
    // create image element
    const imageEl = document.createElement('img');
    imageEl.src = img.thumb || img.src;
    imageEl.alt = img.title || `Image ${i+1}`;
    imageEl.loading = 'lazy';
    // caption overlay
    const caption = document.createElement('div');
    caption.className = 'caption';
    caption.innerHTML = `<span>${img.title || ''}</span><span style="opacity:.85;font-size:12px">View</span>`;
    a.appendChild(imageEl);
    a.appendChild(caption);
    galleryEl.appendChild(a);
  });
}
renderGallery();

// --- Event delegation for gallery clicks ---
galleryEl.addEventListener('click', (ev) => {
  // find closest .thumb button
  const thumb = ev.target.closest('.thumb');
  if (!thumb) return;
  const idx = Number(thumb.dataset.index);
  openLightbox(idx);
});

// keyboard activation (Enter/Space) on focused thumbnail
galleryEl.addEventListener('keydown', (ev) => {
  const el = ev.target;
  if (el.classList && el.classList.contains('thumb') && (ev.key === 'Enter' || ev.key === ' ')) {
    ev.preventDefault();
    openLightbox(Number(el.dataset.index));
  }
});

// --- Lightbox controls ---
function openLightbox(index) {
  if (index < 0 || index >= IMAGES.length) return;
  currentIndex = index;
  lastFocusedEl = document.activeElement;
  // populate image and caption
  const data = IMAGES[index];
  showImageInLightbox(data);
  // show modal
  lightbox.setAttribute('aria-hidden', 'false');
  // lock scroll on body
  document.body.style.overflow = 'hidden';
  // focus the lightbox for keyboard handling
  lightbox.focus();
  // update buttons aria
  updateNavButtons();
  // preload neighbors
  preloadNeighborImages(index);
}

function closeLightbox() {
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  // clear image src to free memory
  lbImage.src = '';
  currentIndex = -1;
  // restore focus
  if (lastFocusedEl && typeof lastFocusedEl.focus === 'function') lastFocusedEl.focus();
}

// display image
function showImageInLightbox(data) {
  lbImage.src = data.src;
  lbImage.alt = data.title || '';
  lbCaption.textContent = data.title || '';
  // handle load errors gracefully
  lbImage.onerror = () => {
    lbImage.alt = 'Failed to load image';
    lbCaption.textContent = 'Failed to load image';
  };
}

// navigation
function showNext() {
  if (currentIndex < IMAGES.length - 1) {
    currentIndex++;
    showImageInLightbox(IMAGES[currentIndex]);
    updateNavButtons();
    preloadNeighborImages(currentIndex);
  }
}
function showPrev() {
  if (currentIndex > 0) {
    currentIndex--;
    showImageInLightbox(IMAGES[currentIndex]);
    updateNavButtons();
    preloadNeighborImages(currentIndex);
  }
}
function updateNavButtons() {
  lbPrevBtn.disabled = currentIndex <= 0;
  lbNextBtn.disabled = currentIndex >= IMAGES.length - 1;
}

// preload neighbors for smooth nav
function preloadNeighborImages(idx) {
  [idx - 1, idx + 1].forEach(i => {
    if (i >= 0 && i < IMAGES.length) {
      const img = new Image();
      img.src = IMAGES[i].src;
    }
  });
}

// --- Event listeners for lightbox actions ---
lbCloseBtn.addEventListener('click', closeLightbox);
lbPrevBtn.addEventListener('click', showPrev);
lbNextBtn.addEventListener('click', showNext);

// clicking overlay closes
lbOverlay.addEventListener('click', (ev) => {
  if (ev.target.dataset.action === 'close' || ev.currentTarget) closeLightbox();
});

// keyboard handling while lightbox open
document.addEventListener('keydown', (ev) => {
  if (lightbox.getAttribute('aria-hidden') === 'true') return;
  if (ev.key === 'Escape') {
    ev.preventDefault();
    closeLightbox();
  } else if (ev.key === 'ArrowRight') {
    ev.preventDefault();
    showNext();
  } else if (ev.key === 'ArrowLeft') {
    ev.preventDefault();
    showPrev();
  } else if (ev.key === 'Tab') {
    // basic focus trap: keep focus within lightbox-panel controls
    const focusable = Array.from(lightbox.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'))
      .filter(n => !n.hasAttribute('disabled'));
    if (focusable.length === 0) {
      ev.preventDefault();
      return;
    }
    const idx = focusable.indexOf(document.activeElement);
    if (ev.shiftKey) {
      // backward
      if (idx === 0) {
        ev.preventDefault();
        focusable[focusable.length - 1].focus();
      }
    } else {
      // forward
      if (idx === focusable.length - 1) {
        ev.preventDefault();
        focusable[0].focus();
      }
    }
  }
});

// close on focus loss (optional): when clicking outside is already handled via overlay

// Accessibility: close on backdrop click or pressing close

// --- Optional: support swipe gestures on touch devices for next/prev ---
let touchStartX = 0;
let touchEndX = 0;
const threshold = 40; // minimal px to consider swipe
const panel = document.querySelector('.lightbox-panel');

panel.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].screenX;
}, {passive:true});

panel.addEventListener('touchend', (e) => {
  touchEndX = e.changedTouches[0].screenX;
  const dx = touchEndX - touchStartX;
  if (Math.abs(dx) > threshold) {
    if (dx < 0) showNext(); else showPrev();
  }
}, {passive:true});

// --- small enhancement: allow arrow hovering on large screens with click targets (handled by buttons) ---

// --- End of script ---
