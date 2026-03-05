// ═══ RENDER — Casos Judiciales ═══
function rCasos(c) {
  const estadoColor = {'Indultado':'#f59e0b','Cumplida':'#10b981','En curso':'#3b82f6','Cooperantes DEA':'#8b5cf6','Sentenciado':'#ef4444','Profugo':'#dc2626'};
  if (!DB.casos.length) {
    c.innerHTML = `<div class="sh"><div><h2>Casos Judiciales</h2></div></div>
      ${emptyState(ICONS.scale, 'NO HAY CASOS DOCUMENTADOS', 'No se encontraron casos judiciales en la base de datos.')}`;
    return;
  }
  c.innerHTML = `<div class="sh"><div><h2>Casos Judiciales</h2>
    <p>${DB.casos.length} casos documentados — narcotrafico, lavado, ISDS</p></div></div>
    <div class="grid g2">${DB.casos.map(cj => {
      const ec = estadoColor[cj.estado]||'#6b7280';
      return `<div class="card" onclick="nav('cj-det',${cj.id})" style="border-left:3px solid ${ec}">
        <div class="pcard">${av(cj.nombre,ec,54)}
        <div class="pinfo"><div class="pname">${esc(cj.nombre)}</div>
        <div class="psub">${esc(cj.tribunal||'')} · ${esc(cj.pais||'')}</div>
        <div class="bx" style="margin-top:4px">
          <span class="b" style="background:${ec}15;color:${ec};border-color:${ec}30">${esc(cj.estado||'')}</span>
          ${cj.sentencia?`<span class="b" style="background:#ef444415;color:var(--red);border-color:#ef444430">${esc(cj.sentencia)}</span>`:''}
        </div>
        <div class="pdesc" style="margin-top:4px">${esc(cj.descripcion||'')}</div></div></div></div>`;
    }).join('')}</div>`;
}

function rCjDet(c, id) {
  const cj = DB.casos.find(x => x.id === id); if (!cj) return;
  const estadoColor = {'Indultado':'#f59e0b','Cumplida':'#10b981','En curso':'#3b82f6','Cooperantes DEA':'#8b5cf6','Sentenciado':'#ef4444'};
  const ec = estadoColor[cj.estado]||'#6b7280';
  c.innerHTML = `<div class="pbk" onclick="nav('casos')">← Casos Judiciales</div>
    <div class="phero" style="border-left:4px solid ${ec}">
      ${av(cj.nombre,ec,84)}
      <div style="flex:1"><div class="phn">${esc(cj.nombre)}</div>
      <div class="psub">${esc(cj.tribunal||'')} · ${esc(cj.pais||'')}</div>
      <div class="bx" style="margin-top:6px">
        <span class="b" style="background:${ec}15;color:${ec};border-color:${ec}30">${esc(cj.estado||'')}</span>
        ${cj.sentencia?`<span class="b b-al">${esc(cj.sentencia)}</span>`:''}
        ${cj.fecha_sentencia?`<span class="b b-po">${esc(cj.fecha_sentencia)}</span>`:''}
      </div></div>
    </div>
    ${cj.descripcion?`<div class="ds"><h4>DESCRIPCION</h4><div class="df al">${esc(cj.descripcion)}</div></div>`:''}
    ${cj.notas?`<div class="ds"><h4>${ICONS.alert} NOTAS IMPORTANTES</h4><div class="df wa">${esc(cj.notas)}</div></div>`:''}`;
}
