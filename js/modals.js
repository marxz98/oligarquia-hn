// ═══════════════════════════════════════════════════════════
// MODALS — Modal system + CRUD form generators
// ═══════════════════════════════════════════════════════════

/** Show a modal by type with optional data */
function showModal(type, data) {
  const body = document.getElementById('modal-body');
  const generators = {
    login: mLogin,
    addPersona: mAddPersona,
    editPersona: mEditPersona,
    addGrupo: mAddGrupo,
    editGrupo: mEditGrupo,
    addEmpresa: mAddEmpresa,
    editEmpresa: mEditEmpresa,
    addMedio: mAddMedio,
    editMedio: mEditMedio,
    addCartel: mAddCartel,
    editCartel: mEditCartel
  };
  if (generators[type]) body.innerHTML = generators[type](data);
  document.getElementById('modal').classList.add('open');
}

/** Close modal */
function closeModal() {
  document.getElementById('modal').classList.remove('open');
}

// ─── Login form ───
function mLogin() {
  return `<div style="text-align:center">
    <div style="font-size:28px;margin-bottom:4px">🔒</div>
    <h3 style="justify-content:center">ACCESO RESTRINGIDO</h3>
    <p style="font-size:10px;color:var(--t4);margin-bottom:12px">Solo personal autorizado</p>
    <div id="lerr" class="hidden" style="color:var(--red);font-size:10px;margin-bottom:6px">Credenciales incorrectas</div>
    <input id="lu" placeholder="Usuario">
    <input id="lp" type="password" placeholder="Contraseña" onkeydown="if(event.key==='Enter')doLogin()">
    <button class="sbm" onclick="doLogin()">INGRESAR</button>
    <button class="cnc" onclick="closeModal()">Cancelar</button>
  </div>`;
}

// ─── Persona forms ───
function personaFields(p) {
  p = p || {};
  return `
    <label>NOMBRE COMPLETO *</label><input id="fp-nombre" value="${esc(p.nombre || '')}">
    <div class="r2">
      <div><label>GRUPO FAMILIAR</label><select id="fp-grupo">${grupoOpts()}</select></div>
      <div><label>ESTADO</label><select id="fp-estado">
        <option ${p.estado === 'Vivo' ? 'selected' : ''}>Vivo</option>
        <option ${p.estado === 'QDDG' ? 'selected' : ''}>QDDG</option>
        <option ${p.estado === 'Detenido' ? 'selected' : ''}>Detenido</option>
        <option ${p.estado === 'Prófugo' ? 'selected' : ''}>Prófugo</option>
      </select></div>
    </div>
    <label>ROL EN EL GRUPO</label><input id="fp-rol" value="${esc(p.rol || '')}">
    <label>SECTOR EMPRESARIAL</label><input id="fp-sector" value="${esc(p.sectorEmpresarial || '')}">
    <div class="r2">
      <div><label>DNI</label><input id="fp-dni" value="${esc(p.dni || '')}"></div>
      <div><label>VÍNCULO FAMILIAR</label><input id="fp-vfam" value="${esc(p.vinculoFamiliar || '')}"></div>
    </div>
    <label>FAMILIARES DIRECTOS</label><input id="fp-famd" value="${esc(p.familiaresDirectos || '')}">
    <label>CÓNYUGE / EX CÓNYUGE</label><input id="fp-cony" value="${esc(p.conyuge || '')}">
    <div class="sep"></div>
    <label>EMPRESAS (DUEÑO/ACCIONISTA)</label><input id="fp-empd" value="${esc(p.empresasDueno || '')}">
    <label>EMPRESAS (DIRECTIVO/CEO)</label><input id="fp-empdir" value="${esc(p.empresasDirectivo || '')}">
    <label>OTRAS EMPRESAS VINCULADAS</label><input id="fp-otrasemp" value="${esc(p.otrasEmpresas || '')}">
    <div class="sep"></div>
    <div class="r2">
      <div><label>VÍNCULO POLÍTICO</label><input id="fp-vpol" value="${esc(p.vinculoPolitico || '')}"></div>
      <div><label>PARTIDO</label><select id="fp-part">${partidoOpts()}</select></div>
    </div>
    <div class="r2">
      <div><label>CARGO POLÍTICO ACTUAL</label><input id="fp-cpact" value="${esc(p.cargoPoliticoActual || '')}"></div>
      <div><label>CARGO PASADO</label><input id="fp-cppas" value="${esc(p.cargoPoliticoPasado || '')}"></div>
    </div>
    <label>INSTITUCIONES / ASOCIACIONES</label><input id="fp-inst" value="${esc(p.instituciones || '')}">
    <label>MEDIOS VINCULADOS</label><input id="fp-med" value="${esc(p.medios || '')}">
    <label>BANCOS / FINANCIERAS</label><input id="fp-ban" value="${esc(p.bancos || '')}">
    <div class="sep"></div>
    <label>VÍNCULO CON NARCOTRÁFICO</label><textarea id="fp-narco">${esc(p.narcotrafico || '')}</textarea>
    <label>VÍNCULO GOLPE 2009</label><input id="fp-golpe" value="${esc(p.golpe2009 || '')}">
    <label>ALERTAS LEGALES / ÓRDENES CAPTURA</label><input id="fp-alert" value="${esc(p.alertasLegales || '')}">
    <label>NOTAS ADICIONALES</label><textarea id="fp-notas">${esc(p.notas || '')}</textarea>`;
}

