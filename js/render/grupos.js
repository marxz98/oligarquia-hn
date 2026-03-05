// ═══ RENDER — Grupos ═══
function rGrupos(c) {
  c.innerHTML = `<div class="sh"><div><h2>Grupos Familiares / Economicos</h2><p>${DB.grupos.length} grupos</p></div>
    <button class="add-btn" onclick="showModal('addGrupo')">+ NUEVO GRUPO</button></div>
    <div class="grid g2">${DB.grupos.filter(g=>g.nombre!=='OTROS').map(g => {const co=GC[g.nombre]||'#6b7280';const ms=DB.personas.filter(p=>p.grupoId===g.id);const es=DB.empresas.filter(e=>e.grupoId===g.id);
      return `<div class="card" onclick="nav('g-det','${g.nombre}')" style="border-left:3px solid ${co}40">
      <button class="ed-btn" onclick="event.stopPropagation();showModal('editGrupo','${g.nombre}')">✏ EDITAR</button>
      <div class="pcard">${av(g.nombre,co,58)}<div class="pinfo"><div class="pname" style="color:${co}">${esc(g.nombre)}</div>
      <div style="display:flex;gap:10px;font-size:10px;color:var(--t3);margin-top:3px">
        <span><strong style="color:var(--t1)">${ms.length}</strong> personas</span><span><strong style="color:var(--t1)">${es.length}</strong> empresas</span>
      </div>
      ${g.rankingPoder?`<div style="font-size:9px;color:var(--amb);margin-top:3px">${ICONS.star} Ranking #${g.rankingPoder} · ${esc(g.actividadPrincipal||'')}</div>`:''}
      ${g.origenCapital==='Internacional'?`<div style="font-size:9px;color:var(--cyan);margin-top:2px">${ICONS.globe} ${esc(g.paisOrigen||'Internacional')}</div>`:''}
      <div class="pdesc" style="margin-top:4px">${esc(g.descripcion||'')}</div></div></div></div>`}).join('')}</div>`;
}
function rGDet(c, nombre) {
  const g = DB.grupos.find(x => x.nombre===nombre); if (!g) return;
  const co = GC[nombre]||'#6b7280'; const ms = DB.personas.filter(p => p.grupoId===g.id);
  const es = DB.empresas.filter(e => e.grupoId===g.id); const meds = DB.medios.filter(m => m.grupoId===g.id);
  c.innerHTML = `<div class="pbk" onclick="nav('grupos')">← Grupos</div>
    <div class="phero" style="border-left:4px solid ${co}"><button class="ed-btn" style="right:90px" onclick="event.stopPropagation();showModal('addVinculo',{tipo:'grupo',id:${g.id}})">+ VINCULO</button><button class="ed-btn" onclick="showModal('editGrupo','${nombre}')">✏ EDITAR</button>
    ${av(nombre,co,84)}<div style="flex:1"><div class="phn" style="color:${co}">${esc(nombre)}</div>
    <div class="psub">${ms.length} personas · ${es.length} empresas${g.origenCapital==='Internacional'?' · '+ICONS.globe+' '+esc(g.paisOrigen||''):''}</div>
    ${g.rankingPoder?`<div style="font-size:11px;color:var(--amb);margin-top:4px">${ICONS.star} Ranking SAR #${g.rankingPoder} · Calificacion: ${g.calificacion||'N/A'} puntos</div>`:''}
    ${g.totalActivos?`<div style="font-size:11px;color:var(--t2);margin-top:2px">${ICONS.money} Activos: L${(g.totalActivos/1000000).toLocaleString()}M (${g.pctPib}% del PIB) · ${(g.empleadosIhss||0).toLocaleString()} empleados IHSS</div>`:''}
    </div></div>
    ${g.descripcion?`<div class="ds"><h4>DESCRIPCION</h4><div class="df">${esc(g.descripcion)}</div></div>`:''}
    ${g.ejesAcumulacion?`<div class="ds"><h4>EJES DE ACUMULACION</h4><div class="df wa">${esc(g.ejesAcumulacion)}</div></div>`:''}
    ${renderVinculos('grupo', g.id)}
    <div class="sh"><h4 style="font-size:10px;color:var(--red);letter-spacing:2px">INTEGRANTES (${ms.length})</h4>
      <button class="add-btn" onclick="showModal('addPersona','${nombre}')">+ AÑADIR PERSONA</button></div>
    <div class="grid g3">${ms.map(p => `<div class="card" onclick="nav('p-det',${p.id})">
      <button class="ed-btn" onclick="event.stopPropagation();showModal('editPersona',${p.id})">✏</button>
      <div class="pcard">${av(p.nombre,co,42)}<div class="pinfo"><div class="pname">${esc(p.nombre)}</div>
      <div class="psub">${esc(p.rol||'')}</div>${bHTML(p)}</div></div></div>`).join('')}</div>
    ${es.length?`<div class="ds" style="margin-top:14px"><h4>EMPRESAS (${es.length})</h4>
      <button class="add-btn" style="margin-bottom:8px" onclick="showModal('addEmpresa','${nombre}')">+ AÑADIR EMPRESA</button>
      <div class="grid g3">${es.map(e => `<div class="card" onclick="nav('e-det',${e.id})">
        <div class="pname">${esc(e.nombre)}</div><div class="psub">${esc(e.actividadEconomica||'')}</div>
        ${e.anioConstitucion?`<div style="font-size:8px;color:var(--t4)">Fundada ${e.anioConstitucion}</div>`:''}</div>`).join('')}</div></div>`:''}
    ${meds.length?`<div class="ds" style="margin-top:14px"><h4>MEDIOS (${meds.length})</h4><div class="grid g3">${meds.map(m =>
      `<div class="card" onclick="nav('m-det',${m.id})"><div class="pname">${esc(m.nombre)}</div><div class="psub">${esc(m.canal||'')}</div></div>`).join('')}</div></div>`:''}`;
}
