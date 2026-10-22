import {NODE_LIMIT} from '../shared/input.mjs';

function json(text, label) {
  if (text.length > 8192) throw Error(`${label} must be at most 8,192 characters.`);
  try { return JSON.parse(text); }
  catch { throw Error(`${label} must be valid JSON.`); }
}

function integer(text, min, max, label) {
  const value = Number(text);
  if (!String(text).trim() || !Number.isSafeInteger(value) || value < min || value > max) {
    throw Error(`${label} must be an integer from ${min} to ${max}.`);
  }
  return value;
}

export function parseGraphInput(fields, definition) {
  const n = integer(fields.nodes, 1, NODE_LIMIT, 'Number of nodes');
  const edges = json(fields.edges, 'Edges');
  const arity = definition.weighted ? 3 : 2;
  if (!Array.isArray(edges) || edges.length > 64 || edges.some(edge =>
    !Array.isArray(edge) || edge.length !== arity || !edge.every(Number.isSafeInteger))) {
    throw Error(`Use up to 64 integer ${definition.weighted ? 'triples [from, to, weight]' : 'pairs [from, to]'}. An empty edge list is [].`);
  }
  if (edges.some(([u, v]) => u < 0 || v < 0 || u >= n || v >= n)) {
    throw Error(`Every endpoint must be between 0 and ${n - 1}. Increase the node count to include more nodes, up to ${NODE_LIMIT}.`);
  }
  if (definition.weighted && edges.some(([, , weight]) => weight < -999 || weight > 999)) {
    throw Error('Edge weights must be integers from −999 to 999.');
  }
  const directed = definition.direction === 'choice' ? fields.direction === 'directed' : definition.direction === 'directed';
  let source = 0, sources = [];
  if (definition.sourceMode === 'single') source = integer(fields.source, 0, n - 1, 'Start node');
  if (definition.sourceMode === 'multi') {
    const values = json(fields.sources, 'Sources');
    if (!Array.isArray(values) || !values.length || values.length > n ||
        values.some(value => !Number.isSafeInteger(value) || value < 0 || value >= n)) {
      throw Error(`Sources must be a nonempty JSON array of node IDs from 0 to ${n - 1}.`);
    }
    sources = [...new Set(values)];
    source = sources[0];
  }
  const input = {n, edges, directed, source, sources};
  definition.validate?.(input);
  return input;
}
