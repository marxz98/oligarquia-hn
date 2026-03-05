// ═══════════════════════════════════════════════════════════
// MODALS — Modal system + CRUD with Supabase persistence
// ═══════════════════════════════════════════════════════════

function showModal(type, data) {
  const body = document.getElementById('modal-body');
  const G = { login:mLogin, addPersona:mAddPersona, editPersona:mEditPersona,
    addGrupo:mAddGrupo, editGrupo:mEditGrupo, addEmpresa:mAddEmpresa, editEmpresa:mEditEmpresa,
    addMedio:mAddMedio, editMedio:mEditMedio, addCartel:mAddCartel, editCartel:mEditCartel };
  if (G[type]) body.innerHTML = G[type](data);
  document.getElementById('modal').classList.add('open');
}
function closeModal() { document.getElementById('modal').classList.remove('open'); }

function mLogin() {
  return `<div style="text-align:center">
    <div style="font-size:28px;margin-bottom:4px">${ICONS.lock}</div><h3 style="justify-content:center">ACCESO RESTRINGIDO</h3>
    <div id="lerr" class="hidden" style="color:var(--red);font-size:10px;margin-bottom:6px"></div>
    <input id="lu" type="email" placeholder="Email"><input id="lp" type="password" placeholder="Contraseña" onkeydown="if(event.key==='Enter')doLogin()">
    <button class="sbm" onclick="doLogin()">INGRESAR</button><button class="cnc" onclick="closeModal()">Cancelar</button></div>`;
}

function grupoOpts() {
  const all = [...new Set(DB.grupos.map(g => g.nombre).filter(Boolean))].sort();
  return ['', ...all].map(g => `<option value="${esc(g)}">${esc(g || '— Seleccionar —')}</option>`).join('');
}
function grupoIdByName(name) { const g = DB.grupos.find(x => x.nombre === name); return g ? g.id : null; }
function partidoOpts() {
  return ['', ...DB.partidos.map(p => p.nombre)].map(p => `<option value="${esc(p)}">${esc(p || '— Ninguno —')}</option>`).join('');
}
function setS(id, val) { return val ? `<script>document.getElementById('${id}').value='${esc(val)}'<\/script>` : ''; }

// ═══ PERSONA ═══
function pFields(p) {
  p = p || {};
  return `<label>NOMBRE COMPLETO *</label><input id="fp-nombre" value="${esc(p.nombre||'')}">
  <div class="r2"><div><label>GRUPO FAMILIAR</label><select id="fp-grupo">${grupoOpts()}</select></div>
  <div><label>ESTADO</label><select id="fp-estado"><option ${p.estado==='Vivo'?'selected':''}>Vivo</option><option ${p.estado==='QDDG'?'selected':''}>QDDG</option><option ${p.estado==='Detenido'?'selected':''}>Detenido</option><option ${p.estado==='Prófugo'?'selected':''}>Prófugo</option><option ${p.estado==='Extraditado'?'selected':''}>Extraditado</option><option ${p.estado==='Indultado'?'selected':''}>Indultado</option></select></div></div>
  <label>ROL</label><input id="fp-rol" value="${esc(p.rol||'')}">
  <div class="r2"><div><label>DNI</label><input id="fp-dni" value="${esc(p.dni||'')}"></div><div><label>NACIONALIDAD</label><input id="fp-nac" value="${esc(p.nacionalidad||'Hondureña')}"></div></div>
  <label>GOLPE 2009</label><input id="fp-golpe" value="${esc(p.golpe2009||'')}">
  <label>ALERTAS LEGALES</label><textarea id="fp-alert">${esc(p.alertasLegales||'')}</textarea>
  <label>NOTAS</label><textarea id="fp-notas">${esc(p.notas||'')}</textarea>`;
}
function mAddPersona(grupoPreset) {
  return `<h3>NUEVA PERSONA <button onclick="closeModal()">✕</button></h3>${pFields()}
  <button class="sbm" onclick="submitPersona()">REGISTRAR</button><button class="cnc" onclick="closeModal()">Cancelar</button>${setS('fp-grupo',grupoPreset)}`;
}
function mEditPersona(id) {
  const p = DB.personas.find(x => x.id === id); if (!p) return '';
  return `<h3>EDITAR PERSONA <button onclick="closeModal()">✕</button></h3>${pFields(p)}
  <button class="sbm" onclick="savePersona(${id})">GUARDAR</button>
  <button class="del-btn" onclick="if(confirm('¿Eliminar?'))delPersona(${id})">🗑 ELIMINAR</button>
  <button class="cnc" onclick="closeModal()">Cancelar</button>${setS('fp-grupo',p.grupo)}`;
}
function readPForm() {
  const n = gv('fp-nombre'); if (!n) { alert('Nombre obligatorio'); return null; }
  return { nombre:n, grupo_id:grupoIdByName(gv('fp-grupo')), estado:gv('fp-estado')||null,
    rol:gv('fp-rol')||null, dni:gv('fp-dni')||null, nacionalidad:gv('fp-nac')||'Hondureña',
    golpe_2009:gv('fp-golpe')||null, alertas_legales:gv('fp-alert')||null, notas:gv('fp-notas')||null };
}
async function submitPersona() {
  const row = readPForm(); if (!row) return;
  const { data, error } = await sb.from('personas').insert(row).select().single();
  if (error) { alert('Error: '+error.message); return; }
  DB.personas.push(mapPersona(data)); resolveRelations(); updCounts(); closeModal(); nav(page);
}
async function savePersona(id) {
  const row = readPForm(); if (!row) return;
  const { data, error } = await sb.from('personas').update(row).eq('id',id).select().single();
  if (error) { alert('Error: '+error.message); return; }
  const i = DB.personas.findIndex(x => x.id===id); if (i>=0) DB.personas[i] = mapPersona(data);
  resolveRelations(); updCounts(); closeModal(); nav('p-det',id);
}
async function delPersona(id) {
  const { error } = await sb.from('personas').delete().eq('id',id);
  if (error) { alert('Error: '+error.message); return; }
  DB.personas = DB.personas.filter(x => x.id!==id); resolveRelations(); updCounts(); closeModal(); nav('personas');
}

