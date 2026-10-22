import {escape} from '../shared/dom.mjs';

function graphSvg(input, frame, id, forest = false) {
  const nodes = Array.from({length: input.n}, (_, i) => i);
  const positions = new Map();
  let width = 660, height = 510;
  if (forest) {
    // Put every member in its own column, grouped by root. Depth exposes the
    // pointer rewiring during path compression without hiding isolated roots.
    const parents = new Map(frame.forestEdges || []);
    const order = (frame.groups || [nodes]).flat();
    const depths = new Map(nodes.map(node => {
      let current = node, depth = 0;
      while (parents.has(current) && depth < input.n) { current = parents.get(current); depth++; }
      return [node, depth];
    }));
    width = Math.max(660, input.n * 65 + 40);
    height = Math.max(170, Math.max(...depths.values()) * 85 + 100);
    order.forEach((node, index) => positions.set(node, {x: 45 + index * (width - 90) / Math.max(1, input.n - 1), y: 45 + depths.get(node) * 85}));
  } else {
    nodes.forEach((node, index) => {
      const angle = 2 * Math.PI * index / input.n - Math.PI / 2;
      positions.set(node, {x: input.n === 1 ? 330 : 330 + 228 * Math.cos(angle), y: input.n === 1 ? 265 : 265 + 160 * Math.sin(angle)});
    });
  }
  const edgeList = forest ? frame.forestEdges || [] : input.edges;
  const directed = forest || input.directed;
  const activeEdges = new Set(frame.activeEdges || []), acceptedEdges = new Set(frame.acceptedEdges || []), rejectedEdges = new Set(frame.rejectedEdges || []);
  const marker = `${id}-${forest ? 'forest' : 'graph'}-arrow`;
  const drawing = edgeList.map(([from, to, weight], index) => {
    const start = positions.get(from), end = positions.get(to);
    const status = !forest && rejectedEdges.has(index) ? 'rejected' : !forest && activeEdges.has(index) ? 'active' : !forest && acceptedEdges.has(index) ? 'accepted' : '';
    let path, labelX, labelY;
    if (from === to) {
      const loops = edgeList.slice(0, index).filter(([a, b]) => a === from && b === to).length;
      const reach = 42 + Math.min(loops, 4) * 9;
      path = `M${start.x - 16} ${start.y - 17} C${start.x - reach} ${start.y - reach - 20},${start.x + reach} ${start.y - reach - 20},${start.x + 18} ${start.y - 17}`;
      labelX = start.x; labelY = start.y - reach - 5;
    } else {
      const dx = end.x - start.x, dy = end.y - start.y, length = Math.hypot(dx, dy), ux = dx / length, uy = dy / length;
      const parallel = edgeList.map((edge, i) => ({edge, i})).filter(({edge: [a, b]}) => a === from && b === to || a === to && b === from);
      const lane = parallel.findIndex(item => item.i === index) - (parallel.length - 1) / 2;
      // A canonical normal keeps antiparallel edges in distinct lanes too.
      const orientation = from < to ? 1 : -1;
      const spacing = Math.min(44, 200 / Math.max(1, parallel.length - 1));
      const bend = lane * spacing * orientation;
      const controlX = (start.x + end.x) / 2 - uy * bend, controlY = (start.y + end.y) / 2 + ux * bend;
      path = `M${start.x + ux * 25} ${start.y + uy * 25} Q${controlX} ${controlY} ${end.x - ux * (directed ? 32 : 25)} ${end.y - uy * (directed ? 32 : 25)}`;
      labelX = (start.x + end.x) / 2 - uy * bend / 2;
      labelY = (start.y + end.y) / 2 + ux * bend / 2;
    }
    return `<g class="ga-edge-group ${status}"><path class="ga-edge" d="${path}"${directed ? ` marker-end="url(#${marker})"` : ''}><title>${escape(`${forest ? 'Parent pointer' : `Edge ${index}`}: ${from} ${directed ? '→' : '—'} ${to}${weight === undefined ? '' : `, weight ${weight}`}${status ? `, ${status}` : ''}`)}</title></path>${weight === undefined ? '' : `<g class="ga-weight" transform="translate(${labelX} ${labelY})"><rect x="-21" y="-11" width="42" height="22" rx="5"/><text y="1">${escape(weight)}</text></g>`}</g>`;
  }).join('');
  const active = new Set(frame.activeNodes || []), visited = new Set(frame.visitedNodes || []), finished = new Set(frame.finishedNodes || []), frontier = new Set(frame.frontierNodes || []);
  const circles = nodes.map(node => {
    const {x, y} = positions.get(node);
    const status = active.has(node) ? 'active' : frontier.has(node) ? 'frontier' : finished.has(node) ? 'finished' : visited.has(node) ? 'visited' : 'waiting';
    return `<g class="ga-node ${status}" transform="translate(${x} ${y})"><title>${escape(`Node ${node}: ${status}`)}</title><circle r="24"/><text y="1">${node}</text></g>`;
  }).join('');
  const label = forest ? 'Union Find parent pointers: child points to parent; roots have no outgoing arrow.' : `${input.directed ? 'Directed' : 'Undirected'} graph with ${input.n} nodes and ${input.edges.length} edges. ${frame.message}`;
  return `<div class="svg-scroll ga-diagram-scroll"><svg class="ga-svg${forest ? ' ga-forest-svg' : ''}" viewBox="0 0 ${width} ${height}" style="min-width:${forest ? width : 480}px" role="img" aria-label="${escape(label)}"><defs><marker id="${marker}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 z"/></marker></defs>${drawing}${circles}</svg></div>`;
}

function stateTable(frame) {
  if (!frame.table) return '';
  return `<div class="svg-scroll ga-table-scroll"><table class="ga-table"><caption>State at this step</caption><thead><tr>${frame.table.headers.map(header => `<th scope="col">${escape(header)}</th>`).join('')}</tr></thead><tbody>${frame.table.rows.map(row => `<tr>${row.map((value, i) => `<${i ? 'td' : 'th scope="row"'}>${escape(value)}</${i ? 'td' : 'th'}>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}

export function graphView(input, frame, id) {
  return `${graphSvg(input, frame, id)}${frame.forestEdges ? `<div class="ga-forest"><h3>Parent pointers</h3><p class="hint">Arrows point from child to parent. A root represents a component; compressing a path changes these pointers.</p>${graphSvg(input, frame, id, true)}<p class="ga-groups">Components: ${(frame.groups || []).map(group => `{${group.join(', ')}}`).join(' · ')}</p></div>` : ''}${stateTable(frame)}`;
}

export function graphText(input) {
  return Array.from({length: input.n}, (_, node) => `${node} → [${input.edges.flatMap(([u, v, w], index) => {
    const entry = target => `${target}${w === undefined ? '' : ` (weight ${w})`} #${index}`;
    return u === node ? [entry(v)] : !input.directed && v === node ? [entry(u)] : [];
  }).join(', ')}]`).join('\n');
}
