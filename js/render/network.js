// ═══════════════════════════════════════════════════════════
// RENDER — Network Graph (D3 force simulation)
// ═══════════════════════════════════════════════════════════

function rNet(c) {
  c.innerHTML = '<div id="network-container"><svg id="network-svg"></svg></div>';
  setTimeout(bNet, 100);
}

function bNet() {
  const svg = d3.select('#network-svg');
  svg.selectAll('*').remove();
  const el = svg.node().parentElement;
  const w = el.clientWidth, h = el.clientHeight;
  svg.attr('width', w).attr('height', h);

  // ── Build nodes ──
  const nodes = [];
  DB.grupos.forEach(g => {
    if (g.nombre === 'OTROS') return;
    const ms = DB.personas.filter(p => p.grupo === g.nombre);
    nodes.push({ id: 'g:' + g.nombre, label: g.nombre, type: 'grupo', color: GC[g.nombre] || '#6b7280', size: 16 + ms.length * 1.5, count: ms.length });
  });
  DB.partidos.forEach(p => {
    nodes.push({ id: 'p:' + p.id, label: p.siglas, type: 'partido', color: p.color, size: 22, count: p.personasVinculadas.length });
  });
  DB.carteles.forEach(ct => {
    nodes.push({ id: 'c:' + ct.id, label: ct.nombre, type: 'cartel', color: '#8b5cf6', size: 18, count: ct.personasVinculadas.length });
  });
  DB.medios.filter((_, i) => i < 8).forEach(m => {
    nodes.push({ id: 'm:' + m.id, label: m.nombre.split('–')[0].trim().substring(0, 15), type: 'medio', color: '#06b6d4', size: 14, count: 0 });
  });

  // ── Build links ──
  const links = [];

  // Grupo ↔ Partido
  DB.partidos.forEach(p => {
    DB.grupos.forEach(g => {
      if (g.nombre === 'OTROS') return;
      const ms = DB.personas.filter(x => x.grupo === g.nombre);
      const l = ms.filter(x => p.personasVinculadas.includes(x.nombre)).length;
      if (l) links.push({ source: 'g:' + g.nombre, target: 'p:' + p.id, weight: l, type: 'pol' });
    });
  });

  // Grupo ↔ Cartel
  DB.carteles.forEach(ct => {
    DB.grupos.forEach(g => {
      if (g.nombre === 'OTROS') return;
      const ms = DB.personas.filter(x => x.grupo === g.nombre);
      const l = ms.filter(x => x.narcotrafico).length;
      if (l) links.push({ source: 'g:' + g.nombre, target: 'c:' + ct.id, weight: l, type: 'nar' });
    });
  });

  // Grupo ↔ Medio
  DB.medios.filter((_, i) => i < 8).forEach(m => {
    if (m.grupoControlador) {
      DB.grupos.forEach(g => {
        if (g.nombre !== 'OTROS' && m.grupoControlador.includes(g.nombre)) {
          links.push({ source: 'g:' + g.nombre, target: 'm:' + m.id, weight: 2, type: 'med' });
        }
      });
    }
  });

  // Inter-grupo (shared empresas)
  DB.empresas.forEach(e => {
    if (e.grupoControlador && e.grupoControlador.includes('/')) {
      const ps = e.grupoControlador.split('/').map(s => s.trim());
      for (let i = 0; i < ps.length; i++) {
        for (let j = i + 1; j < ps.length; j++) {
          const a = nodes.find(n => n.id === 'g:' + ps[i]);
          const b = nodes.find(n => n.id === 'g:' + ps[j]);
          if (a && b && !links.find(l =>
            (l.source === a.id && l.target === b.id) || (l.source === b.id && l.target === a.id)
          )) {
            links.push({ source: a.id, target: b.id, weight: 2, type: 'emp' });
          }
        }
      }
    }
  });

  // ── Links from vinculos table ──
  DB.vinculos.forEach(v => {
    function getNodeId(tipo, id) {
      if (tipo === 'persona') {
        const p = DB.personas.find(x => x.id === id);
        return p && p.grupo ? 'g:' + p.grupo : null;
      }
      if (tipo === 'partido') return 'p:' + id;
      if (tipo === 'cartel') return 'c:' + id;
      if (tipo === 'medio') return 'm:' + id;
      if (tipo === 'empresa') {
        const e = DB.empresas.find(x => x.id === id);
        return e && e.grupoControlador ? 'g:' + e.grupoControlador : null;
      }
      if (tipo === 'grupo') {
        const g = DB.grupos.find(x => x.id === id);
        return g ? 'g:' + g.nombre : null;
      }
      return null;
    }

    const sourceId = getNodeId(v.entidad_a_tipo, v.entidad_a_id);
    const targetId = getNodeId(v.entidad_b_tipo, v.entidad_b_id);

    if (sourceId && targetId && sourceId !== targetId) {
      if (!links.find(l =>
        (l.source === sourceId && l.target === targetId) ||
        (l.source === targetId && l.target === sourceId)
      )) {
        const typeMap = {
          Familiar: 'fam', Conyugal: 'fam', Empresarial: 'emp',
          Politico: 'pol', Criminal: 'nar', Mediatico: 'med',
          Institucional: 'pol', Financiero: 'emp', Legal: 'pol', Otro: 'emp'
        };
        links.push({
          source: sourceId, target: targetId,
          weight: 2, type: typeMap[v.tipo_vinculo] || 'emp'
        });
      }
    }
  });

  // ── SVG setup ──
  const defs = svg.append('defs');
  const glow = defs.append('filter').attr('id', 'glow');
  glow.append('feGaussianBlur').attr('stdDeviation', '3').attr('result', 'b');
  const mg = glow.append('feMerge');
  mg.append('feMergeNode').attr('in', 'b');
  mg.append('feMergeNode').attr('in', 'SourceGraphic');

  const g = svg.append('g');
  svg.call(d3.zoom().scaleExtent([0.2, 5]).on('zoom', e => g.attr('transform', e.transform)));

  // ── Simulation ──
  if (sim) sim.stop();
  sim = d3.forceSimulation(nodes)
    .force('link', d3.forceLink(links).id(d => d.id).distance(130).strength(d => d.weight * 0.04))
    .force('charge', d3.forceManyBody().strength(-500))
    .force('center', d3.forceCenter(w / 2, h / 2))
    .force('collision', d3.forceCollide().radius(d => d.size + 8));

  const lc = { pol: '#3b82f620', nar: '#8b5cf630', med: '#06b6d420', emp: '#ffffff10', fam: '#ec489920' };
  const link = g.append('g').selectAll('line').data(links).enter().append('line')
    .attr('stroke', d => lc[d.type] || '#ffffff10')
    .attr('stroke-width', d => Math.max(1, d.weight * 0.7));

  const node = g.append('g').selectAll('g').data(nodes).enter().append('g')
    .style('cursor', 'pointer')
    .on('click', (e, d) => {
      const t = { grupo: 'g-det', partido: 'pt-det', cartel: 'c-det', medio: 'm-det' };
      nav(t[d.type], d.type === 'grupo' ? d.label : d.id.split(':')[1]);
    })
    .on('mouseenter', (e, d) => {
      const tt = document.getElementById('tooltip');
      tt.style.display = 'block';
      tt.style.left = (e.clientX + 12) + 'px';
      tt.style.top = (e.clientY - 8) + 'px';
      const types = { grupo: 'Grupo Familiar', partido: 'Partido', cartel: 'Cartel', medio: 'Medio' };
      tt.innerHTML = `<div style="font-family:var(--fd);font-size:13px;color:var(--t1)">${d.label}</div>
        <div style="font-size:9px;color:var(--red);margin-top:2px">${types[d.type] || ''}</div>
        ${d.count ? `<div style="font-size:9px;color:var(--t3);margin-top:2px">${d.count} personas</div>` : ''}`;
    })
    .on('mousemove', (e) => {
      const tt = document.getElementById('tooltip');
      tt.style.left = (e.clientX + 12) + 'px';
      tt.style.top = (e.clientY - 8) + 'px';
    })
    .on('mouseleave', () => document.getElementById('tooltip').style.display = 'none')
    .call(d3.drag()
      .on('start', (e, d) => { if (!e.active) sim.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y; })
      .on('drag', (e, d) => { d.fx = e.x; d.fy = e.y; })
      .on('end', (e, d) => { if (!e.active) sim.alphaTarget(0); d.fx = null; d.fy = null; })
    );

  // ── Draw shapes by type ──
  node.each(function (d) {
    const el = d3.select(this);
    if (d.type === 'partido') {
      el.append('rect').attr('x', -d.size).attr('y', -d.size).attr('width', d.size * 2).attr('height', d.size * 2)
        .attr('rx', 4).attr('fill', d.color + '18').attr('stroke', d.color).attr('stroke-width', 1.5).attr('filter', 'url(#glow)');
    } else if (d.type === 'cartel') {
      const s = d.size;
      el.append('polygon').attr('points', `0,${-s} ${s * .87},${s * .5} ${-s * .87},${s * .5}`)
        .attr('fill', d.color + '18').attr('stroke', d.color).attr('stroke-width', 1.5).attr('filter', 'url(#glow)');
    } else {
      el.append('circle').attr('r', d.size).attr('fill', d.color + '15').attr('stroke', d.color)
        .attr('stroke-width', 1.5).attr('filter', 'url(#glow)');
      if (d.type === 'grupo') {
        el.append('circle').attr('r', d.size + 5).attr('fill', 'none')
          .attr('stroke', d.color + '20').attr('stroke-width', 1).attr('stroke-dasharray', '3,3');
      }
    }
  });

  // ── Labels ──
  node.append('text')
    .text(d => d.type === 'grupo' ? d.count : d.label.substring(0, 3))
    .attr('text-anchor', 'middle').attr('dy', 4)
    .attr('font-size', d => d.type === 'grupo' ? '12px' : '8px')
    .attr('fill', '#fff').attr('font-family', 'Space Mono').attr('font-weight', '700');

  node.append('text')
    .text(d => d.label.length > 13 ? d.label.substring(0, 11) + '…' : d.label)
    .attr('text-anchor', 'middle').attr('dy', d => d.size + 13)
    .attr('font-size', '8px').attr('fill', '#bbb').attr('font-family', 'IBM Plex Mono');

  // ── Tick ──
  sim.on('tick', () => {
    link.attr('x1', d => d.source.x).attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x).attr('y2', d => d.target.y);
    node.attr('transform', d => `translate(${d.x},${d.y})`);
  });

  // ── Legend ──
  const lg = svg.append('g').attr('transform', 'translate(14,14)');
  [
    { l: 'Grupo Familiar', s: '●', c: '#60a5fa' },
    { l: 'Partido Político', s: '■', c: '#3b82f6' },
    { l: 'Cartel', s: '▲', c: '#8b5cf6' },
    { l: 'Medio', s: '●', c: '#06b6d4' }
  ].forEach((x, i) => {
    lg.append('text').text(x.s).attr('x', 0).attr('y', i * 14).attr('fill', x.c).attr('font-size', '9px');
    lg.append('text').text(x.l).attr('x', 12).attr('y', i * 14 + 1).attr('fill', '#777').attr('font-size', '7px').attr('font-family', 'IBM Plex Mono');
  });
}
