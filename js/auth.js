// ═══════════════════════════════════════════════════════════
// AUTH — Login / Logout
// ═══════════════════════════════════════════════════════════

let isAdmin = false;

function doLogin() {
  const user = document.getElementById('lu').value;
  const pass = document.getElementById('lp').value;

  if (user === 'admin' && pass === 'necios2026') {
    isAdmin = true;
    document.getElementById('app').classList.add('admin-mode');
    document.getElementById('bl').classList.add('hidden');
    document.getElementById('blo').classList.remove('hidden');
    closeModal();
    nav(page);
  } else {
    document.getElementById('lerr').classList.remove('hidden');
  }
}

function doLogout() {
  isAdmin = false;
  document.getElementById('app').classList.remove('admin-mode');
  document.getElementById('bl').classList.remove('hidden');
  document.getElementById('blo').classList.add('hidden');
  nav(page);
}
