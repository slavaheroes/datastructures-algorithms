import {NODE_LIMIT} from '../../shared/input.mjs';

export function buildGraph(data, format, directed) {
  if (!Array.isArray(data)) throw Error('Use a JSON array.');
  const nodes = new Set(), edges = [], seen = new Set();
  function add(a, b) {
    nodes.add(a); nodes.add(b);
    const key = directed ? `${a},${b}` : [a, b].sort((x, y) => x - y).join(',');
    if (!seen.has(key)) { edges.push([a, b]); seen.add(key); }
  }
  if (format === 'matrix') {
    if (data.length > NODE_LIMIT || !data.every(row => Array.isArray(row) && row.length === data.length && row.every(v => v === 0 || v === 1))) throw Error(`Use a square 0/1 matrix with at most ${NODE_LIMIT} rows.`);
    data.forEach((row, i) => {
      nodes.add(i);
      row.forEach((v, j) => {
        if (!directed && v !== data[j][i]) throw Error('An undirected adjacency matrix must be symmetric.');
        if (v) add(i, j);
      });
    });
  } else {
    if (!data.every(edge => Array.isArray(edge) && edge.length === 2 && edge.every(Number.isSafeInteger))) throw Error('Use an edge list such as [[0,1],[1,2]].');
    data.forEach(([a, b]) => add(a, b));
  }
  if (nodes.size > NODE_LIMIT) throw Error(`Keep graphs at ${NODE_LIMIT} nodes or fewer.`);
  return {nodes: [...nodes], edges};
}
