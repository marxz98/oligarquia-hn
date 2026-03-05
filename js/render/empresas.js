// ═══ RENDER — Empresas ═══
function rEmpresas(c) {
  const q = document.getElementById('search').value.toLowerCase();
  const ls = DB.empresas.filter(e => { if (!q) return true; return [e.nombre,e.razonSocial,e.grupoControlador,e.actividadEconomica].filter(Boolean).join(' ').toLowerCase().includes(q); });
  c.innerHTML = `<div class="sh"><div><h2>Empresas</h2><p>${ls.length} registros</p></div>
    <button class="add-btn" onclick="showModal('addEmpresa')">+ NUEVA EMPRESA</button></div>
    <div class="grid g3">${ls.map(e => {const cc=GC[e.grupoControlador]||'#f59e0b';
      return `<div class="card" onclick="nav('e-det',${e.id})">
      <button class="ed-btn" onclick="event.stopPropagation();showModal('editEmpresa',${e.id})">✏</button>
      <div class="pcard">${av(e.nombre,cc,48)}<div class="pinfo"><div class="pname">${esc(e.nombre)}</div>
      <div class="psub">${esc(e.actividadEconomica||'')}</div>
      <div style="font-size:9px;color:var(--t4);margin-top:3px">⚡ ${esc(e.grupoControlador||'Sin grupo')}</div></div></div></div>`}).join('')}</div>`;
}
function rEDet(c, id) {
  const e = DB.empresas.find(x => x.id===id); if (!e) return;
  const cc = GC[e.grupoControlador]||'#f59e0b';
  const rel = DB.personas.filter(p => p.grupoId===e.grupoId).slice(0,20);
  c.innerHTML = `<div class="pbk" onclick="nav('empresas')">← Empresas</div>
    <div class="phero"><button class="ed-btn" onclick="showModal('editEmpresa',${e.id})">✏ EDITAR</button>
    ${av(e.nombre,cc,84)}<div style="flex:1"><div class="phn">${esc(e.nombre)}</div>
    ${e.razonSocial?`<div style="font-size:10px;color:var(--t3);margin-top:2px">${esc(e.razonSocial)}</div>`:''}
    <div class="psub">${esc(e.actividadEconomica||'')} · ${esc(e.grupoControlador||'')}</div>
    ${e.anioConstitucion?`<div style="font-size:10px;color:var(--t4);margin-top:3px">Fundada en ${e.anioConstitucion}</div>`:''}</div></div>
    ${e.notas?`<div class="ds"><h4>NOTAS</h4><div class="df">${esc(e.notas)}</div></div>`:''}
    ${rel.length?`<div class="ds"><h4>PERSONAS DEL GRUPO (${rel.length})</h4><div class="grid g3">${rel.map(p =>
      `<div class="card" onclick="nav('p-det',${p.id})"><div class="pcard">${av(p.nombre,GC[p.grupo],42)}
      <div class="pinfo"><div class="pname">${esc(p.nombre)}</div><div class="psub">${esc(p.grupo||'')}</div></div></div></div>`).join('')}</div></div>`:''}`; 
}
