// ═══ RENDER — ZEDEs ═══
function rZedes(c) {
  c.innerHTML = `<div class="sh"><div><h2>Zonas de Empleo y Desarrollo Económico</h2><p>Soberanía comprometida — ${DB.zedes.length} ZEDEs documentadas</p></div></div>
    <div class="note" style="background:var(--s2);border-left:3px solid var(--red);padding:14px 18px;border-radius:0 6px 6px 0;margin-bottom:16px;font-size:12px;line-height:1.7;color:var(--t2)">
      <strong style="color:var(--red)">⚠ Contexto:</strong> Las ZEDEs fueron creadas en 2013 bajo Juan Orlando Hernández (hoy condenado por narcotráfico e indultado por Trump). 
      Permiten a empresas privadas crear jurisdicciones semi-autónomas con sus propias leyes, impuestos y tribunales. 
      Derogadas por Xiomara Castro en 2022, pero siguen operando. Próspera demandó a Honduras por $10.7 mil millones ante el CIADI.
    </div>
    <div class="grid g2">${DB.zedes.map(z => `
      <div class="card" onclick="nav('z-det',${z.id})" style="border-left:3px solid var(--red)">
        <div class="pcard">
          ${av(z.nombre,'#dc2626',58)}
          <div class="pinfo">
            <div class="pname" style="color:var(--red)">${esc(z.nombre)}</div>
            <div class="psub">${esc(z.ubicacion||'')} · ${z.anio_creacion||''}</div>
            <div class="bx" style="margin-top:4px">
              <span class="b" style="background:#ef444415;color:var(--red);border-color:#ef444430">${esc(z.estado_legal||'')}</span>
              ${z.monto_demanda_usd?`<span class="b" style="background:#f59e0b15;color:var(--amb);border-color:#f59e0b30">DEMANDA $${(z.monto_demanda_usd/1000000000).toFixed(1)}B</span>`:''}
            </div>
            <div class="pdesc" style="margin-top:4px">${esc(z.descripcion||'')}</div>
            ${z.inversionistas?`<div style="font-size:9px;color:var(--pur);margin-top:4px">💰 ${esc(z.inversionistas)}</div>`:''}
          </div>
        </div>
      </div>`).join('')}
    </div>`;
}

function rZDet(c, id) {
  const z = DB.zedes.find(x => x.id === id); if (!z) return;
  c.innerHTML = `<div class="pbk" onclick="nav('zedes')">← ZEDEs</div>
    <div class="phero" style="border-left:4px solid var(--red)">
      ${av(z.nombre,'#dc2626',84)}
      <div style="flex:1">
        <div class="phn" style="color:var(--red)">${esc(z.nombre)}</div>
        <div class="psub">${esc(z.ubicacion||'')} · Creada ${z.anio_creacion||''}</div>
        <div class="bx" style="margin-top:6px">
          <span class="b" style="background:#ef444415;color:var(--red);border-color:#ef444430">${esc(z.estado_legal||'')}</span>
          ${z.monto_demanda_usd?`<span class="b" style="background:#f59e0b15;color:var(--amb);border-color:#f59e0b30">DEMANDA $${(z.monto_demanda_usd/1000000000).toFixed(1)}B USD</span>`:''}
        </div>
      </div>
    </div>
    ${z.empresa_operadora?`<div class="ds"><h4>EMPRESA OPERADORA</h4><div class="df">${esc(z.empresa_operadora)}${z.ceo?' — CEO: '+esc(z.ceo):''}</div></div>`:''}
    ${z.descripcion?`<div class="ds"><h4>DESCRIPCIÓN</h4><div class="df">${esc(z.descripcion)}</div></div>`:''}
    ${z.inversionistas?`<div class="ds"><h4>💰 INVERSIONISTAS</h4><div class="df dg">${esc(z.inversionistas)}</div></div>`:''}
    ${z.marco_legal?`<div class="ds"><h4>⚖ MARCO LEGAL</h4><div class="df wa">${esc(z.marco_legal)}</div></div>`:''}
    ${z.notas?`<div class="ds"><h4>NOTAS</h4><div class="df">${esc(z.notas)}</div></div>`:''}`;
}