// ═══ GRUPO ═══
function mAddGrupo() {
  return `<h3>NUEVO GRUPO <button onclick="closeModal()">✕</button></h3>
  <label>NOMBRE *</label><input id="fg-nombre"><label>ORIGEN CAPITAL</label><select id="fg-origen"><option>Nacional</option><option>Internacional</option><option>Mixto</option></select>
  <label>ACTIVIDAD PRINCIPAL</label><input id="fg-act"><label>DESCRIPCIÓN</label><textarea id="fg-desc"></textarea>
  <label>COLOR</label><input id="fg-color" value="#6b7280">
  <button class="sbm" onclick="submitGrupo()">CREAR</button><button class="cnc" onclick="closeModal()">Cancelar</button>`;
}
function mEditGrupo(nombre) {
  const g = DB.grupos.find(x => x.nombre===nombre); if (!g) return '';
  return `<h3>EDITAR GRUPO <button onclick="closeModal()">✕</button></h3>
  <label>NOMBRE *</label><input id="fg-nombre" value="${esc(g.nombre)}">
  <label>ORIGEN</label><select id="fg-origen"><option ${g.origenCapital==='Nacional'?'selected':''}>Nacional</option><option ${g.origenCapital==='Internacional'?'selected':''}>Internacional</option><option ${g.origenCapital==='Mixto'?'selected':''}>Mixto</option></select>
  <label>ACTIVIDAD PRINCIPAL</label><input id="fg-act" value="${esc(g.actividadPrincipal||'')}">
  <label>DESCRIPCIÓN</label><textarea id="fg-desc">${esc(g.descripcion||'')}</textarea>
  <label>EJES DE ACUMULACIÓN</label><textarea id="fg-ejes">${esc(g.ejesAcumulacion||'')}</textarea>
  <label>COLOR</label><input id="fg-color" value="${esc(g.color||'#6b7280')}">
  <button class="sbm" onclick="saveGrupo(${g.id},'${esc(g.nombre)}')">GUARDAR</button>
  <button class="del-btn" onclick="if(confirm('¿Eliminar?'))delGrupo(${g.id})">🗑 ELIMINAR</button>
  <button class="cnc" onclick="closeModal()">Cancelar</button>`;
}
async function submitGrupo() {
  const n = gv('fg-nombre'); if (!n) return alert('Nombre obligatorio');
  const row = { nombre:n, origen_capital:gv('fg-origen'), actividad_principal:gv('fg-act')||null, descripcion:gv('fg-desc')||null, color:gv('fg-color')||null };
  const { data, error } = await sb.from('grupos').insert(row).select().single();
  if (error) { alert('Error: '+error.message); return; }
  DB.grupos.push(mapGrupo(data)); GC[n] = row.color||'#6b7280'; updCounts(); closeModal(); nav('grupos');
}
async function saveGrupo(id, oldName) {
  const n = gv('fg-nombre'); if (!n) return;
  const row = { nombre:n, origen_capital:gv('fg-origen'), actividad_principal:gv('fg-act')||null, descripcion:gv('fg-desc')||null, ejes_acumulacion:gv('fg-ejes')||null, color:gv('fg-color')||null };
  const { error } = await sb.from('grupos').update(row).eq('id',id);
  if (error) { alert('Error: '+error.message); return; }
  const i = DB.grupos.findIndex(x => x.id===id); if (i>=0) Object.assign(DB.grupos[i], { nombre:n, origenCapital:row.origen_capital, actividadPrincipal:row.actividad_principal, descripcion:row.descripcion, ejesAcumulacion:row.ejes_acumulacion, color:row.color });
  if (n !== oldName) { DB.personas.forEach(p => { if (p.grupo===oldName) p.grupo=n; }); GC[n]=GC[oldName]; delete GC[oldName]; }
  resolveRelations(); updCounts(); closeModal(); nav('g-det',n);
}
async function delGrupo(id) {
  const { error } = await sb.from('grupos').delete().eq('id',id);
  if (error) { alert('Error: '+error.message); return; }
  DB.grupos = DB.grupos.filter(x => x.id!==id); resolveRelations(); updCounts(); closeModal(); nav('grupos');
}

