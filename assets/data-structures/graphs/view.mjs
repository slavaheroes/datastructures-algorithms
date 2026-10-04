import {svgNode} from '../../shared/dom.mjs';

export function graphDrawing(graph, directed) {
  const positions = new Map();
  graph.nodes.forEach((id, index) => {
    const angle = index * 2 * Math.PI / graph.nodes.length - Math.PI / 2;
    positions.set(id, {x: 400 + (graph.nodes.length === 1 ? 0 : 290 * Math.cos(angle)), y: 230 + (graph.nodes.length === 1 ? 0 : 160 * Math.sin(angle))});
  });
  let drawing = '<defs><marker id="graph-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 Z" fill="#849b77"/></marker></defs>';
  for (const [from, to] of graph.edges) {
    const start = positions.get(from), end = positions.get(to);
    let path;
    if (from === to) {
      path = `M${start.x - 15} ${start.y - 18} C${start.x - 60} ${start.y - 83},${start.x + 60} ${start.y - 83},${start.x + 17} ${start.y - 18}`;
    } else {
      const dx = end.x - start.x, dy = end.y - start.y, length = Math.hypot(dx, dy), ux = dx / length, uy = dy / length;
      const reverse = directed && graph.edges.some(([a, b]) => a === to && b === from);
      const bend = reverse ? 32 : 0;
      path = `M${start.x + ux * 25} ${start.y + uy * 25} Q${(start.x + end.x) / 2 - uy * bend} ${(start.y + end.y) / 2 + ux * bend} ${end.x - ux * 29} ${end.y - uy * 29}`;
    }
    drawing += `<path class="edge" d="${path}"${directed ? ' marker-end="url(#graph-arrow)"' : ''}/>`;
  }
  for (const id of graph.nodes) {
    const position = positions.get(id);
    drawing += svgNode(position.x, position.y, id);
  }
  if (!graph.nodes.length) drawing += '<text x="400" y="230" text-anchor="middle" fill="#64756e">No nodes.</text>';
  return drawing;
}

export function graphText(graph, directed) {
  return graph.nodes.map(id => `${id} → [${graph.edges.flatMap(([from, to]) => from === id ? [to] : !directed && to === id ? [from] : []).join(', ')}]`).join('\n') || 'Empty graph';
}
