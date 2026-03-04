// ═══════════════════════════════════════════════════════════
// RENDER — Carteles / Crimen Organizado (list + detail)
// ═══════════════════════════════════════════════════════════

function rCarteles(c) {
  c.innerHTML = `
    <div class="sh">
      <div><h2>Carteles / Crimen Organizado</h2><p>Nexos documentados</p></div>
      <button class="add-btn" onclick="showModal('addCartel')">+ NUEVO CARTEL</button>
    </div>
    <div class="grid g2">
      ${DB.carteles.map(ct => `
        <div class="card" onclick="nav('c-det','${ct.id}')" style="border-left:3px solid var(--pur)">
          <button class="ed-btn" onclick="event.stopPropagation();showModal('editCartel','${ct.id}')">✏</button>
          <div class="pcard">${av(ct.nombre, '#8b5cf6', 54)}
          <div class="pinfo">
            <div class="pname" style="color:var(--pur)">${esc(ct.nombre)}</div>
            <div class="psub">${esc(ct.estado)} · ${esc(ct.zona || '')}</div>
            <div class="pdesc">${esc(ct.descripcion)}</div>
            <div style="font-size:10px;color:var(--pur);margin-top:4px">${ct.personasVinculadas.length} personas vinculadas</div>
          </div></div>
        </div>`).join('')}
    </div>`;
}

function rCDet(c, id) {
  const ct = DB.carteles.find(x => x.id === id);
  if (!ct) return;

  c.innerHTML = `
    <div class="pbk" onclick="nav('carteles')">← Carteles</div>
    <div class="phero" style="border-left:4px solid var(--pur)">
      <button class="ed-btn" onclick="showModal('editCartel','${ct.id}')">✏ EDITAR</button>
      ${av(ct.nombre, '#8b5cf6', 84)}
      <div style="flex:1">
        <div class="phn" style="color:var(--pur)">${esc(ct.nombre)}</div>
        <div class="psub">${esc(ct.nombreCompleto || '')}</div>
        <div class="bx" style="margin-top:4px">
          <span class="b b-nr">${esc(ct.estado)}</span>
          <span class="b b-sc">${esc(ct.zona || '')}</span>
        </div>
      </div>
    </div>
    <div class="ds"><h4>DESCRIPCIÓN</h4><div class="df dg">${esc(ct.descripcion)}</div></div>
    ${ct.operaciones ? `<div class="ds"><h4>OPERACIONES</h4><div class="df dg">${esc(ct.operaciones)}</div></div>` : ''}
    ${ct.zona ? `<div class="ds"><h4>ZONA</h4><div class="df wa">${esc(ct.zona)}</div></div>` : ''}
    <div class="ds"><h4>PERSONAS VINCULADAS (${ct.personasVinculadas.length})</h4>
      <div class="grid g3">${ct.personasVinculadas.map(n => {
        const pp = DB.personas.find(p => p.nombre.includes(n.split(' ').slice(0, 2).join(' ')));
        return pp
          ? `<div class="card" onclick="nav('p-det',${pp.id})">
              <div class="pcard">${av(pp.nombre, '#8b5cf6', 42)}
              <div class="pinfo"><div class="pname">${esc(pp.nombre)}</div>
              <div class="psub">${esc(pp.grupo)}</div>${bHTML(pp)}</div></div></div>`
          : `<div class="card"><div class="pname">${esc(n)}</div></div>`;
      }).join('')}</div>
    </div>`;
}
