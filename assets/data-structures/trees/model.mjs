import {NODE_LIMIT} from '../../shared/input.mjs';

// Compact level order: only existing parents consume the next pair of entries.
export function buildTree(data) {
  if (!Array.isArray(data) || !data.every(v => v === null || Number.isSafeInteger(v))) throw Error('Use a JSON array containing integers or null.');
  if (data.filter(v => v !== null).length > NODE_LIMIT) throw Error(`Keep each tree at ${NODE_LIMIT} nodes or fewer. Null entries do not count as nodes.`);
  if (!data.length) return [];
  if (data[0] === null) {
    if (data.some(v => v !== null)) throw Error('A missing root cannot have descendants.');
    return [];
  }
  const nodes = [{id: 0, value: data[0], left: null, right: null}];
  let cursor = 1;
  for (let parent = 0; parent < nodes.length && cursor < data.length; parent++) {
    for (const side of ['left', 'right']) {
      if (cursor >= data.length) break;
      const value = data[cursor++];
      if (value !== null) {
        const id = nodes.length;
        nodes[parent][side] = id;
        nodes.push({id, value, left: null, right: null});
      }
    }
  }
  if (data.slice(cursor).some(v => v !== null)) throw Error('The array contains nodes without a parent.');
  return nodes;
}

export function buildTrees(data) {
  if (!Array.isArray(data)) throw Error('Use one tree array or an array of tree arrays, such as [[1,2,3],[4,null,5]].');
  const arrays = data.some(Array.isArray) ? data : [data];
  return arrays.map((values, index) => {
    try { return buildTree(values); }
    catch (error) { throw Error(`Tree ${index + 1}: ${error.message}`); }
  });
}

export function addTreeNode(nodes, parent, side, value) {
  if (!Number.isSafeInteger(value)) throw Error('Node values must be safe integers.');
  if (nodes.length >= NODE_LIMIT) throw Error(`Keep each tree at ${NODE_LIMIT} nodes or fewer.`);
  const copy = nodes.map(n => ({...n}));
  if (!copy.length) return [{id: 0, value, left: null, right: null}];
  if (!copy[parent] || !['left', 'right'].includes(side)) throw Error('Select an existing parent and child position.');
  if (copy[parent][side] !== null) throw Error('That child position is occupied. Choose another.');
  copy[parent][side] = copy.length;
  copy.push({id: copy.length, value, left: null, right: null});
  return copy;
}
