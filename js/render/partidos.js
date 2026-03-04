// ═══════════════════════════════════════════════════════════
// RENDER — Partidos Políticos (list + detail)
// ═══════════════════════════════════════════════════════════

function rPartidos(c) {
  c.innerHTML = `
    <div class="sh"><div><h2>Partidos Políticos</h2><p>Vínculos con la oligarquía</p></div></div>
    <div class="grid g2">
      ${DB.partidos.map(p => `
        <div class="card" onclick="nav('pt-det','${p.id}')" style="border-left:3px solid ${p.color}40">
          <div class="pcard">${av(p.siglas, p.color, 58)}
          <div class="pinfo">
            <div class="pname" style="color:${p.color}">${esc(p.nombre)}</div>
            <div class="psub">${esc(p.siglas)} · ${p.fundado} · ${esc(p.ideologia)}</div>
            <div class="pdesc">${esc(p.descripcion)}</div>
            <div style="font-size:10px;color:var(--t3);margin-top:4px">
              <strong style="color:var(--t2)">${p.personasVinculadas.length}</strong> oligarcas vinculados
            </div>
          </div></div>
        </div>`).join('')}
    </div>`;
}

function rPtDet(c, id) {
  const p = DB.partidos.find(x => x.id === id);
  if (!p) return;
  const vinc = DB.personas.filter(x => p.personasVinculadas.includes(x.nombre));

  c.innerHTML = `
    <div class="pbk" onclick="nav('partidos')">← Partidos</div>
    <div class="phero" style="border-left:4px solid ${p.color}">
      ${av(p.siglas, p.color, 84)}
      <div style="flex:1">
        <div class="phn" style="color:${p.color}">${esc(p.nombre)}</div>
        <div class="psub">${esc(p.siglas)} · Fundado ${p.fundado}</div>
        <div class="bx" style="margin-top:6px">
          <span class="b b-po">${esc(p.ideologia)}</span>
          <span class="b b-sc">${vinc.length} OLIGARCAS</span>
        </div>
      </div>
    </div>
    <div class="ds"><h4>DESCRIPCIÓN</h4><div class="df">${esc(p.descripcion)}</div></div>
    <div class="ds"><h4>OLIGARCAS VINCULADOS (${vinc.length})</h4>
      <div class="grid g3">${vinc.map(v => `
        <div class="card" onclick="nav('p-det',${v.id})">
          <div class="pcard">${av(v.nombre, GC[v.grupo], 42)}
          <div class="pinfo"><div class="pname">${esc(v.nombre)}</div>
          <div class="psub">${esc(v.grupo)}</div>${bHTML(v)}</div></div>
        </div>`).join('')}</div>
    </div>`;
}
