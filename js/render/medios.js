// ═══ RENDER — Medios ═══
function rMedios(c) {
  c.innerHTML = `<div class="sh"><div><h2>Medios de Comunicación</h2><p>¿Quién controla la información?</p></div>
    <button class="add-btn" onclick="showModal('addMedio')">+ NUEVO MEDIO</button></div>
    <div class="grid g2">${DB.medios.map(m => {const cc=GC[m.grupoControlador]||'#06b6d4';
      return `<div class="card" onclick="nav('m-det',${m.id})" style="border-left:3px solid ${cc}40">
      <button class="ed-btn" onclick="event.stopPropagation();showModal('editMedio',${m.id})">✏</button>
      <div class="pcard">${av(m.nombre,cc,54)}<div class="pinfo"><div class="pname">${esc(m.nombre)}</div>
      <div class="psub">${esc(m.canal||'')}</div>
      <div style="font-size:9px;color:${cc};margin-top:3px">CONTROLADO POR: ${esc(m.grupoControlador||'Desconocido')}</div>
      <div class="pdesc">${esc(m.descripcion||'')}</div></div></div></div>`}).join('')}</div>`;
}
function rMDet(c, id) {
  const m = DB.medios.find(x => x.id===id); if (!m) return;
  const cc = GC[m.grupoControlador]||'#06b6d4';
  c.innerHTML = `<div class="pbk" onclick="nav('medios')">← Medios</div>
    <div class="phero" style="border-left:4px solid ${cc}"><button class="ed-btn" onclick="showModal('editMedio',${m.id})">✏ EDITAR</button>
    ${av(m.nombre,cc,84)}<div style="flex:1"><div class="phn">${esc(m.nombre)}</div>
    <div class="psub">${esc(m.canal||'')}</div>
    <div style="font-size:11px;color:${cc};margin-top:3px">GRUPO: ${esc(m.grupoControlador||'')}</div>
    ${m.fundador?`<div style="font-size:10px;color:var(--t3);margin-top:2px">Fundador: ${esc(m.fundador)}</div>`:''}</div></div>
    <div class="ds"><h4>DESCRIPCIÓN</h4><div class="df">${esc(m.descripcion||'')}</div></div>`;
}