function setSelectAfter(id, val) {
  return val ? `<script>document.getElementById('${id}').value='${esc(val)}'<\/script>` : '';
}

function mAddPersona(grupoPreset) {
  return `<h3>NUEVA PERSONA <button onclick="closeModal()">✕</button></h3>
    ${personaFields()}
    <button class="sbm" onclick="submitPersona()">REGISTRAR PERSONA</button>
    <button class="cnc" onclick="closeModal()">Cancelar</button>
    ${setSelectAfter('fp-grupo', grupoPreset)}`;
}

function mEditPersona(id) {
  const p = DB.personas.find(x => x.id === id);
  if (!p) return '';
  return `<h3>EDITAR PERSONA <button onclick="closeModal()">✕</button></h3>
    ${personaFields(p)}
    <button class="sbm" onclick="savePersona(${id})">GUARDAR CAMBIOS</button>
    <button class="del-btn" onclick="if(confirm('¿Eliminar a ${esc(p.nombre)}?')){delPersona(${id})}">🗑 ELIMINAR PERSONA</button>
    <button class="cnc" onclick="closeModal()">Cancelar</button>
    ${setSelectAfter('fp-grupo', p.grupo)}${setSelectAfter('fp-part', p.partidoPolitico)}`;
}

function readPersonaForm() {
  const n = gv('fp-nombre');
  if (!n) { alert('Nombre obligatorio'); return null; }
  const o = {
    nombre: n, grupo: gv('fp-grupo'), estado: gv('fp-estado'), rol: gv('fp-rol'),
    sectorEmpresarial: gv('fp-sector'), dni: gv('fp-dni'), vinculoFamiliar: gv('fp-vfam'),
    familiaresDirectos: gv('fp-famd'), conyuge: gv('fp-cony'), empresasDueno: gv('fp-empd'),
    empresasDirectivo: gv('fp-empdir'), otrasEmpresas: gv('fp-otrasemp'),
    vinculoPolitico: gv('fp-vpol'), partidoPolitico: gv('fp-part'),
    cargoPoliticoActual: gv('fp-cpact'), cargoPoliticoPasado: gv('fp-cppas'),
    instituciones: gv('fp-inst'), medios: gv('fp-med'), bancos: gv('fp-ban'),
    narcotrafico: gv('fp-narco'), golpe2009: gv('fp-golpe'),
    alertasLegales: gv('fp-alert'), notas: gv('fp-notas')
  };
  Object.keys(o).forEach(k => { if (!o[k]) delete o[k]; });
  return o;
}

function submitPersona() {
  const o = readPersonaForm(); if (!o) return;
  o.id = nid(DB.personas);
  DB.personas.push(o); updCounts(); closeModal(); nav(page);
}
function savePersona(id) {
  const o = readPersonaForm(); if (!o) return;
  const i = DB.personas.findIndex(x => x.id === id); if (i < 0) return;
  o.id = id; DB.personas[i] = o; updCounts(); closeModal(); nav('p-det', id);
}
function delPersona(id) {
  DB.personas = DB.personas.filter(x => x.id !== id);
  updCounts(); closeModal(); nav('personas');
}

// ─── Grupo forms ───
function mAddGrupo() {
  return `<h3>NUEVO GRUPO FAMILIAR <button onclick="closeModal()">✕</button></h3>
    <label>NOMBRE DEL GRUPO *</label><input id="fg-nombre" placeholder="Ej: APELLIDO-APELLIDO">
    <label>COLOR IDENTIFICADOR</label><input id="fg-color" value="Azul claro">
    <label>INTEGRANTES PRINCIPALES</label><textarea id="fg-int" placeholder="Nombres separados por coma"></textarea>
    <button class="sbm" onclick="submitGrupo()">CREAR GRUPO</button>
    <button class="cnc" onclick="closeModal()">Cancelar</button>`;
}