// ═══ EMPRESA ═══
function mAddEmpresa(preset) {
  return `<h3>NUEVA EMPRESA <button onclick="closeModal()">✕</button></h3>
  <label>NOMBRE *</label><input id="fe-nombre"><label>RAZÓN SOCIAL</label><input id="fe-razon">
  <div class="r2"><div><label>GRUPO</label><select id="fe-grupo">${grupoOpts()}</select></div><div><label>AÑO CONSTITUCIÓN</label><input id="fe-anio" type="number"></div></div>
  <label>ACTIVIDAD ECONÓMICA</label><input id="fe-act"><label>NOTAS</label><textarea id="fe-notas"></textarea>
  <button class="sbm" onclick="submitEmpresa()">REGISTRAR</button><button class="cnc" onclick="closeModal()">Cancelar</button>${setS('fe-grupo',preset)}`;
}
function mEditEmpresa(id) {
  const e = DB.empresas.find(x => x.id===id); if (!e) return '';
  return `<h3>EDITAR EMPRESA <button onclick="closeModal()">✕</button></h3>
  <label>NOMBRE *</label><input id="fe-nombre" value="${esc(e.nombre)}"><label>RAZÓN SOCIAL</label><input id="fe-razon" value="${esc(e.razonSocial||'')}">
  <div class="r2"><div><label>GRUPO</label><select id="fe-grupo">${grupoOpts()}</select></div><div><label>AÑO</label><input id="fe-anio" type="number" value="${e.anioConstitucion||''}"></div></div>
  <label>ACTIVIDAD ECONÓMICA</label><input id="fe-act" value="${esc(e.actividadEconomica||'')}"><label>NOTAS</label><textarea id="fe-notas">${esc(e.notas||'')}</textarea>
  <button class="sbm" onclick="saveEmpresa(${id})">GUARDAR</button>
  <button class="del-btn" onclick="if(confirm('¿Eliminar?'))delEmpresa(${id})">🗑 ELIMINAR</button>
  <button class="cnc" onclick="closeModal()">Cancelar</button>${setS('fe-grupo',e.grupoControlador)}`;
}
async function submitEmpresa() {
  const n = gv('fe-nombre'); if (!n) return alert('Nombre obligatorio');
  const row = { nombre:n, razon_social:gv('fe-razon')||null, grupo_id:grupoIdByName(gv('fe-grupo')), anio_constitucion:parseInt(gv('fe-anio'))||null, actividad_economica:gv('fe-act')||null, notas:gv('fe-notas')||null };
  const { data, error } = await sb.from('empresas').insert(row).select().single();
  if (error) { alert('Error: '+error.message); return; }
  DB.empresas.push(mapEmpresa(data)); resolveRelations(); updCounts(); closeModal(); nav(page);
}
async function saveEmpresa(id) {
  const n = gv('fe-nombre'); if (!n) return;
  const row = { nombre:n, razon_social:gv('fe-razon')||null, grupo_id:grupoIdByName(gv('fe-grupo')), anio_constitucion:parseInt(gv('fe-anio'))||null, actividad_economica:gv('fe-act')||null, notas:gv('fe-notas')||null };
  const { error } = await sb.from('empresas').update(row).eq('id',id);
  if (error) { alert('Error: '+error.message); return; }
  const i = DB.empresas.findIndex(x => x.id===id); if (i>=0) { DB.empresas[i] = { ...DB.empresas[i], nombre:n, razonSocial:row.razon_social, grupoId:row.grupo_id, anioConstitucion:row.anio_constitucion, actividadEconomica:row.actividad_economica, notas:row.notas }; }
  resolveRelations(); updCounts(); closeModal(); nav('e-det',id);
}
async function delEmpresa(id) {
  const { error } = await sb.from('empresas').delete().eq('id',id);
  if (error) { alert('Error: '+error.message); return; }
  DB.empresas = DB.empresas.filter(x => x.id!==id); resolveRelations(); updCounts(); closeModal(); nav('empresas');
}

