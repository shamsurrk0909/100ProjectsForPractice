// Day 20 — Music Player App
// Concepts: Audio element control, events, progress seek, playlist, shuffle/repeat

// Playlist — free royalty-free MP3 URLs (Bensound) + sample covers from picsum
const TRACKS = [
  {
    src: "https://www.bensound.com/bensound-music/bensound-acousticbreeze.mp3",
    title: "Acoustic Breeze",
    artist: "Bensound",
    cover: "https://picsum.photos/seed/acoustic/400/400"
  },
  {
    src: "https://www.bensound.com/bensound-music/bensound-creativeminds.mp3",
    title: "Creative Minds",
    artist: "Bensound",
    cover: "https://picsum.photos/seed/creative/400/400"
  },
  {
    src: "https://www.bensound.com/bensound-music/bensound-betterdays.mp3",
    title: "Better Days",
    artist: "Bensound",
    cover: "https://picsum.photos/seed/better/400/400"
  },
  {
    src: "https://www.bensound.com/bensound-music/bensound-goinghigher.mp3",
    title: "Going Higher",
    artist: "Bensound",
    cover: "https://picsum.photos/seed/higher/400/400"
  },
  {
    src: "https://www.bensound.com/bensound-music/bensound-sunny.mp3",
    title: "Sunny",
    artist: "Bensound",
    cover: "https://picsum.photos/seed/sunny/400/400"
  }
];

// DOM refs
const audio = document.getElementById('audio');
const coverEl = document.getElementById('cover');
const trackTitleEl = document.getElementById('trackTitle');
const trackArtistEl = document.getElementById('trackArtist');

