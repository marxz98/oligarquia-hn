// ═══════════════════════════════════════════════════════════
// APP — Navigation, state management, initialization
// ═══════════════════════════════════════════════════════════

let page = 'dashboard';
let filt = 'todos';
let sim = null; // D3 simulation reference

/** Navigate to a page with optional data */
function nav(pg, dt) {
  page = pg;

  // Update active sidebar item
  document.querySelectorAll('.sb-item').forEach(el =>
    el.classList.toggle('active', el.dataset.pg === pg)
  );
  document.querySelector('.sidebar').classList.remove('open');

  const c = document.getElementById('content');
  if (sim) { sim.stop(); sim = null; }
  c.scrollTop = 0;

  // Route to render function
  const routes = {
    dashboard: rDash,
    red:       rNet,
    personas:  rPersonas,
    grupos:    rGrupos,
    empresas:  rEmpresas,
    partidos:  rPartidos,
    medios:    rMedios,
    carteles:  rCarteles,
    'p-det':   rPDet,
    'g-det':   rGDet,
    'e-det':   rEDet,
    'pt-det':  rPtDet,
    'm-det':   rMDet,
    'c-det':   rCDet
  };

  if (routes[pg]) routes[pg](c, dt);
}

/** Handle search input */
function doSearch() {
  nav(page);
}

/** Set filter for personas view */
function setFilt(f) {
  filt = f;
  document.querySelectorAll('.pill').forEach(p =>
    p.classList.toggle('on', p.dataset.t === f)
  );
  if (page === 'personas') nav('personas');
}

/** App initialization */
window.addEventListener('DOMContentLoaded', () => {
  // Init theme
  initTheme();

  // Setup sidebar navigation
  document.querySelectorAll('.sb-item').forEach(el =>
    el.addEventListener('click', () => nav(el.dataset.pg))
  );

  // Setup modal close on background click
  document.getElementById('modal').addEventListener('click', e => {
    if (e.target.id === 'modal') closeModal();
  });

  // Update counts and render dashboard
  updCounts();
  nav('dashboard');
});

/** Rebuild network on resize */
window.addEventListener('resize', () => {
  if (page === 'red') bNet();
});
