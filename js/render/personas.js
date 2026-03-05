// ═══ RENDER — Personas ═══
function getFilt() {
  const q = document.getElementById('search').value.toLowerCase();
  return DB.personas.filter(p => {
    const t = [p.nombre,p.grupo,p.rol,p.alertasLegales,p.notas,p.estado].filter(Boolean).join(' ').toLowerCase();
    if (q && !t.includes(q)) return false;
    if (filt==='alerta' && !p.alertasLegales) return false;
    if (filt==='golpe' && !p.golpe2009) return false;
    if (filt==='socio' && !p.esSocioPrincipal) return false;
    return true;
  });
}
function rPersonas(c) {
  const ls = getFilt();
  c.innerHTML = `<div class="sh"><div><h2>Personas</h2><p>${ls.length} registros</p></div>
    <button class="add-btn" onclick="showModal('addPersona')">+ NUEVA PERSONA</button></div>
    <div class="pills">
    ${[{k:'todos',l:'TODOS'},{k:'alerta',l:'ALERTAS'},{k:'golpe',l:'GOLPE 2009'},{k:'socio',l:'SOCIOS SAR'}].map(f =>
      `<button class="pill ${filt===f.k?'on':''}" data-t="${f.k}" onclick="setFilt('${f.k}')">${f.l}</button>`).join('')}</div>
    <div class="grid g3">${ls.map(p => `<div class="card" onclick="nav('p-det',${p.id})">
      <button class="ed-btn" onclick="event.stopPropagation();showModal('editPersona',${p.id})">✏ EDITAR</button>
      <div class="pcard">${av(p.nombre,GC[p.grupo],50)}<div class="pinfo"><div class="pname">${esc(p.nombre)}</div>
      <div class="psub">${esc(p.grupo||'')} · ${esc(p.estado||'')}</div>${bHTML(p)}
      <div class="pdesc">${esc(p.rol||'')}</div></div></div></div>`).join('')}</div>`;
}
function rPDet(c, id) {
  const p = DB.personas.find(x => x.id===id); if (!p) return;
  const co = GC[p.grupo]||'#6b7280';
  const fam = DB.personas.filter(x => x.id!==p.id && x.grupo===p.grupo && p.grupo);
  const emps = DB.empresas.filter(e => e.grupoId===p.grupoId);
  c.innerHTML = `<div class="pbk" onclick="nav('personas')">← Personas</div>
    <div class="phero"><button class="ed-btn" style="right:90px" onclick="event.stopPropagation();showModal('addVinculo',{tipo:'persona',id:${p.id}})">+ VINCULO</button><button class="ed-btn" onclick="showModal('editPersona',${p.id})">✏ EDITAR</button>
    ${av(p.nombre,co,84)}<div style="flex:1"><div class="phn">${esc(p.nombre)}</div>
    <div class="psub" style="color:${co}">${esc(p.grupo||'')} · ${esc(p.estado||'')}</div>
    ${p.dni?`<div style="font-size:10px;color:var(--t4);margin-top:3px">DNI: ${esc(p.dni)}</div>`:''}
    ${p.nacionalidad&&p.nacionalidad!=='Hondureña'?`<div style="font-size:10px;color:var(--cyan);margin-top:2px">${ICONS.globe} ${esc(p.nacionalidad)}</div>`:''}
    <div class="bx" style="margin-top:6px">${bHTML(p)}</div></div></div>
    ${p.rol?`<div class="ds"><h4>ROL</h4><div class="df">${esc(p.rol)}</div></div>`:''}
    ${p.golpe2009?`<div class="ds"><h4>${ICONS.alert} GOLPE 2009</h4><div class="df wa">${esc(p.golpe2009)}</div></div>`:''}
    ${p.alertasLegales?`<div class="ds"><h4>${ICONS.siren} ALERTAS LEGALES</h4><div class="df al">${esc(p.alertasLegales)}</div></div>`:''}
    ${renderVinculos('persona', p.id)}
    ${p.notas?`<div class="ds"><h4>NOTAS</h4><div class="df">${esc(p.notas)}</div></div>`:''}
    ${emps.length?`<div class="ds"><h4>EMPRESAS DEL GRUPO (${emps.length})</h4><div class="rgrid">${emps.slice(0,20).map(e =>
      `<div class="ri" onclick="nav('e-det',${e.id})">${esc(e.nombre)}<small>${esc(e.actividadEconomica||'')}</small></div>`).join('')}</div></div>`:''}
    ${fam.length?`<div class="ds"><h4>GRUPO ${esc(p.grupo)} (${fam.length})</h4><div class="rgrid">${fam.map(m =>
      `<div class="ri" onclick="nav('p-det',${m.id})">${esc(m.nombre)}<small>${esc(m.rol||'')}</small></div>`).join('')}</div></div>`:''}`;
}