const playPauseBtn = document.getElementById('playPauseBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const progressContainer = document.getElementById('progressContainer');
const progressEl = document.getElementById('progress');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');

const volumeInput = document.getElementById('volume');
const muteBtn = document.getElementById('muteBtn');

const playlistList = document.getElementById('playlistList');
const shuffleBtn = document.getElementById('shuffleBtn');
const repeatBtn = document.getElementById('repeatBtn');

// Player state
let currentIndex = 0;
let isPlaying = false;
let isShuffle = false;
let repeatMode = 'off'; // off | one | all
let lastVolume = Number(volumeInput.value) || 0.8;

// Initialize playlist UI and audio
function init() {
  buildPlaylistUI();
  loadTrack(currentIndex);
  attachEvents();
  audio.volume = Number(volumeInput.value);
  updatePlayButton();
}

// Build playlist list items
function buildPlaylistUI() {
  playlistList.innerHTML = '';
  TRACKS.forEach((t, i) => {
    const li = document.createElement('li');
    li.dataset.index = i;
    li.innerHTML = `<div class="meta"><strong class="name">${t.title}</strong><div class="artist">${t.artist}</div></div>
                    <div class="time muted">—:—</div>`;
    if (i === currentIndex) li.classList.add('active');
    li.addEventListener('click', () => {
      loadTrack(i);
      play();
    });
    playlistList.appendChild(li);
  });
}

// Load a track by index (does not auto-play)
function loadTrack(index) {
  if (index < 0 || index >= TRACKS.length) return;
  currentIndex = index;
  const track = TRACKS[index];
  audio.src = track.src;
  coverEl.src = track.cover || 'https://picsum.photos/400';
  trackTitleEl.textContent = track.title;
  trackArtistEl.textContent = track.artist;
  Array.from(playlistList.children).forEach(li => li.classList.toggle('active', Number(li.dataset.index) === index));
  progressEl.style.width = '0%';
  currentTimeEl.textContent = '0:00';
  durationEl.textContent = '0:00';
  audio.load();
}

// Play / Pause helpers
function play() {
  audio.play().then(() => {
    isPlaying = true;
    updatePlayButton();
  }).catch(err => {
    console.error('Playback failed:', err);
  });
}
function pause() {
  audio.pause();
  isPlaying = false;
  updatePlayButton();
}
function togglePlay() {
  if (isPlaying) pause(); else play();
}
function updatePlayButton() {
  playPauseBtn.textContent = isPlaying ? '⏸' : '▶';
}

// Next / Prev
function nextTrack() {
  if (isShuffle) {
    let next;
    if (TRACKS.length === 1) next = 0;
    else {
      do { next = Math.floor(Math.random() * TRACKS.length); } while (next === currentIndex && TRACKS.length > 1);
    }
    loadTrack(next);
    play();
    return;
  }
  if (currentIndex < TRACKS.length - 1) {
    loadTrack(currentIndex + 1);
    play();
  } else {
    if (repeatMode === 'all') {
      loadTrack(0);
      play();
    } else {
      pause();
      audio.currentTime = 0;
    }
  }
}
function prevTrack() {
  if (audio.currentTime > 5) {
    audio.currentTime = 0;
    return;
  }
  if (currentIndex > 0) {
    loadTrack(currentIndex - 1);
    play();
  } else {
    audio.currentTime = 0;
  }
}

// Format seconds to mm:ss
function fmtTime(sec) {
  if (!isFinite(sec) || sec === 0) return '0:00';
  const s = Math.floor(sec % 60);
  const m = Math.floor(sec / 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

// Attach events
function attachEvents() {
  audio.addEventListener('loadedmetadata', () => {
    durationEl.textContent = fmtTime(audio.duration);
    const li = playlistList.querySelector(`li[data-index="${currentIndex}"]`);
    if (li) {
      const t = li.querySelector('.time');
      if (t) t.textContent = fmtTime(audio.duration);
    }
  });

  audio.addEventListener('timeupdate', () => {
    const pct = (audio.currentTime / audio.duration) * 100 || 0;
    progressEl.style.width = `${pct}%`;
    currentTimeEl.textContent = fmtTime(audio.currentTime);
  });

  audio.addEventListener('ended', () => {
    if (repeatMode === 'one') {
      audio.currentTime = 0;
      play();
    } else {
      nextTrack();
    }
  });

  playPauseBtn.addEventListener('click', togglePlay);
  prevBtn.addEventListener('click', prevTrack);
  nextBtn.addEventListener('click', nextTrack);

  // progress seek
  let isSeeking = false;
  function seekFromEvent(e) {
    const rect = progressContainer.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const pct = Math.max(0, Math.min(1, x / rect.width));
    audio.currentTime = pct * (audio.duration || 0);
  }
  progressContainer.addEventListener('click', (e) => seekFromEvent(e));
  progressContainer.addEventListener('pointerdown', (e) => {
    isSeeking = true;
    progressContainer.setPointerCapture(e.pointerId);
    seekFromEvent(e);
  });
  progressContainer.addEventListener('pointermove', (e) => {
    if (!isSeeking) return;
    seekFromEvent(e);
  });
  progressContainer.addEventListener('pointerup', (e) => {
    isSeeking = false;
    try { progressContainer.releasePointerCapture(e.pointerId); } catch(_) {}
  });
  progressContainer.addEventListener('pointercancel', () => isSeeking = false);

  // volume & mute
  volumeInput.addEventListener('input', () => {
    audio.volume = Number(volumeInput.value);
    if (audio.volume > 0) {
      muteBtn.textContent = '🔈';
      lastVolume = audio.volume;
    } else {
      muteBtn.textContent = '🔇';
    }
  });
  muteBtn.addEventListener('click', () => {
    if (audio.volume > 0) {
      lastVolume = audio.volume;
      audio.volume = 0;
      volumeInput.value = 0;
      muteBtn.textContent = '🔇';
    } else {
      audio.volume = lastVolume || 0.8;
      volumeInput.value = audio.volume;
      muteBtn.textContent = '🔈';
    }
  });

  // shuffle & repeat
  shuffleBtn.addEventListener('click', () => {
    isShuffle = !isShuffle;
    shuffleBtn.style.opacity = isShuffle ? '1' : '0.6';
  });
  repeatBtn.addEventListener('click', () => {
    if (repeatMode === 'off') repeatMode = 'one';
    else if (repeatMode === 'one') repeatMode = 'all';
    else repeatMode = 'off';
    repeatBtn.textContent = repeatMode === 'off' ? '🔁' : (repeatMode === 'one' ? '🔂' : '🔁');
    repeatBtn.style.opacity = repeatMode === 'off' ? '0.7' : '1';
  });

  // keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
      e.preventDefault();
      togglePlay();
    } else if (e.code === 'ArrowRight') {
      nextTrack();
    } else if (e.code === 'ArrowLeft') {
      prevTrack();
    }
  });

  audio.addEventListener('error', (e) => {
    console.error('Audio error', e);
    nextTrack();
  });
}

// initialize
init();
