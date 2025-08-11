// theme.js
// Purpose: set initial theme without flash, wire up toggle, save preference

(function () {
  const STORAGE_KEY = 'preferred-theme';
  const root = document.documentElement;
  const toggle = () => {
    const current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next, true);
  };

  const applyTheme = (theme, save = false) => {
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
      document.getElementById('themeToggle')?.setAttribute('aria-pressed', 'true');
    } else {
      root.removeAttribute('data-theme');
      document.getElementById('themeToggle')?.setAttribute('aria-pressed', 'false');
    }
    if (save) localStorage.setItem(STORAGE_KEY, theme);
  };

  // Determine initial theme:
  // 1. user preference in localStorage
  // 2. otherwise OS preference via media query
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === 'dark' || saved === 'light') {
    applyTheme(saved, false);
  } else {
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(prefersDark ? 'dark' : 'light', false);
  }

  // Now that theme is applied, add a class to allow transitions.
  // This avoids transitions during initial paint.
  requestAnimationFrame(() => {
    root.classList.add('theme-ready');
  });

  // Wire toggle button
  const btn = document.getElementById('themeToggle');
  if (btn) {
    btn.addEventListener('click', () => toggle());
    btn.addEventListener('keyup', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle();
      }
    });
  }

  // Listen to OS-level changes if user hasn't explicitly chosen
  window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    const savedPref = localStorage.getItem(STORAGE_KEY);
    if (!savedPref) {
      applyTheme(e.matches ? 'dark' : 'light', false);
    }
  });

})();