function mEditGrupo(nombre) {
  const g = DB.grupos.find(x => x.nombre === nombre); if (!g) return '';
  return `<h3>EDITAR GRUPO <button onclick="closeModal()">✕</button></h3>
    <label>NOMBRE *</label><input id="fg-nombre" value="${esc(g.nombre)}">
    <label>COLOR</label><input id="fg-color" value="${esc(g.color)}">
    <label>INTEGRANTES PRINCIPALES</label><textarea id="fg-int">${esc(g.integrantes)}</textarea>
    <button class="sbm" onclick="saveGrupo('${esc(g.nombre)}')">GUARDAR</button>
    <button class="del-btn" onclick="if(confirm('¿Eliminar grupo ${esc(g.nombre)}?')){delGrupo('${esc(g.nombre)}')}">🗑 ELIMINAR GRUPO</button>
    <button class="cnc" onclick="closeModal()">Cancelar</button>`;
}

function submitGrupo() {
  const n = gv('fg-nombre'); if (!n) return alert('Nombre obligatorio');
  DB.grupos.push({
    id: nid(DB.grupos), nombre: n, color: gv('fg-color'), integrantes: gv('fg-int'),
    numPersonas: 0, numEmpresas: 0, numNarco: 0, numAlertas: 0, numPolitico: 0, numGolpe: 0, sectores: []
  });
  GC[n] = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
  updCounts(); closeModal(); nav('grupos');
}
function saveGrupo(oldName) {
  const n = gv('fg-nombre'); if (!n) return;
  const i = DB.grupos.findIndex(x => x.nombre === oldName); if (i < 0) return;
  DB.grupos[i].nombre = n; DB.grupos[i].color = gv('fg-color'); DB.grupos[i].integrantes = gv('fg-int');
  if (n !== oldName) { DB.personas.forEach(p => { if (p.grupo === oldName) p.grupo = n; }); GC[n] = GC[oldName]; delete GC[oldName]; }
  updCounts(); closeModal(); nav('g-det', n);
}
function delGrupo(n) { DB.grupos = DB.grupos.filter(x => x.nombre !== n); updCounts(); closeModal(); nav('grupos'); }

// ─── Empresa forms ───
function mAddEmpresa(preset) {
  return `<h3>NUEVA EMPRESA <button onclick="closeModal()">✕</button></h3>
    <label>NOMBRE *</label><input id="fe-nombre">
    <div class="r2"><div><label>SECTOR</label><input id="fe-sector"></div>
    <div><label>GRUPO CONTROLADOR</label><select id="fe-grupo">${grupoOpts()}</select></div></div>
    <label>PERSONAS CLAVE</label><input id="fe-pers">
    <label>NOTAS</label><textarea id="fe-notas"></textarea>
    <button class="sbm" onclick="submitEmpresa()">REGISTRAR EMPRESA</button>
    <button class="cnc" onclick="closeModal()">Cancelar</button>
    ${setSelectAfter('fe-grupo', preset)}`;
}

function mEditEmpresa(id) {
  const e = DB.empresas.find(x => x.id === id); if (!e) return '';
  return `<h3>EDITAR EMPRESA <button onclick="closeModal()">✕</button></h3>
    <label>NOMBRE *</label><input id="fe-nombre" value="${esc(e.nombre)}">
    <div class="r2"><div><label>SECTOR</label><input id="fe-sector" value="${esc(e.sector || '')}"></div>
    <div><label>GRUPO CONTROLADOR</label><select id="fe-grupo">${grupoOpts()}</select></div></div>
    <label>PERSONAS CLAVE</label><input id="fe-pers" value="${esc(e.personasClave || '')}">
    <label>NOTAS</label><textarea id="fe-notas">${esc(e.notas || '')}</textarea>
    <button class="sbm" onclick="saveEmpresa(${id})">GUARDAR</button>
    <button class="del-btn" onclick="if(confirm('¿Eliminar?')){delEmpresa(${id})}">🗑 ELIMINAR</button>
    <button class="cnc" onclick="closeModal()">Cancelar</button>
    ${setSelectAfter('fe-grupo', e.grupoControlador)}`;
}

