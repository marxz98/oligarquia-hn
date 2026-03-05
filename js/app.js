// ═══════════════════════════════════════════════════════════
// APP — Navigation, state, initialization
// ═══════════════════════════════════════════════════════════

let page = 'dashboard', filt = 'todos', sim = null;

function nav(pg, dt) {
  page = pg;
  document.querySelectorAll('.sb-item').forEach(el => el.classList.toggle('active', el.dataset.pg === pg));
  document.querySelector('.sidebar').classList.remove('open');
  const c = document.getElementById('content');
  if (sim) { sim.stop(); sim = null; }
  c.scrollTop = 0;
  const R = { dashboard:rDash, red:rNet, personas:rPersonas, grupos:rGrupos, empresas:rEmpresas,
    partidos:rPartidos, medios:rMedios, carteles:rCarteles,
    'p-det':rPDet, 'g-det':rGDet, 'e-det':rEDet, 'pt-det':rPtDet, 'm-det':rMDet, 'c-det':rCDet };
  if (R[pg]) R[pg](c, dt);
}
function doSearch() { nav(page); }
function setFilt(f) { filt = f; document.querySelectorAll('.pill').forEach(p => p.classList.toggle('on', p.dataset.t === f)); if (page === 'personas') nav('personas'); }

function showLoading() {
  document.getElementById('content').innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:60vh;flex-direction:column;gap:12px">
    <div style="font-size:32px;animation:pulse 1.5s infinite">◉</div>
    <div style="font-family:var(--fd);font-size:12px;color:var(--t3);letter-spacing:2px">CARGANDO DATOS...</div>
  </div><style>@keyframes pulse{0%,100%{opacity:.3}50%{opacity:1}}</style>`;
}
function showError(msg) {
  document.getElementById('content').innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:60vh;flex-direction:column;gap:12px">
    <div style="font-size:32px">⚠</div>
    <div style="font-family:var(--fd);font-size:12px;color:var(--red);letter-spacing:2px">ERROR DE CONEXIÓN</div>
    <div style="font-size:11px;color:var(--t3);max-width:400px;text-align:center">${msg}</div>
    <button class="sbm" style="width:auto;padding:10px 24px;margin-top:8px" onclick="initApp()">REINTENTAR</button></div>`;
}

async function initApp() {
  showLoading();
  const ok = await loadAllData();
  if (!ok) { showError('No se pudo conectar con Supabase.'); return; }
  buildGC();
  await checkSession();
  updCounts();
  nav('dashboard');
}

window.addEventListener('DOMContentLoaded', () => {
  initTheme();
  document.querySelectorAll('.sb-item').forEach(el => el.addEventListener('click', () => nav(el.dataset.pg)));
  document.getElementById('modal').addEventListener('click', e => { if (e.target.id === 'modal') closeModal(); });
  initApp();
});
window.addEventListener('resize', () => { if (page === 'red') bNet(); });
