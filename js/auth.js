// ═══════════════════════════════════════════════════════════
// AUTH — Login / Logout via Supabase
// ═══════════════════════════════════════════════════════════

let isAdmin = false;

async function doLogin() {
  const email = document.getElementById('lu').value.trim();
  const pass = document.getElementById('lp').value;
  const errEl = document.getElementById('lerr');
  if (!email || !pass) { errEl.textContent = 'Ingrese email y contraseña'; errEl.classList.remove('hidden'); return; }
  errEl.textContent = 'Verificando...'; errEl.classList.remove('hidden'); errEl.style.color = 'var(--t3)';
  const { data, error } = await sb.auth.signInWithPassword({ email, password: pass });
  if (error) { errEl.textContent = 'Credenciales incorrectas'; errEl.style.color = 'var(--red)'; return; }
  isAdmin = true;
  document.getElementById('app').classList.add('admin-mode');
  document.getElementById('bl').classList.add('hidden');
  document.getElementById('blo').classList.remove('hidden');
  closeModal(); nav(page);
}

async function doLogout() {
  await sb.auth.signOut();
  isAdmin = false;
  document.getElementById('app').classList.remove('admin-mode');
  document.getElementById('bl').classList.remove('hidden');
  document.getElementById('blo').classList.add('hidden');
  nav(page);
}

async function checkSession() {
  const { data: { session } } = await sb.auth.getSession();
  if (session) {
    isAdmin = true;
    document.getElementById('app').classList.add('admin-mode');
    document.getElementById('bl').classList.add('hidden');
    document.getElementById('blo').classList.remove('hidden');
  }
}
