// ═══════════════════════════════════════════════════════════
// THEME — Dark / Light mode toggle
// ═══════════════════════════════════════════════════════════

let isDark = true;

function toggleTheme() {
  isDark = !isDark;
  document.body.classList.toggle('light', !isDark);
  document.getElementById('theme-toggle').innerHTML = isDark ? ICONS.moon+' Modo Oscuro' : ICONS.sun+' Modo Claro';
  try { localStorage.setItem('theme', isDark ? 'dark' : 'light'); } catch (e) {}
}

function initTheme() {
  try {
    if (localStorage.getItem('theme') === 'light') {
      isDark = false;
      document.body.classList.add('light');
      document.getElementById('theme-toggle').innerHTML = ICONS.sun+' Modo Claro';
    }
  } catch (e) {}
}
