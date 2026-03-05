// ═══════════════════════════════════════════════════════════
// DATA — Loads all data from Supabase into DB object
// ═══════════════════════════════════════════════════════════

const DB = {
  personas: [], grupos: [], empresas: [], partidos: [],
  medios: [], carteles: [], instituciones: [], bancos: [],
  zedes: [], investigaciones: [], casos: [], categorias: [],
  datosGrupo: [], exoneraciones: []
};

function mapPersona(r) {
  return { id:r.id, nombre:r.nombre, grupo:null, grupoId:r.grupo_id,
    estado:r.estado, rol:r.rol, esSocioPrincipal:r.es_socio_principal,
    dni:r.dni, nacionalidad:r.nacionalidad,
    golpe2009:r.golpe_2009, alertasLegales:r.alertas_legales,
    notas:r.notas, fotoUrl:r.foto_url };
}
function mapEmpresa(r) {
  return { id:r.id, nombre:r.nombre, razonSocial:r.razon_social,
    grupoId:r.grupo_id, grupoControlador:null, sectorId:r.sector_id,
    actividadEconomica:r.actividad_economica, anioConstitucion:r.anio_constitucion,
    regimenFiscalId:r.regimen_fiscal_id, rtn:r.rtn, notas:r.notas, sector:null };
}
function mapGrupo(r) {
  return { id:r.id, nombre:r.nombre, nombreSar:r.nombre_sar,
    origenCapital:r.origen_capital, paisOrigen:r.pais_origen,
    rankingPoder:r.ranking_poder, actividadPrincipal:r.actividad_principal,
    descripcion:r.descripcion, ejesAcumulacion:r.ejes_acumulacion,
    color:r.color, numPersonas:0, numEmpresas:0, numNarco:0, numAlertas:0 };
}
function mapPartido(r) {
  return { id:r.id, nombre:r.nombre, siglas:r.siglas, fundado:r.fundado,
    ideologia:r.ideologia, color:r.color, descripcion:r.descripcion,
    personasVinculadas:[] };
}
function mapMedio(r) {
  return { id:r.id, nombre:r.nombre, tipoId:r.tipo_id, grupoId:r.grupo_id,
    grupoControlador:null, canal:r.canal, fundador:r.fundador,
    descripcion:r.descripcion, tipo:null, personasClave:[] };
}
function mapCartel(r) {
  return { id:r.id, nombre:r.nombre, nombreCompleto:r.nombre_completo,
    estadoId:r.estado_id, zona:r.zona, descripcion:r.descripcion,
    operaciones:r.operaciones, personasVinculadas:[], estado:null };
}

function resolveRelations() {
  const grupoMap = {};
  DB.grupos.forEach(g => { grupoMap[g.id] = g; });
  // Resolve grupo names on personas
  DB.personas.forEach(p => {
    if (p.grupoId && grupoMap[p.grupoId]) p.grupo = grupoMap[p.grupoId].nombre;
  });
  // Resolve grupo names on empresas
  DB.empresas.forEach(e => {
    if (e.grupoId && grupoMap[e.grupoId]) e.grupoControlador = grupoMap[e.grupoId].nombre;
  });
  // Resolve grupo names on medios
  DB.medios.forEach(m => {
    if (m.grupoId && grupoMap[m.grupoId]) m.grupoControlador = grupoMap[m.grupoId].nombre;
  });
  // Compute grupo stats
  DB.grupos.forEach(g => {
    const ms = DB.personas.filter(p => p.grupoId === g.id);
    const es = DB.empresas.filter(e => e.grupoId === g.id);
    g.numPersonas = ms.length;
    g.numEmpresas = es.length;
    g.numNarco = ms.filter(p => p.alertasLegales).length;
    g.numAlertas = ms.filter(p => p.alertasLegales).length;
    // Merge SAR financial data
    const fin = DB.datosGrupo.find(d => d.grupo_id === g.id);
    if (fin) {
      g.numEmpresas = fin.num_empresas || g.numEmpresas;
      g.empleadosIhss = fin.empleados_ihss;
      g.totalActivos = fin.total_activos_lempiras;
      g.pctPib = fin.pct_pib;
      g.calificacion = fin.calificacion;
    }
  });
}

async function loadAllData() {
  try {
    const [personas,grupos,empresas,partidos,medios,carteles,datosGrupo] = await Promise.all([
      supabase.from('personas').select('*').order('id'),
      supabase.from('grupos').select('*').order('id'),
      supabase.from('empresas').select('*').order('id'),
      supabase.from('partidos').select('*').order('id'),
      supabase.from('medios').select('*').order('id'),
      supabase.from('carteles').select('*').order('id'),
      supabase.from('datos_financieros_grupo').select('*').order('ranking')
    ]);
    for (const r of [personas,grupos,empresas,partidos,medios,carteles,datosGrupo]) {
      if (r.error) throw r.error;
    }
    DB.personas = personas.data.map(mapPersona);
    DB.grupos = grupos.data.map(mapGrupo);
    DB.empresas = empresas.data.map(mapEmpresa);
    DB.partidos = partidos.data.map(mapPartido);
    DB.medios = medios.data.map(mapMedio);
    DB.carteles = carteles.data.map(mapCartel);
    DB.datosGrupo = datosGrupo.data || [];

    // Load new entities (non-blocking)
    const [zedes,investigaciones,casos,instituciones,bancos] = await Promise.all([
      supabase.from('zedes').select('*').order('id'),
      supabase.from('investigaciones').select('*').order('id'),
      supabase.from('casos_judiciales').select('*').order('id'),
      supabase.from('instituciones').select('*').order('id'),
      supabase.from('bancos').select('*').order('id')
    ]);
    DB.zedes = (zedes.data || []);
    DB.investigaciones = (investigaciones.data || []);
    DB.casos = (casos.data || []);
    DB.instituciones = (instituciones.data || []);
    DB.bancos = (bancos.data || []);

    resolveRelations();
    console.log(`[DB] Cargado: ${DB.personas.length} personas, ${DB.grupos.length} grupos, ${DB.empresas.length} empresas, ${DB.zedes.length} zedes, ${DB.casos.length} casos`);
    return true;
  } catch (error) {
    console.error('[DB] Error:', error);
    return false;
  }
}
