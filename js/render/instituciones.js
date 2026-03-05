// ═══ RENDER — Instituciones ═══
function rInstituciones(c) {
  if (!DB.instituciones.length) {
    c.innerHTML = `<div class="sh"><div><h2>Instituciones</h2></div></div>
      ${emptyState(ICONS.institution, 'NO HAY INSTITUCIONES', 'No se encontraron instituciones documentadas en la base de datos.')}`;
    return;
  }
  c.innerHTML = `<div class="sh"><div><h2>Instituciones</h2>
    <p>Camaras, asociaciones y gremios — puentes de poder oligarquico</p></div></div>
    <div class="grid g2">${DB.instituciones.map(i => `
      <div class="card" onclick="nav('i-det',${i.id})" style="border-left:3px solid var(--grn)">
        <div class="pcard">${av(i.siglas||i.nombre,'#10b981',54)}
        <div class="pinfo"><div class="pname">${esc(i.nombre)}</div>
        <div class="psub">${esc(i.siglas||'')}</div>
        <div class="pdesc">${esc(i.descripcion||'')}</div></div></div>
      </div>`).join('')}</div>`;
}

function rIDet(c, id) {
  const inst = DB.instituciones.find(x => x.id === id); if (!inst) return;
  c.innerHTML = `<div class="pbk" onclick="nav('instituciones')">← Instituciones</div>
    <div class="phero" style="border-left:4px solid var(--grn)">
      ${av(inst.siglas||inst.nombre,'#10b981',84)}
      <div style="flex:1"><div class="phn">${esc(inst.nombre)}</div>
      <div class="psub">${esc(inst.siglas||'')}</div></div>
    </div>
    ${inst.descripcion?`<div class="ds"><h4>DESCRIPCION</h4><div class="df">${esc(inst.descripcion)}</div></div>`:''}`;
}