function submitEmpresa() {
  const n = gv('fe-nombre'); if (!n) return alert('Nombre obligatorio');
  DB.empresas.push({ id: nid(DB.empresas), nombre: n, sector: gv('fe-sector'), grupoControlador: gv('fe-grupo'), personasClave: gv('fe-pers'), notas: gv('fe-notas') });
  updCounts(); closeModal(); nav(page);
}
function saveEmpresa(id) {
  const n = gv('fe-nombre'); if (!n) return;
  const i = DB.empresas.findIndex(x => x.id === id); if (i < 0) return;
  Object.assign(DB.empresas[i], { nombre: n, sector: gv('fe-sector'), grupoControlador: gv('fe-grupo'), personasClave: gv('fe-pers'), notas: gv('fe-notas') });
  updCounts(); closeModal(); nav('e-det', id);
}
function delEmpresa(id) { DB.empresas = DB.empresas.filter(x => x.id !== id); updCounts(); closeModal(); nav('empresas'); }

// ─── Medio forms ───
function mAddMedio() {
  return `<h3>NUEVO MEDIO <button onclick="closeModal()">✕</button></h3>
    <label>NOMBRE *</label><input id="fm-nombre">
    <div class="r3"><div><label>TIPO</label><select id="fm-tipo"><option>Televisión</option><option>Prensa escrita</option><option>Radio</option><option>Digital</option><option>Cable TV</option></select></div>
    <div><label>CANAL</label><input id="fm-canal"></div>
    <div><label>GRUPO CONTROLADOR</label><select id="fm-grupo">${grupoOpts()}</select></div></div>
    <label>FUNDADOR</label><input id="fm-fund">
    <label>DESCRIPCIÓN</label><textarea id="fm-desc"></textarea>
    <label>PERSONAS CLAVE (separar con ,)</label><input id="fm-pers">
    <button class="sbm" onclick="submitMedio()">REGISTRAR MEDIO</button>
    <button class="cnc" onclick="closeModal()">Cancelar</button>`;
}

function mEditMedio(id) {
  const m = DB.medios.find(x => x.id === id); if (!m) return '';
  return `<h3>EDITAR MEDIO <button onclick="closeModal()">✕</button></h3>
    <label>NOMBRE *</label><input id="fm-nombre" value="${esc(m.nombre)}">
    <div class="r3"><div><label>TIPO</label><select id="fm-tipo">
      <option ${m.tipo === 'Televisión' ? 'selected' : ''}>Televisión</option>
      <option ${m.tipo === 'Prensa escrita' ? 'selected' : ''}>Prensa escrita</option>
      <option ${m.tipo === 'Radio' ? 'selected' : ''}>Radio</option>
      <option ${m.tipo === 'Digital' ? 'selected' : ''}>Digital</option>
      <option ${m.tipo === 'Cable TV' || m.tipo === 'Televisión por cable' ? 'selected' : ''}>Cable TV</option>
    </select></div>
    <div><label>CANAL</label><input id="fm-canal" value="${esc(m.canal || '')}"></div>
    <div><label>GRUPO</label><select id="fm-grupo">${grupoOpts()}</select></div></div>
    <label>FUNDADOR</label><input id="fm-fund" value="${esc(m.fundador || '')}">
    <label>DESCRIPCIÓN</label><textarea id="fm-desc">${esc(m.descripcion || '')}</textarea>
    <label>PERSONAS CLAVE</label><input id="fm-pers" value="${esc((m.personasClave || []).join(', '))}">
    <button class="sbm" onclick="saveMedio('${m.id}')">GUARDAR</button>
    <button class="del-btn" onclick="if(confirm('¿Eliminar?')){delMedio('${m.id}')}">🗑 ELIMINAR</button>
    <button class="cnc" onclick="closeModal()">Cancelar</button>
    ${setSelectAfter('fm-grupo', m.grupoControlador)}`;
}

function submitMedio() {
  const n = gv('fm-nombre'); if (!n) return alert('Nombre obligatorio');
  DB.medios.push({ id: 'm' + Date.now(), nombre: n, tipo: gv('fm-tipo'), canal: gv('fm-canal'), grupoControlador: gv('fm-grupo'), fundador: gv('fm-fund'), descripcion: gv('fm-desc'), personasClave: gv('fm-pers').split(',').map(s => s.trim()).filter(Boolean) });
  updCounts(); closeModal(); nav(page);
}
function saveMedio(id) {
  const n = gv('fm-nombre'); if (!n) return;
  const i = DB.medios.findIndex(x => x.id === id); if (i < 0) return;
  Object.assign(DB.medios[i], { nombre: n, tipo: gv('fm-tipo'), canal: gv('fm-canal'), grupoControlador: gv('fm-grupo'), fundador: gv('fm-fund'), descripcion: gv('fm-desc'), personasClave: gv('fm-pers').split(',').map(s => s.trim()).filter(Boolean) });
  updCounts(); closeModal(); nav('m-det', id);
}
function delMedio(id) { DB.medios = DB.medios.filter(x => x.id !== id); updCounts(); closeModal(); nav('medios'); }

