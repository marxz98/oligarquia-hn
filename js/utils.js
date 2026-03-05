// ═══════════════════════════════════════════════════════════
// UTILS — Helper functions
// ═══════════════════════════════════════════════════════════

let GC = {};

function buildGC() {
  GC = {};
  DB.grupos.forEach(g => { if (g.color) GC[g.nombre] = g.color; });
}

function esc(s) { if (!s) return ''; const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }
function ini(name) { return (name||'?').split(' ').map(w => w[0]).join('').substring(0,2).toUpperCase(); }
function av(name, color, size) {
  const bg = color||'#4b5563'; size = size||50;
  return `<div class="av${size>60?' av-lg':''}" style="width:${size}px;height:${size}px;background:${bg}30;color:${bg};border:1px solid ${bg}40;font-size:${Math.round(size*0.32)}px">${ini(name)}</div>`;
}
function bHTML(p) {
  let h = '';
  if (p.estado === 'QDDG') h += '<span class="b b-qd">FALLECIDO</span>';
  if (p.estado === 'Indultado') h += '<span class="b b-nr">INDULTADO</span>';
  if (p.estado === 'Extraditado') h += '<span class="b b-al">EXTRADITADO</span>';
  if (p.alertasLegales) h += '<span class="b b-al">ALERTA</span>';
  if (p.golpe2009) h += '<span class="b b-gp">GOLPE 09</span>';
  if (p.esSocioPrincipal) h += '<span class="b b-sc">SOCIO PRINCIPAL</span>';
  return h ? `<div class="bx">${h}</div>` : '';
}
function nid(arr, key='id') { return Math.max(0, ...arr.map(x => typeof x[key]==='number' ? x[key] : 0)) + 1; }
function gv(id) { const e = document.getElementById(id); return e ? e.value.trim() : ''; }

function updCounts() {
  const s = (id,v) => { const e = document.getElementById(id); if (e) e.textContent = v; };
  s('c-p', DB.personas.length); s('c-g', DB.grupos.length); s('c-e', DB.empresas.length);
  s('c-pt', DB.partidos.length); s('c-m', DB.medios.length); s('c-c', DB.carteles.length);
  s('c-b', DB.bancos.length); s('c-i', DB.instituciones.length);
  s('c-z', DB.zedes.length); s('c-cj', DB.casos.length); s('c-inv', DB.investigaciones.length);
  s('ts-p', DB.personas.length); s('ts-e', DB.empresas.length);
  s('ts-n', DB.personas.filter(p => p.alertasLegales).length);
  s('ts-a', DB.personas.filter(p => p.alertasLegales).length);
}
