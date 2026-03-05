// ═══ RENDER — Partidos ═══
function rPartidos(c) {
  c.innerHTML = `<div class="sh"><div><h2>Partidos Políticos</h2><p>Vínculos con la oligarquía</p></div></div>
    <div class="grid g2">${DB.partidos.map(p => `<div class="card" onclick="nav('pt-det','${p.id}')" style="border-left:3px solid ${p.color}40">
      <div class="pcard">${av(p.siglas,p.color,58)}<div class="pinfo"><div class="pname" style="color:${p.color}">${esc(p.nombre)}</div>
      <div class="psub">${esc(p.siglas)} · ${p.fundado} · ${esc(p.ideologia)}</div>
      <div class="pdesc">${esc(p.descripcion)}</div></div></div></div>`).join('')}</div>`;
}
function rPtDet(c, id) {
  const p = DB.partidos.find(x => x.id===id); if (!p) return;
  c.innerHTML = `<div class="pbk" onclick="nav('partidos')">← Partidos</div>
    <div class="phero" style="border-left:4px solid ${p.color}"><button class="ed-btn" style="right:90px" onclick="event.stopPropagation();showModal('addVinculo',{tipo:'partido',id:${p.id}})">+ VINCULO</button>${av(p.siglas,p.color,84)}
    <div style="flex:1"><div class="phn" style="color:${p.color}">${esc(p.nombre)}</div>
    <div class="psub">${esc(p.siglas)} · Fundado ${p.fundado}</div></div></div>
    <div class="ds"><h4>DESCRIPCION</h4><div class="df">${esc(p.descripcion)}</div></div>
    ${renderVinculos('partido', p.id)}`;
}
