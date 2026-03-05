// ═══ RENDER — Bancos / Entidades Financieras ═══
function rBancos(c) {
  if (!DB.bancos.length) {
    c.innerHTML = `<div class="sh"><div><h2>Bancos / Entidades Financieras</h2></div></div>
      ${emptyState(ICONS.bank, 'NO HAY BANCOS DOCUMENTADOS', 'No se encontraron entidades financieras en la base de datos.')}`;
    return;
  }
  c.innerHTML = `<div class="sh"><div><h2>Bancos / Entidades Financieras</h2>
    <p>${DB.bancos.length} entidades — 3 familias controlan banca = 57% del PIB</p></div></div>
    <div class="grid g2">${DB.bancos.map(b => {
      const g = DB.grupos.find(x => x.id === b.grupo_id);
      const co = g ? GC[g.nombre]||'#f59e0b' : '#f59e0b';
      const gn = g ? g.nombre : '';
      return `<div class="card" onclick="nav('b-det',${b.id})" style="border-left:3px solid ${co}40">
        <div class="pcard">${av(b.nombre,co,54)}
        <div class="pinfo"><div class="pname">${esc(b.nombre)}</div>
        <div class="psub">${esc(gn)}</div>
        <div class="pdesc">${esc(b.descripcion||'')}</div></div></div></div>`;
    }).join('')}</div>`;
}

function rBDet(c, id) {
  const b = DB.bancos.find(x => x.id === id); if (!b) return;
  const g = DB.grupos.find(x => x.id === b.grupo_id);
  const co = g ? GC[g.nombre]||'#f59e0b' : '#f59e0b';
  const personas = g ? DB.personas.filter(p => p.grupoId === g.id) : [];
  c.innerHTML = `<div class="pbk" onclick="nav('bancos')">← Bancos</div>
    <div class="phero" style="border-left:4px solid ${co}"><button class="ed-btn" style="right:90px" onclick="event.stopPropagation();showModal('addVinculo',{tipo:'banco',id:${b.id}})">+ VINCULO</button>
      ${av(b.nombre,co,84)}
      <div style="flex:1"><div class="phn">${esc(b.nombre)}</div>
      ${g?`<div class="psub" style="color:${co}">Controlado por: ${esc(g.nombre)}</div>`:''}
      ${g&&g.totalActivos?`<div style="font-size:11px;color:var(--amb);margin-top:4px">${ICONS.money} Activos del grupo: L${(g.totalActivos/1000000).toLocaleString()}M (${g.pctPib}% PIB)</div>`:''}</div>
    </div>
    ${b.descripcion?`<div class="ds"><h4>DESCRIPCION</h4><div class="df">${esc(b.descripcion)}</div></div>`:''}
    ${renderVinculos('banco', b.id)}
    ${g?`<div class="ds"><h4>GRUPO CONTROLADOR</h4><div class="card" onclick="nav('g-det','${g.nombre}')" style="border-left:2px solid ${co}40">
      <div style="font-family:var(--fd);font-size:13px;color:${co}">${esc(g.nombre)}</div>
      <div style="font-size:10px;color:var(--t3);margin-top:3px">${g.numPersonas} personas · ${g.numEmpresas} empresas</div>
      ${g.rankingPoder?`<div style="font-size:9px;color:var(--amb);margin-top:2px">${ICONS.star} Ranking SAR #${g.rankingPoder}</div>`:''}</div></div>`:''}
    ${personas.length?`<div class="ds"><h4>PERSONAS DEL GRUPO (${personas.length})</h4>
      <div class="grid g3">${personas.slice(0,12).map(p => `<div class="card" onclick="nav('p-det',${p.id})">
        <div class="pcard">${av(p.nombre,co,42)}<div class="pinfo"><div class="pname">${esc(p.nombre)}</div>
        <div class="psub">${esc(p.rol||'')}</div>${bHTML(p)}</div></div></div>`).join('')}</div></div>`:''}`;
}
