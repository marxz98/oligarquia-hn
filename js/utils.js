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

function renderVinculos(tipo, id) {
  const vincs = getVinculos(tipo, id);
  if (!vincs.length) return '';

  const grupos = {};
  vincs.forEach(v => {
    if (!grupos[v.tipo_vinculo]) grupos[v.tipo_vinculo] = [];
    grupos[v.tipo_vinculo].push(v);
  });

  const tipoLabels = {
    familiar: 'FAMILIARES', conyugal: 'VINCULOS CONYUGALES',
    societario: 'VINCULOS SOCIETARIOS', politico: 'VINCULOS POLITICOS',
    criminal: 'VINCULOS CRIMINALES', mediatico: 'VINCULOS MEDIATICOS',
    institucional: 'VINCULOS INSTITUCIONALES'
  };

  const tipoColors = {
    familiar: 'var(--pink)', conyugal: 'var(--pink)',
    societario: 'var(--amb)', politico: 'var(--blu)',
    criminal: 'var(--pur)', mediatico: 'var(--cyan)',
    institucional: 'var(--grn)'
  };

  let html = '';
  for (const [tipo_v, items] of Object.entries(grupos)) {
    const color = tipoColors[tipo_v] || 'var(--t3)';
    html += `<div class="ds"><h4 style="color:${color};border-color:${color}30">${ICONS.network} ${tipoLabels[tipo_v] || tipo_v.toUpperCase()}</h4>
      <div class="rgrid">${items.map(v => {
        const nombre = resolveVinculoNombre(v.entidadTipo, v.entidadId);
        return `<div class="ri" onclick="navToEntidad('${v.entidadTipo}',${v.entidadId})" style="border-left:2px solid ${color}40">
          <div style="font-size:12px;color:var(--t1)">${esc(nombre)}</div>
          <small style="color:${color}">${esc(v.relacion || v.subtipo || v.tipo_vinculo)}</small>
          ${v.notas ? `<small style="color:var(--t4);display:block;margin-top:2px">${esc(v.notas)}</small>` : ''}
          ${!v.es_confirmado ? `<small style="color:var(--amb)">${ICONS.alert} No confirmado</small>` : ''}
        </div>`;
      }).join('')}</div></div>`;
  }
  return html;
}

function updCounts() {
  const s = (id,v) => { const e = document.getElementById(id); if (e) e.textContent = v; };
  s('c-p', DB.personas.length); s('c-g', DB.grupos.length); s('c-e', DB.empresas.length);
  s('c-pt', DB.partidos.length); s('c-m', DB.medios.length); s('c-c', DB.carteles.length);
  s('c-b', DB.bancos.length); s('c-i', DB.instituciones.length);
  s('c-z', DB.zedes.length); s('c-cj', DB.casos.length); s('c-inv', DB.investigaciones.length);
}
