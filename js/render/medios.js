// ═══════════════════════════════════════════════════════════
// RENDER — Medios de Comunicación (list + detail)
// ═══════════════════════════════════════════════════════════

function rMedios(c) {
  c.innerHTML = `
    <div class="sh">
      <div><h2>Medios de Comunicación</h2><p>¿Quién controla la información?</p></div>
      <button class="add-btn" onclick="showModal('addMedio')">+ NUEVO MEDIO</button>
    </div>
    <div class="grid g2">
      ${DB.medios.map(m => {
        const gc = m.grupoControlador || '';
        const ck = Object.keys(GC).find(k => gc.includes(k));
        const cc = ck ? GC[ck] : '#06b6d4';
        return `
          <div class="card" onclick="nav('m-det','${m.id}')" style="border-left:3px solid ${cc}40">
            <button class="ed-btn" onclick="event.stopPropagation();showModal('editMedio','${m.id}')">✏</button>
            <div class="pcard">${av(m.nombre, cc, 54)}
            <div class="pinfo">
              <div class="pname">${esc(m.nombre)}</div>
              <div class="psub">${esc(m.tipo)} · ${esc(m.canal || '')}</div>
              <div style="font-size:9px;color:${cc};margin-top:3px">CONTROLADO POR: ${esc(gc)}</div>
              <div class="pdesc">${esc(m.descripcion)}</div>
            </div></div>
          </div>`;
      }).join('')}
    </div>`;
}

function rMDet(c, id) {
  const m = DB.medios.find(x => x.id === id);
  if (!m) return;
  const gc = m.grupoControlador || '';
  const ck = Object.keys(GC).find(k => gc.includes(k));
  const cc = ck ? GC[ck] : '#06b6d4';
  const rg = gc ? DB.grupos.find(g => gc.includes(g.nombre)) : null;

  c.innerHTML = `
    <div class="pbk" onclick="nav('medios')">← Medios</div>
    <div class="phero" style="border-left:4px solid ${cc}">
      <button class="ed-btn" onclick="showModal('editMedio','${m.id}')">✏ EDITAR</button>
      ${av(m.nombre, cc, 84)}
      <div style="flex:1">
        <div class="phn">${esc(m.nombre)}</div>
        <div class="psub">${esc(m.tipo)} · ${esc(m.canal || '')}</div>
        <div style="font-size:11px;color:${cc};margin-top:3px">GRUPO: ${esc(gc)}</div>
        ${m.fundador ? `<div style="font-size:10px;color:var(--t3);margin-top:2px">Fundador: ${esc(m.fundador)}</div>` : ''}
      </div>
    </div>
    <div class="ds"><h4>DESCRIPCIÓN</h4><div class="df">${esc(m.descripcion)}</div></div>
    ${m.personasClave && m.personasClave.length ? `<div class="ds"><h4>PERSONAS CLAVE</h4>
      <div class="rgrid">${m.personasClave.map(n => {
        const pp = DB.personas.find(p => p.nombre === n);
        return pp
          ? `<div class="ri" onclick="nav('p-det',${pp.id})">${esc(n)}<small>${esc(pp.grupo)}</small></div>`
          : `<div class="ri">${esc(n)}</div>`;
      }).join('')}</div></div>` : ''}
    ${rg ? `<div class="ds"><h4>GRUPO CONTROLADOR</h4>
      <div class="card" onclick="nav('g-det','${rg.nombre}')" style="border-left:2px solid ${cc}40">
        <div style="font-family:var(--fd);font-size:13px;color:${cc}">${esc(rg.nombre)}</div>
        <div style="font-size:10px;color:var(--t3);margin-top:3px">${DB.personas.filter(p => p.grupo === rg.nombre).length} personas</div>
      </div></div>` : ''}`;
}
