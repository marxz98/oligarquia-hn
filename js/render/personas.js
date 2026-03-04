// ═══════════════════════════════════════════════════════════
// RENDER — Personas (list + detail)
// ═══════════════════════════════════════════════════════════

/** Apply search + filter */
function getFilt() {
  const q = document.getElementById('search').value.toLowerCase();
  return DB.personas.filter(p => {
    const t = [p.nombre, p.grupo, p.sectorEmpresarial, p.empresasDueno, p.rol, p.narcotrafico, p.alertasLegales, p.notas]
      .filter(Boolean).join(' ').toLowerCase();
    if (q && !t.includes(q)) return false;
    if (filt === 'narco' && !p.narcotrafico) return false;
    if (filt === 'golpe' && !p.golpe2009) return false;
    if (filt === 'alerta' && !p.alertasLegales) return false;
    if (filt === 'politico' && !p.vinculoPolitico) return false;
    return true;
  });
}

/** List view */
function rPersonas(c) {
  const ls = getFilt();
  const filters = [
    { key: 'todos', label: 'TODOS' },
    { key: 'narco', label: 'NARCOTRÁFICO' },
    { key: 'golpe', label: 'GOLPE 2009' },
    { key: 'alerta', label: 'ALERTAS' },
    { key: 'politico', label: 'POLÍTICOS' }
  ];

  c.innerHTML = `
    <div class="sh">
      <div><h2>Personas</h2><p>${ls.length} registros</p></div>
      <button class="add-btn" onclick="showModal('addPersona')">+ NUEVA PERSONA</button>
    </div>
    <div class="pills">
      ${filters.map(f => `
        <button class="pill ${filt === f.key ? 'on' : ''}" data-t="${f.key}" onclick="setFilt('${f.key}')">${f.label}</button>
      `).join('')}
    </div>
    <div class="grid g3">
      ${ls.map(p => `
        <div class="card" onclick="nav('p-det',${p.id})">
          <button class="ed-btn" onclick="event.stopPropagation();showModal('editPersona',${p.id})">✏ EDITAR</button>
          <div class="pcard">
            ${av(p.nombre, GC[p.grupo], 50)}
            <div class="pinfo">
              <div class="pname">${esc(p.nombre)}</div>
              <div class="psub">${esc(p.grupo)} · ${esc(p.sectorEmpresarial || '')}</div>
              ${bHTML(p)}
              <div class="pdesc">${esc(p.rol || p.empresasDueno || '')}</div>
            </div>
          </div>
        </div>`).join('')}
    </div>`;
}