// ═══ MEDIO ═══
function mAddMedio() {
  return `<h3>NUEVO MEDIO <button onclick="closeModal()">✕</button></h3>
  <label>NOMBRE *</label><input id="fm-nombre"><div class="r2"><div><label>CANAL</label><input id="fm-canal"></div><div><label>GRUPO</label><select id="fm-grupo">${grupoOpts()}</select></div></div>
  <label>FUNDADOR</label><input id="fm-fund"><label>DESCRIPCIÓN</label><textarea id="fm-desc"></textarea>
  <button class="sbm" onclick="submitMedio()">REGISTRAR</button><button class="cnc" onclick="closeModal()">Cancelar</button>`;
}
function mEditMedio(id) {
  const m = DB.medios.find(x => x.id===id); if (!m) return '';
  return `<h3>EDITAR MEDIO <button onclick="closeModal()">✕</button></h3>
  <label>NOMBRE *</label><input id="fm-nombre" value="${esc(m.nombre)}"><div class="r2"><div><label>CANAL</label><input id="fm-canal" value="${esc(m.canal||'')}"></div><div><label>GRUPO</label><select id="fm-grupo">${grupoOpts()}</select></div></div>
  <label>FUNDADOR</label><input id="fm-fund" value="${esc(m.fundador||'')}"><label>DESCRIPCIÓN</label><textarea id="fm-desc">${esc(m.descripcion||'')}</textarea>
  <button class="sbm" onclick="saveMedio(${m.id})">GUARDAR</button>
  <button class="del-btn" onclick="if(confirm('¿Eliminar?'))delMedio(${m.id})">🗑 ELIMINAR</button>
  <button class="cnc" onclick="closeModal()">Cancelar</button>${setS('fm-grupo',m.grupoControlador)}`;
}
async function submitMedio() {
  const n = gv('fm-nombre'); if (!n) return alert('Nombre obligatorio');
  const row = { nombre:n, canal:gv('fm-canal')||null, grupo_id:grupoIdByName(gv('fm-grupo')), fundador:gv('fm-fund')||null, descripcion:gv('fm-desc')||null };
  const { data, error } = await sb.from('medios').insert(row).select().single();
  if (error) { alert('Error: '+error.message); return; }
  DB.medios.push(mapMedio(data)); resolveRelations(); updCounts(); closeModal(); nav(page);
}
async function saveMedio(id) {
  const n = gv('fm-nombre'); if (!n) return;
  const row = { nombre:n, canal:gv('fm-canal')||null, grupo_id:grupoIdByName(gv('fm-grupo')), fundador:gv('fm-fund')||null, descripcion:gv('fm-desc')||null };
  const { error } = await sb.from('medios').update(row).eq('id',id);
  if (error) { alert('Error: '+error.message); return; }
  const i = DB.medios.findIndex(x => x.id===id); if (i>=0) Object.assign(DB.medios[i], { nombre:n, canal:row.canal, grupoId:row.grupo_id, fundador:row.fundador, descripcion:row.descripcion });
  resolveRelations(); updCounts(); closeModal(); nav('m-det',id);
}
async function delMedio(id) {
  const { error } = await sb.from('medios').delete().eq('id',id);
  if (error) { alert('Error: '+error.message); return; }
  DB.medios = DB.medios.filter(x => x.id!==id); updCounts(); closeModal(); nav('medios');
}

