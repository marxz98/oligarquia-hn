// ═══════════════════════════════════════════════════════════
// RENDER — Dashboard
// ═══════════════════════════════════════════════════════════

function rDash(c) {
  const nr = DB.personas.filter(p => p.narcotrafico);
  const al = DB.personas.filter(p => p.alertasLegales);

  const stats = [
    { v: DB.personas.length, l: 'PERSONAS', c: 'var(--red)', p: 'personas' },
    { v: DB.grupos.length, l: 'GRUPOS', c: 'var(--pink)', p: 'grupos' },
    { v: DB.empresas.length, l: 'EMPRESAS', c: 'var(--amb)', p: 'empresas' },
    { v: DB.partidos.length, l: 'PARTIDOS', c: 'var(--blu)', p: 'partidos' },
    { v: DB.medios.length, l: 'MEDIOS', c: 'var(--cyan)', p: 'medios' },
    { v: DB.carteles.length, l: 'CARTELES', c: 'var(--pur)', p: 'carteles' },
    { v: nr.length, l: 'NARCO', c: '#a78bfa', p: 'personas' },
    { v: al.length, l: 'ALERTAS', c: '#f87171', p: 'personas' }
  ];

  c.innerHTML = `
    <div class="sh">
      <div><h2>Radiografía del Poder</h2>
      <p>Base de datos ciudadana sobre la oligarquía hondureña</p></div>
    </div>

    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:6px;margin-bottom:16px">
      ${stats.map(s => `
        <div class="card" onclick="nav('${s.p}')" style="text-align:center;padding:12px">
          <div style="font-size:28px;font-weight:700;font-family:var(--fd);color:${s.c}">${s.v}</div>
          <div style="font-size:9px;color:var(--t4);letter-spacing:2px;margin-top:2px">${s.l}</div>
        </div>`).join('')}
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
      <div>
        <h3 style="font-family:var(--fd);font-size:12px;color:var(--red);letter-spacing:2px;margin-bottom:10px">🚨 ALERTAS LEGALES</h3>
        ${al.slice(0, 5).map(p => `
          <div class="card" style="margin-bottom:5px" onclick="nav('p-det',${p.id})">
            <div class="pcard">${av(p.nombre, GC[p.grupo], 42)}
            <div class="pinfo"><div class="pname">${esc(p.nombre)}</div>
            <div class="psub">${esc(p.grupo)}</div>
            <div class="pdesc" style="color:var(--red)">${esc(p.alertasLegales)}</div></div></div>
          </div>`).join('')}
      </div>
      <div>
        <h3 style="font-family:var(--fd);font-size:12px;color:var(--pur);letter-spacing:2px;margin-bottom:10px">💀 NARCOTRÁFICO</h3>
        ${nr.slice(0, 5).map(p => `
          <div class="card" style="margin-bottom:5px" onclick="nav('p-det',${p.id})">
            <div class="pcard">${av(p.nombre, '#8b5cf6', 42)}
            <div class="pinfo"><div class="pname">${esc(p.nombre)}</div>
            <div class="psub">${esc(p.grupo)}</div>
            <div class="pdesc" style="color:var(--pur)">${esc(p.narcotrafico)}</div></div></div>
          </div>`).join('')}
      </div>
    </div>

    <h3 style="font-family:var(--fd);font-size:12px;color:var(--amb);letter-spacing:2px;margin:20px 0 10px">🏢 GRUPOS FAMILIARES</h3>
    <div class="grid g4">
      ${DB.grupos.map(g => {
        const co = GC[g.nombre] || '#6b7280';
        const ms = DB.personas.filter(p => p.grupo === g.nombre);
        return `
          <div class="card" onclick="nav('g-det','${g.nombre}')" style="border-left:2px solid ${co}40">
            <div style="font-family:var(--fd);font-size:13px;color:${co};margin-bottom:3px">${esc(g.nombre)}</div>
            <div style="font-size:10px;color:var(--t3)">
              <strong style="color:var(--t2)">${ms.length}</strong> personas ·
              <strong style="color:var(--t2)">${g.numEmpresas}</strong> empresas
            </div>
            ${g.numNarco ? `<div style="font-size:9px;color:var(--pur);margin-top:4px">⚠ ${g.numNarco} narco</div>` : ''}
          </div>`;
      }).join('')}
    </div>`;
}
