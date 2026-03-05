// ═══ RENDER — Investigaciones Internacionales ═══
function rInvestigaciones(c) {
  if (!DB.investigaciones.length) {
    c.innerHTML = `<div class="sh"><div><h2>Investigaciones Internacionales</h2></div></div>
      ${emptyState(ICONS.search, 'NO HAY INVESTIGACIONES', 'No se encontraron investigaciones internacionales en la base de datos.')}`;
    return;
  }
  c.innerHTML = `<div class="sh"><div><h2>Investigaciones Internacionales</h2>
    <p>Archivos desclasificados y filtraciones que mencionan Honduras</p></div></div>
    <div class="grid g2">${DB.investigaciones.map(inv => `
      <div class="card" onclick="nav('inv-det',${inv.id})" style="border-left:3px solid var(--pur)">
        <div class="pcard">${av(inv.nombre,'#8b5cf6',58)}
        <div class="pinfo"><div class="pname" style="color:var(--pur)">${esc(inv.nombre)}</div>
        <div class="psub">${esc(inv.tipo||'')} · ${esc(inv.fuente||'')}</div>
        <div class="bx" style="margin-top:4px">
          <span class="b b-nr">${inv.menciones_honduras||0} MENCIONES HN</span>
          ${inv.fecha_publicacion?`<span class="b b-po">${esc(inv.fecha_publicacion)}</span>`:''}
        </div>
        <div class="pdesc" style="margin-top:4px">${esc(inv.resumen||'')}</div></div></div>
      </div>`).join('')}</div>`;
}

function rInvDet(c, id) {
  const inv = DB.investigaciones.find(x => x.id === id); if (!inv) return;
  c.innerHTML = `<div class="pbk" onclick="nav('investigaciones')">← Investigaciones</div>
    <div class="phero" style="border-left:4px solid var(--pur)">
      ${av(inv.nombre,'#8b5cf6',84)}
      <div style="flex:1"><div class="phn" style="color:var(--pur)">${esc(inv.nombre)}</div>
      <div class="psub">${esc(inv.tipo||'')} · ${esc(inv.fuente||'')}</div>
      <div class="bx" style="margin-top:6px">
        <span class="b b-nr">${inv.menciones_honduras||0} MENCIONES DE HONDURAS</span>
        ${inv.fecha_publicacion?`<span class="b b-po">Publicado: ${esc(inv.fecha_publicacion)}</span>`:''}
      </div></div>
    </div>
    ${inv.resumen?`<div class="ds"><h4>RESUMEN</h4><div class="df">${esc(inv.resumen)}</div></div>`:''}
    ${inv.datos_clave?`<div class="ds"><h4>${ICONS.search} DATOS CLAVE SOBRE HONDURAS</h4><div class="df dg">${esc(inv.datos_clave)}</div></div>`:''}
    ${inv.url_fuente?`<div class="ds"><h4>FUENTE ORIGINAL</h4><div class="df inf"><a href="${esc(inv.url_fuente)}" target="_blank" style="color:var(--blu);word-break:break-all">${esc(inv.url_fuente)}</a></div></div>`:''}
    ${inv.notas?`<div class="ds"><h4>NOTAS</h4><div class="df">${esc(inv.notas)}</div></div>`:''}`;
}
