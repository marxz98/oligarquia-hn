// ═══ RENDER — Dashboard ═══
function rDash(c) {
  const al = DB.personas.filter(p => p.alertasLegales);
  const sp = DB.personas.filter(p => p.esSocioPrincipal);
  const stats = [
    {v:DB.personas.length,l:'PERSONAS',c:'var(--red)',p:'personas'},{v:DB.grupos.length,l:'GRUPOS',c:'var(--pink)',p:'grupos'},
    {v:DB.empresas.length,l:'EMPRESAS',c:'var(--amb)',p:'empresas'},{v:DB.bancos.length,l:'BANCOS',c:'#f97316',p:'bancos'},
    {v:DB.medios.length,l:'MEDIOS',c:'var(--cyan)',p:'medios'},{v:DB.carteles.length,l:'CARTELES',c:'var(--pur)',p:'carteles'},
    {v:DB.zedes.length,l:'ZEDEs',c:'#dc2626',p:'zedes'},{v:DB.casos.length,l:'CASOS',c:'#3b82f6',p:'casos'},
    {v:DB.investigaciones.length,l:'INVESTIG.',c:'#8b5cf6',p:'investigaciones'},{v:al.length,l:'ALERTAS',c:'#f87171',p:'personas'}
  ];
  c.innerHTML = `<div class="sh"><div><h2>Radiografía del Poder</h2><p>Base de datos ciudadana — Conectada a PostgreSQL en tiempo real</p></div></div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:6px;margin-bottom:16px">
    ${stats.map(s => `<div class="card" onclick="nav('${s.p}')" style="text-align:center;padding:12px">
      <div style="font-size:28px;font-weight:700;font-family:var(--fd);color:${s.c}">${s.v}</div>
      <div style="font-size:9px;color:var(--t4);letter-spacing:2px;margin-top:2px">${s.l}</div></div>`).join('')}</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
    <div><h3 style="font-family:var(--fd);font-size:12px;color:var(--red);letter-spacing:2px;margin-bottom:10px">🚨 ALERTAS LEGALES</h3>
    ${al.slice(0,6).map(p => `<div class="card" style="margin-bottom:5px" onclick="nav('p-det',${p.id})"><div class="pcard">${av(p.nombre,GC[p.grupo],42)}
      <div class="pinfo"><div class="pname">${esc(p.nombre)}</div><div class="psub">${esc(p.grupo||'')}</div>
      <div class="pdesc" style="color:var(--red)">${esc(p.alertasLegales)}</div></div></div></div>`).join('')}</div>
    <div><h3 style="font-family:var(--fd);font-size:12px;color:var(--amb);letter-spacing:2px;margin-bottom:10px">⭐ SOCIOS PRINCIPALES (SAR)</h3>
    ${sp.slice(0,6).map(p => `<div class="card" style="margin-bottom:5px" onclick="nav('p-det',${p.id})"><div class="pcard">${av(p.nombre,GC[p.grupo],42)}
      <div class="pinfo"><div class="pname">${esc(p.nombre)}</div><div class="psub">${esc(p.grupo||'')} · ${esc(p.estado||'')}</div>
      <div class="pdesc">${esc(p.rol||'')}</div></div></div></div>`).join('')}</div></div>
    <h3 style="font-family:var(--fd);font-size:12px;color:var(--amb);letter-spacing:2px;margin:20px 0 10px">🏢 GRUPOS FAMILIARES / ECONÓMICOS</h3>
    <div class="grid g4">${DB.grupos.filter(g=>g.nombre!=='OTROS').map(g => {const co=GC[g.nombre]||'#6b7280';
      return `<div class="card" onclick="nav('g-det','${g.nombre}')" style="border-left:2px solid ${co}40">
      <div style="font-family:var(--fd);font-size:13px;color:${co};margin-bottom:3px">${esc(g.nombre)}</div>
      <div style="font-size:10px;color:var(--t3)"><strong style="color:var(--t2)">${g.numPersonas}</strong> personas · <strong style="color:var(--t2)">${g.numEmpresas}</strong> empresas</div>
      ${g.rankingPoder?`<div style="font-size:8px;color:var(--amb);margin-top:3px">⭐ Ranking SAR #${g.rankingPoder}</div>`:''}
      ${g.origenCapital==='Internacional'?`<div style="font-size:8px;color:var(--cyan);margin-top:2px">🌐 ${esc(g.paisOrigen||'Internacional')}</div>`:''}
      </div>`}).join('')}</div>`;
}
