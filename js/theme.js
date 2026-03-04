// ═══════════════════════════════════════════════════════════
// THEME — Dark / Light mode toggle
// ═══════════════════════════════════════════════════════════

let isDark = true;

function toggleTheme() {
  isDark = !isDark;
  document.getElementById('app').classList.toggle('light', !isDark);
  document.getElementById('theme-toggle').innerHTML = isDark ? '🌙 Modo Oscuro' : '☀️ Modo Claro';
  try { localStorage.setItem('theme', isDark ? 'dark' : 'light'); } catch (e) {}
}

function initTheme() {
  try {
    if (localStorage.getItem('theme') === 'light') {
      isDark = false;
      document.getElementById('app').classList.add('light');
      document.getElementById('theme-toggle').innerHTML = '☀️ Modo Claro';
    }
  } catch (e) {}
}
