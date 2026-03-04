// ═══════════════════════════════════════════════════════════
// RENDER — Grupos Familiares (list + detail)
// ═══════════════════════════════════════════════════════════

function rGrupos(c) {
  c.innerHTML = `
    <div class="sh">
      <div><h2>Grupos Familiares</h2><p>${DB.grupos.length} dinastías</p></div>
      <button class="add-btn" onclick="showModal('addGrupo')">+ NUEVO GRUPO</button>
    </div>
    <div class="grid g2">
      ${DB.grupos.map(g => {
        const co = GC[g.nombre] || '#6b7280';
        const ms = DB.personas.filter(p => p.grupo === g.nombre);
        const es = DB.empresas.filter(e => e.grupoControlador && e.grupoControlador.includes(g.nombre));
        return `
          <div class="card" onclick="nav('g-det','${g.nombre}')" style="border-left:3px solid ${co}40">
            <button class="ed-btn" onclick="event.stopPropagation();showModal('editGrupo','${g.nombre}')">✏ EDITAR</button>
            <div class="pcard">
              ${av(g.nombre, co, 58)}
              <div class="pinfo">
                <div class="pname" style="color:${co}">${esc(g.nombre)}</div>
                <div style="display:flex;gap:10px;font-size:10px;color:var(--t3);margin-top:3px">
                  <span><strong style="color:var(--t1)">${ms.length}</strong> personas</span>
                  <span><strong style="color:var(--t1)">${es.length}</strong> empresas</span>
                  ${ms.filter(m => m.narcotrafico).length ? `<span style="color:var(--pur)"><strong>${ms.filter(m => m.narcotrafico).length}</strong> narco</span>` : ''}
                  ${ms.filter(m => m.alertasLegales).length ? `<span style="color:var(--red)"><strong>${ms.filter(m => m.alertasLegales).length}</strong> alertas</span>` : ''}
                </div>
                <div class="pdesc" style="margin-top:4px">${esc(g.integrantes)}</div>
              </div>
            </div>
          </div>`;
      }).join('')}
    </div>`;
}

function rGDet(c, nombre) {
  const g = DB.grupos.find(x => x.nombre === nombre);
  if (!g) return;
  const co = GC[nombre] || '#6b7280';
  const ms = DB.personas.filter(p => p.grupo === nombre);
  const es = DB.empresas.filter(e => e.grupoControlador && e.grupoControlador.includes(nombre));
  const meds = DB.medios.filter(m => m.grupoControlador && m.grupoControlador.includes(nombre));

  c.innerHTML = `
    <div class="pbk" onclick="nav('grupos')">← Grupos</div>
    <div class="phero" style="border-left:4px solid ${co}">
      <button class="ed-btn" onclick="showModal('editGrupo','${nombre}')">✏ EDITAR</button>
      ${av(nombre, co, 84)}
      <div style="flex:1">
        <div class="phn" style="color:${co}">${esc(nombre)}</div>
        <div class="psub">${ms.length} personas · ${es.length} empresas</div>
        <div style="font-size:11px;color:var(--t3);margin-top:4px;line-height:1.5">${esc(g.integrantes)}</div>
      </div>
    </div>

    <div class="sh">
      <h4 style="font-size:10px;color:var(--red);letter-spacing:2px">INTEGRANTES (${ms.length})</h4>
      <button class="add-btn" onclick="showModal('addPersona','${nombre}')">+ AÑADIR PERSONA AL GRUPO</button>
    </div>
    <div class="grid g3">
      ${ms.map(p => `
        <div class="card" onclick="nav('p-det',${p.id})">
          <button class="ed-btn" onclick="event.stopPropagation();showModal('editPersona',${p.id})">✏</button>
          <div class="pcard">${av(p.nombre, co, 42)}
          <div class="pinfo"><div class="pname">${esc(p.nombre)}</div>
          <div class="psub">${esc(p.rol || '')}</div>${bHTML(p)}</div></div>
        </div>`).join('')}
    </div>

    ${es.length ? `
      <div class="ds" style="margin-top:14px"><h4>EMPRESAS (${es.length})</h4>
        <button class="add-btn" style="margin-bottom:8px" onclick="showModal('addEmpresa','${nombre}')">+ AÑADIR EMPRESA</button>
        <div class="grid g3">${es.map(e => `
          <div class="card" onclick="nav('e-det',${e.id})">
            <button class="ed-btn" onclick="event.stopPropagation();showModal('editEmpresa',${e.id})">✏</button>
            <div class="pname">${esc(e.nombre)}</div>
            <div class="psub">${esc(e.sector || '')}</div>
          </div>`).join('')}
        </div>
      </div>` : ''}

    ${meds.length ? `
      <div class="ds" style="margin-top:14px"><h4>MEDIOS (${meds.length})</h4>
        <div class="grid g3">${meds.map(m => `
          <div class="card" onclick="nav('m-det','${m.id}')">
            <div class="pcard">${av(m.nombre, '#06b6d4', 42)}
            <div class="pinfo"><div class="pname">${esc(m.nombre)}</div>
            <div class="psub">${esc(m.tipo)}</div></div></div>
          </div>`).join('')}
        </div>
      </div>` : ''}`;
}