// ─── Cartel forms ───
function mAddCartel() {
  return `<h3>NUEVO CARTEL / RED <button onclick="closeModal()">✕</button></h3>
    <label>NOMBRE *</label><input id="fc-nombre">
    <label>NOMBRE COMPLETO</label><input id="fc-full">
    <div class="r2"><div><label>ESTADO</label><select id="fc-estado"><option>Activo</option><option>Desmantelado parcialmente</option><option>Fragmentado</option><option>Desmantelado</option></select></div>
    <div><label>ZONA DE OPERACIÓN</label><input id="fc-zona"></div></div>
    <label>DESCRIPCIÓN</label><textarea id="fc-desc"></textarea>
    <label>OPERACIONES</label><textarea id="fc-ops"></textarea>
    <label>PERSONAS VINCULADAS (separar con ,)</label><input id="fc-pers">
    <button class="sbm" onclick="submitCartel()">REGISTRAR CARTEL</button>
    <button class="cnc" onclick="closeModal()">Cancelar</button>`;
}

function mEditCartel(id) {
  const c = DB.carteles.find(x => x.id === id); if (!c) return '';
  return `<h3>EDITAR CARTEL <button onclick="closeModal()">✕</button></h3>
    <label>NOMBRE *</label><input id="fc-nombre" value="${esc(c.nombre)}">
    <label>NOMBRE COMPLETO</label><input id="fc-full" value="${esc(c.nombreCompleto || '')}">
    <div class="r2"><div><label>ESTADO</label><select id="fc-estado">
      <option ${c.estado === 'Activo' ? 'selected' : ''}>Activo</option>
      <option ${c.estado && c.estado.includes('parcial') ? 'selected' : ''}>Desmantelado parcialmente</option>
      <option ${c.estado === 'Fragmentado' ? 'selected' : ''}>Fragmentado</option>
      <option ${c.estado === 'Desmantelado' ? 'selected' : ''}>Desmantelado</option>
    </select></div>
    <div><label>ZONA</label><input id="fc-zona" value="${esc(c.zona || '')}"></div></div>
    <label>DESCRIPCIÓN</label><textarea id="fc-desc">${esc(c.descripcion || '')}</textarea>
    <label>OPERACIONES</label><textarea id="fc-ops">${esc(c.operaciones || '')}</textarea>
    <label>PERSONAS VINCULADAS</label><input id="fc-pers" value="${esc((c.personasVinculadas || []).join(', '))}">
    <button class="sbm" onclick="saveCartel('${c.id}')">GUARDAR</button>
    <button class="del-btn" onclick="if(confirm('¿Eliminar?')){delCartel('${c.id}')}">🗑 ELIMINAR</button>
    <button class="cnc" onclick="closeModal()">Cancelar</button>`;
}

function submitCartel() {
  const n = gv('fc-nombre'); if (!n) return alert('Nombre obligatorio');
  DB.carteles.push({ id: n.toLowerCase().replace(/\s+/g, '-'), nombre: n, nombreCompleto: gv('fc-full'), estado: gv('fc-estado'), zona: gv('fc-zona'), descripcion: gv('fc-desc'), operaciones: gv('fc-ops'), personasVinculadas: gv('fc-pers').split(',').map(s => s.trim()).filter(Boolean) });
  updCounts(); closeModal(); nav(page);
}
function saveCartel(id) {
  const n = gv('fc-nombre'); if (!n) return;
  const i = DB.carteles.findIndex(x => x.id === id); if (i < 0) return;
  Object.assign(DB.carteles[i], { nombre: n, nombreCompleto: gv('fc-full'), estado: gv('fc-estado'), zona: gv('fc-zona'), descripcion: gv('fc-desc'), operaciones: gv('fc-ops'), personasVinculadas: gv('fc-pers').split(',').map(s => s.trim()).filter(Boolean) });
  updCounts(); closeModal(); nav('c-det', id);
}
function delCartel(id) { DB.carteles = DB.carteles.filter(x => x.id !== id); updCounts(); closeModal(); nav('carteles'); }
