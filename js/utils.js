// ═══════════════════════════════════════════════════════════
// UTILS — Helper functions used across modules
// ═══════════════════════════════════════════════════════════

/** Group color map */
const GC = {
  'FERRARI-VILLEDA': '#60a5fa',
  'CANAHUATI-LARACH': '#34d399',
  'FACUSSÉ': '#fbbf24',
  'NASSER-SELMAN': '#fb923c',
  'ROSENTHAL': '#818cf8',
  'ATALA-ZABLAH': '#f472b6',
  'KAFATI-KAFFIE-LARACH': '#22d3ee',
  'BUESO-GOLDSTEIN': '#a78bfa',
  'WONG-ARÉVALO': '#4ade80',
  'PASTOR-MEJÍA': '#f87171',
  'MELARA-FACUSSÉ': '#e879f9',
  'FARAJ': '#fcd34d',
  'OTROS': '#6b7280'
};

/** HTML-escape a string */
function esc(s) {
  if (!s) return '';
  const d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}

/** Get initials from a name */
function ini(name) {
  return (name || '?').split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
}

/** Generate avatar HTML */
function av(name, color, size) {
  const bg = color || '#4b5563';
  size = size || 50;
  const fontSize = Math.round(size * 0.32);
  const cls = size > 60 ? 'av av-lg' : 'av';
  return `<div class="${cls}" style="width:${size}px;height:${size}px;background:${bg}30;color:${bg};border:1px solid ${bg}40;font-size:${fontSize}px">${ini(name)}</div>`;
}

/** Generate badges HTML for a person */
function bHTML(p) {
  let h = '';
  if (p.estado === 'QDDG') h += '<span class="b b-qd">FALLECIDO</span>';
  if (p.narcotrafico) h += '<span class="b b-nr">NARCO</span>';
  if (p.golpe2009) h += '<span class="b b-gp">GOLPE 09</span>';
  if (p.alertasLegales) h += '<span class="b b-al">ALERTA</span>';
  if (p.vinculoPolitico) h += `<span class="b b-po">${esc(p.partidoPolitico || 'POLÍTICO')}</span>`;
  return h ? `<div class="bx">${h}</div>` : '';
}

/** Get next available numeric ID from an array */
function nid(arr, key = 'id') {
  return Math.max(0, ...arr.map(x => typeof x[key] === 'number' ? x[key] : 0)) + 1;
}

/** Get value of a form field by ID */
function gv(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : '';
}

/** Generate <option> list for grupo selector */
function grupoOpts() {
  const all = [...new Set(
    DB.personas.map(p => p.grupo)
      .concat(DB.grupos.map(g => g.nombre))
      .filter(Boolean)
  )].sort();
  return ['', ...all].map(g =>
    `<option value="${esc(g)}">${esc(g || '— Seleccionar —')}</option>`
  ).join('');
}

/** Generate <option> list for partido selector */
function partidoOpts() {
  return ['', 'Partido Nacional', 'Partido Liberal', 'Partido Libre']
    .map(p => `<option value="${esc(p)}">${esc(p || '— Ninguno —')}</option>`)
    .join('');
}

/** Update all sidebar and topbar counts */
function updCounts() {
  const s = (id, v) => { const e = document.getElementById(id); if (e) e.textContent = v; };
  s('c-p', DB.personas.length);
  s('c-g', DB.grupos.length);
  s('c-e', DB.empresas.length);
  s('c-pt', DB.partidos.length);
  s('c-m', DB.medios.length);
  s('c-c', DB.carteles.length);
  s('ts-p', DB.personas.length);
  s('ts-e', DB.empresas.length);
  s('ts-n', DB.personas.filter(p => p.narcotrafico).length);
  s('ts-a', DB.personas.filter(p => p.alertasLegales).length);
}
