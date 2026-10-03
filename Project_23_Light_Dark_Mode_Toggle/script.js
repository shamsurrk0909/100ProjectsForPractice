// Day 15: Light/Dark Mode Toggle
// Uses data-theme attribute + LocalStorage

const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');

// Load saved theme from LocalStorage
const savedTheme = localStorage.getItem('theme');

if (savedTheme) {
  document.documentElement.setAttribute('data-theme', savedTheme);
  themeIcon.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
}

// Toggle theme
themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const newTheme = current === 'dark' ? 'light' : 'dark';

  // Apply new theme
  document.documentElement.setAttribute('data-theme', newTheme);

  // Save in LocalStorage
  localStorage.setItem('theme', newTheme);

  // Update icon
  themeIcon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
});
