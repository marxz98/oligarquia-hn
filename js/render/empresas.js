// ═══════════════════════════════════════════════════════════
// RENDER — Empresas (list + detail)
// ═══════════════════════════════════════════════════════════

function rEmpresas(c) {
  const q = document.getElementById('search').value.toLowerCase();
  const ls = DB.empresas.filter(e => {
    if (!q) return true;
    return [e.nombre, e.sector, e.grupoControlador, e.personasClave].filter(Boolean).join(' ').toLowerCase().includes(q);
  });

  c.innerHTML = `
    <div class="sh">
      <div><h2>Empresas</h2><p>${ls.length} registros</p></div>
      <button class="add-btn" onclick="showModal('addEmpresa')">+ NUEVA EMPRESA</button>
    </div>
    <div class="grid g3">
      ${ls.map(e => {
        const gc = e.grupoControlador || '';
        const ck = Object.keys(GC).find(k => gc.includes(k));
        const cc = ck ? GC[ck] : '#f59e0b';
        return `
          <div class="card" onclick="nav('e-det',${e.id})">
            <button class="ed-btn" onclick="event.stopPropagation();showModal('editEmpresa',${e.id})">✏</button>
            <div class="pcard">${av(e.nombre, cc, 48)}
            <div class="pinfo"><div class="pname">${esc(e.nombre)}</div>
            <div class="psub">${esc(e.sector || '')}</div>
            <div style="font-size:9px;color:var(--t4);margin-top:3px">⚡ ${esc(gc)}</div></div></div>
          </div>`;
      }).join('')}
    </div>`;
}

function rEDet(c, id) {
  const e = DB.empresas.find(x => x.id === id);
  if (!e) return;
  const gc = e.grupoControlador || '';
  const ck = Object.keys(GC).find(k => gc.includes(k));
  const cc = ck ? GC[ck] : '#f59e0b';
  const rel = DB.personas.filter(p => {
    const nw = (e.personasClave || '').toLowerCase();
    return p.nombre.split(' ').some(w => w.length > 3 && nw.includes(w.toLowerCase()))
      || (p.grupo && gc.includes(p.grupo));
  }).slice(0, 20);

  c.innerHTML = `
    <div class="pbk" onclick="nav('empresas')">← Empresas</div>
    <div class="phero">
      <button class="ed-btn" onclick="showModal('editEmpresa',${e.id})">✏ EDITAR</button>
      ${av(e.nombre, cc, 84)}
      <div style="flex:1">
        <div class="phn">${esc(e.nombre)}</div>
        <div class="psub">${esc(e.sector || '')} · ${esc(gc)}</div>
      </div>
    </div>
    ${e.personasClave ? `<div class="ds"><h4>PERSONAS CLAVE</h4><div class="df">${esc(e.personasClave)}</div></div>` : ''}
    ${e.notas ? `<div class="ds"><h4>NOTAS</h4><div class="df">${esc(e.notas)}</div></div>` : ''}
    ${rel.length ? `<div class="ds"><h4>PERSONAS VINCULADAS (${rel.length})</h4>
      <div class="grid g3">${rel.map(p => `
        <div class="card" onclick="nav('p-det',${p.id})">
          <div class="pcard">${av(p.nombre, GC[p.grupo], 42)}
          <div class="pinfo"><div class="pname">${esc(p.nombre)}</div>
          <div class="psub">${esc(p.grupo)}</div></div></div>
        </div>`).join('')}</div></div>` : ''}`;
}