/** Detail view */
function rPDet(c, id) {
  const p = DB.personas.find(x => x.id === id);
  if (!p) return;
  const co = GC[p.grupo] || '#6b7280';
  const fam = DB.personas.filter(x => x.id !== p.id && x.grupo === p.grupo);
  const emps = DB.empresas.filter(e => {
    const nw = p.nombre.toLowerCase().split(' ');
    return (e.personasClave && nw.some(w => w.length > 3 && e.personasClave.toLowerCase().includes(w)))
      || (e.grupoControlador && p.grupo && e.grupoControlador.includes(p.grupo));
  });

  c.innerHTML = `
    <div class="pbk" onclick="nav('personas')">← Personas</div>
    <div class="phero">
      <button class="ed-btn" onclick="showModal('editPersona',${p.id})">✏ EDITAR</button>
      ${av(p.nombre, co, 84)}
      <div style="flex:1">
        <div class="phn">${esc(p.nombre)}</div>
        <div class="psub" style="color:${co}">${esc(p.grupo)} · ${esc(p.sectorEmpresarial || '')}</div>
        ${p.dni ? `<div style="font-size:10px;color:var(--t4);margin-top:3px">DNI: ${esc(p.dni)} · ${esc(p.estado || '')}</div>` : ''}
        <div class="bx" style="margin-top:6px">${bHTML(p)}</div>
      </div>
    </div>

    ${p.rol ? `<div class="ds"><h4>ROL</h4><div class="df">${esc(p.rol)}</div></div>` : ''}

    ${(p.vinculoFamiliar || p.familiaresDirectos || p.conyuge) ? `<div class="ds"><h4>VÍNCULOS FAMILIARES</h4>
      ${p.vinculoFamiliar ? `<div class="df"><strong>Relación</strong>${esc(p.vinculoFamiliar)}</div>` : ''}
      ${p.familiaresDirectos ? `<div class="df"><strong>Familiares directos</strong>${esc(p.familiaresDirectos)}</div>` : ''}
      ${p.conyuge ? `<div class="df"><strong>Cónyuge</strong>${esc(p.conyuge)}</div>` : ''}
    </div>` : ''}

    ${(p.empresasDueno || p.empresasDirectivo || p.otrasEmpresas) ? `<div class="ds"><h4>EMPRESAS</h4>
      ${p.empresasDueno ? `<div class="df"><strong>Dueño / Accionista</strong>${esc(p.empresasDueno)}</div>` : ''}
      ${p.empresasDirectivo ? `<div class="df"><strong>Directivo / CEO</strong>${esc(p.empresasDirectivo)}</div>` : ''}
      ${p.otrasEmpresas ? `<div class="df"><strong>Otras</strong>${esc(p.otrasEmpresas)}</div>` : ''}
    </div>` : ''}

    ${(p.vinculoPolitico || p.cargoPoliticoActual || p.cargoPoliticoPasado) ? `<div class="ds"><h4>VÍNCULOS POLÍTICOS</h4>
      ${p.vinculoPolitico ? `<div class="df inf"><strong>Vínculo</strong>${esc(p.vinculoPolitico)}</div>` : ''}
      ${p.partidoPolitico ? `<div class="df inf"><strong>Partido</strong>${esc(p.partidoPolitico)}</div>` : ''}
      ${p.cargoPoliticoActual ? `<div class="df inf"><strong>Cargo actual</strong>${esc(p.cargoPoliticoActual)}</div>` : ''}
      ${p.cargoPoliticoPasado ? `<div class="df inf"><strong>Cargo pasado</strong>${esc(p.cargoPoliticoPasado)}</div>` : ''}
    </div>` : ''}

    ${(p.instituciones || p.medios || p.bancos) ? `<div class="ds"><h4>INSTITUCIONES, MEDIOS, BANCA</h4>
      ${p.instituciones ? `<div class="df"><strong>Instituciones</strong>${esc(p.instituciones)}</div>` : ''}
      ${p.medios ? `<div class="df"><strong>Medios</strong>${esc(p.medios)}</div>` : ''}
      ${p.bancos ? `<div class="df"><strong>Bancos</strong>${esc(p.bancos)}</div>` : ''}
    </div>` : ''}

    ${p.narcotrafico ? `<div class="ds"><h4>⚠ NARCOTRÁFICO</h4><div class="df dg">${esc(p.narcotrafico)}</div></div>` : ''}
    ${p.golpe2009 ? `<div class="ds"><h4>⚠ GOLPE 2009</h4><div class="df wa">${esc(p.golpe2009)}</div></div>` : ''}
    ${p.alertasLegales ? `<div class="ds"><h4>🚨 ALERTAS LEGALES</h4><div class="df al">${esc(p.alertasLegales)}</div></div>` : ''}
    ${p.notas ? `<div class="ds"><h4>NOTAS</h4><div class="df">${esc(p.notas)}</div></div>` : ''}

    ${emps.length ? `<div class="ds"><h4>EMPRESAS EN LA BD (${emps.length})</h4>
      <div class="rgrid">${emps.map(e =>
        `<div class="ri" onclick="nav('e-det',${e.id})">${esc(e.nombre)}<small>${esc(e.sector || '')}</small></div>`
      ).join('')}</div></div>` : ''}

    ${fam.length ? `<div class="ds"><h4>GRUPO ${esc(p.grupo)} (${fam.length})</h4>
      <div class="rgrid">${fam.map(m =>
        `<div class="ri" onclick="nav('p-det',${m.id})">${esc(m.nombre)}<small>${esc(m.rol || '')}</small></div>`
      ).join('')}</div></div>` : ''}`;
}