// ═══ CARTEL ═══
function mAddCartel() {
  return `<h3>NUEVO CARTEL <button onclick="closeModal()">✕</button></h3>
  <label>NOMBRE *</label><input id="fc-nombre"><label>NOMBRE COMPLETO</label><input id="fc-full">
  <div class="r2"><div><label>ESTADO</label><select id="fc-estado"><option>Activo</option><option>Desmantelado parcialmente</option><option>Fragmentado</option><option>Desmantelado</option></select></div><div><label>ZONA</label><input id="fc-zona"></div></div>
  <label>DESCRIPCIÓN</label><textarea id="fc-desc"></textarea><label>OPERACIONES</label><textarea id="fc-ops"></textarea>
  <button class="sbm" onclick="submitCartel()">REGISTRAR</button><button class="cnc" onclick="closeModal()">Cancelar</button>`;
}
function mEditCartel(id) {
  const c = DB.carteles.find(x => x.id===id); if (!c) return '';
  return `<h3>EDITAR CARTEL <button onclick="closeModal()">✕</button></h3>
  <label>NOMBRE *</label><input id="fc-nombre" value="${esc(c.nombre)}"><label>NOMBRE COMPLETO</label><input id="fc-full" value="${esc(c.nombreCompleto||'')}">
  <div class="r2"><div><label>ESTADO</label><select id="fc-estado"><option ${c.estado==='Activo'?'selected':''}>Activo</option><option ${(c.estado||'').includes('parcial')?'selected':''}>Desmantelado parcialmente</option><option ${c.estado==='Fragmentado'?'selected':''}>Fragmentado</option><option ${c.estado==='Desmantelado'?'selected':''}>Desmantelado</option></select></div><div><label>ZONA</label><input id="fc-zona" value="${esc(c.zona||'')}"></div></div>
  <label>DESCRIPCIÓN</label><textarea id="fc-desc">${esc(c.descripcion||'')}</textarea><label>OPERACIONES</label><textarea id="fc-ops">${esc(c.operaciones||'')}</textarea>
  <button class="sbm" onclick="saveCartel('${c.id}')">GUARDAR</button>
  <button class="del-btn" onclick="if(confirm('¿Eliminar?'))delCartel('${c.id}')">🗑 ELIMINAR</button>
  <button class="cnc" onclick="closeModal()">Cancelar</button>`;
}
async function submitCartel() {
  const n = gv('fc-nombre'); if (!n) return alert('Nombre obligatorio');
  const id = n.toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'');
  const row = { id, nombre:n, nombre_completo:gv('fc-full')||null, zona:gv('fc-zona')||null, descripcion:gv('fc-desc')||null, operaciones:gv('fc-ops')||null };
  const { data, error } = await sb.from('carteles').insert(row).select().single();
  if (error) { alert('Error: '+error.message); return; }
  DB.carteles.push(mapCartel(data)); updCounts(); closeModal(); nav(page);
}
async function saveCartel(id) {
  const n = gv('fc-nombre'); if (!n) return;
  const row = { nombre:n, nombre_completo:gv('fc-full')||null, zona:gv('fc-zona')||null, descripcion:gv('fc-desc')||null, operaciones:gv('fc-ops')||null };
  const { error } = await sb.from('carteles').update(row).eq('id',id);
  if (error) { alert('Error: '+error.message); return; }
  const i = DB.carteles.findIndex(x => x.id===id); if (i>=0) Object.assign(DB.carteles[i], { nombre:n, nombreCompleto:row.nombre_completo, zona:row.zona, descripcion:row.descripcion, operaciones:row.operaciones });
  updCounts(); closeModal(); nav('c-det',id);
}
async function delCartel(id) {
  const { error } = await sb.from('carteles').delete().eq('id',id);
  if (error) { alert('Error: '+error.message); return; }
  DB.carteles = DB.carteles.filter(x => x.id!==id); updCounts(); closeModal(); nav('carteles');
}
