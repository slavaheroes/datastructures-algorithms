export const NODE_LIMIT = 16;

export function numberArray(text, max = 64) {
  const data = JSON.parse(text);
  if (!Array.isArray(data) || data.length > max || !data.every(Number.isSafeInteger)) throw Error(`Use a JSON array of up to ${max} safe integers.`);
  return data;
}

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

export function sortingSteps(input, algorithm) {
  const a = [...input], steps = [];
  let comparisons = 0, writes = 0;
  const record = (message, active = []) => steps.push({values: [...a], active, message, comparisons, writes});
  const compare = (i, j) => { comparisons++; record(`Compare ${a[i]} and ${a[j]}.`, [i, j]); };
  const swap = (i, j) => { if (i !== j) { [a[i], a[j]] = [a[j], a[i]]; writes += 2; record(`Swap positions ${i} and ${j}.`, [i, j]); } };
  record('Ready. Follow the highlighted values through each operation.');
  if (algorithm === 'bubble') {
    for (let end = a.length - 1; end > 0; end--) {
      let changed = false;
      for (let i = 0; i < end; i++) { compare(i, i + 1); if (a[i] > a[i + 1]) { swap(i, i + 1); changed = true; } }
      if (!changed) break;
    }
  } else if (algorithm === 'merge') {
    function sort(lo, hi) {
      if (hi - lo < 2) return;
      const mid = Math.floor((lo + hi) / 2);
      sort(lo, mid); sort(mid, hi);
      const left = a.slice(lo, mid), right = a.slice(mid, hi);
      let i = 0, j = 0, k = lo;
      while (i < left.length || j < right.length) {
        if (i < left.length && j < right.length) { comparisons++; record(`Merge: compare ${left[i]} and ${right[j]} from the temporary halves.`, [k]); }
        a[k] = j >= right.length || (i < left.length && left[i] <= right[j]) ? left[i++] : right[j++];
        writes++; record(`Write ${a[k]} to position ${k} from the temporary halves.`, [k]); k++;
      }
    }
    sort(0, a.length);
  } else if (algorithm === 'quick') {
    function sort(lo, hi) {
      if (lo >= hi) return;
      const pivot = a[hi]; let p = lo;
      record(`Choose the last value, ${pivot}, as pivot.`, [hi]);
      for (let j = lo; j < hi; j++) { compare(j, hi); if (a[j] < pivot) swap(p++, j); }
      swap(p, hi); record(`Pivot ${pivot} is in its final position ${p}.`, [p]);
      sort(lo, p - 1); sort(p + 1, hi);
    }
    sort(0, a.length - 1);
  } else throw Error('Unknown sorting algorithm.');
  record('Sorted! Every value is in ascending order.');
  return steps;
}
