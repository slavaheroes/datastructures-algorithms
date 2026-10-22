// Four-direction, unit-cost grid searches. Trace collection is optional so the
// speed comparison measures the same search without animation bookkeeping.
const TRACE_LIMIT = 30000;

class MinHeap {
  constructor() { this.values = []; }
  get size() { return this.values.length; }
  static before(a, b) {
    return a[0] < b[0] || a[0] === b[0] && (a[1] < b[1] || a[1] === b[1] && a[2] < b[2]);
  }
  push(value) {
    const values = this.values;
    let index = values.length;
    values.push(value);
    while (index > 0) {
      const parent = (index - 1) >> 1;
      if (!MinHeap.before(value, values[parent])) break;
      values[index] = values[parent];
      index = parent;
    }
    values[index] = value;
  }
  pop() {
    const values = this.values, first = values[0], last = values.pop();
    if (!values.length) return first;
    let index = 0;
    while (index * 2 + 1 < values.length) {
      let child = index * 2 + 1;
      if (child + 1 < values.length && MinHeap.before(values[child + 1], values[child])) child++;
      if (!MinHeap.before(values[child], last)) break;
      values[index] = values[child];
      index = child;
    }
    values[index] = last;
    return first;
  }
}

function prepare(grid) {
  const {rows, cols, start, goal} = grid;
  if (!Number.isInteger(rows) || !Number.isInteger(cols) || rows < 5 || rows > 40 || cols < 5 || cols > 40) {
    throw Error('Use a grid with 5–40 rows and 5–40 columns.');
  }
  const count = rows * cols;
  if (!Number.isInteger(start) || !Number.isInteger(goal) || start < 0 || goal < 0 || start >= count || goal >= count) {
    throw Error('The start and goal must be cells inside the grid.');
  }
  if (!Array.isArray(grid.walls) || grid.walls.some(node => !Number.isInteger(node) || node < 0 || node >= count)) {
    throw Error('Blocked cells must be cell indices inside the grid.');
  }
  const blocked = new Uint8Array(count);
  for (const node of grid.walls) blocked[node] = 1;
  if (blocked[start] || blocked[goal]) throw Error('The start and goal must be accessible cells.');
  const adjacency = Array.from({length: count}, () => []), accessible = [];
  for (let node = 0; node < count; node++) {
    if (blocked[node]) continue;
    accessible.push(node);
    const row = Math.floor(node / cols), col = node % cols;
    // Stable ordering is shared by all three algorithms.
    if (row > 0 && !blocked[node - cols]) adjacency[node].push(node - cols);
    if (col + 1 < cols && !blocked[node + 1]) adjacency[node].push(node + 1);
    if (row + 1 < rows && !blocked[node + cols]) adjacency[node].push(node + cols);
    if (col > 0 && !blocked[node - 1]) adjacency[node].push(node - 1);
  }
  return {count, adjacency, accessible};
}

export function runSearch(algorithm, grid, options = {trace: true}) {
  if (!['dijkstra', 'bellman-ford', 'astar'].includes(algorithm)) throw Error('Unknown grid search algorithm.');
  const {count, adjacency, accessible} = prepare(grid);
  const {cols, start, goal} = grid;
  const weight = grid.heuristicWeight ?? 1;
  if (!Number.isFinite(weight) || weight < 0 || weight > 10) throw Error('The heuristic weight must be from 0 to 10.');
  const dist = new Float64Array(count).fill(Infinity), previous = new Int32Array(count).fill(-1);
  const visited = new Uint8Array(count), events = [];
  const tracing = options.trace !== false;
  let expanded = 0, expandedUnique = 0, edgeChecks = 0, relaxations = 0, passes = 0, stalePops = 0, traceTruncated = false;
  const emit = (kind, node, from, to, distance) => {
    if (!tracing) return;
    if (events.length >= TRACE_LIMIT) { traceTruncated = true; return; }
    const event = {kind, node};
    if (from !== undefined) event.from = from;
    if (to !== undefined) event.to = to;
    if (distance !== undefined) event.distance = distance;
    events.push(event);
  };
  const expand = node => {
    expanded++;
    if (!visited[node]) { visited[node] = 1; expandedUnique++; }
    emit('expand', node, undefined, undefined, dist[node]);
  };
  dist[start] = 0;
  emit('relax', start, undefined, start, 0);

  if (algorithm === 'bellman-ford') {
    // In-place relaxation in row-major vertex order. The number of rounds is
    // bounded by accessible vertices rather than blocked grid positions.
    for (let round = 1; round < accessible.length; round++) {
      passes++;
      let changed = false;
      for (const u of accessible) {
        if (!Number.isFinite(dist[u])) continue;
        expand(u);
        for (const v of adjacency[u]) {
          edgeChecks++;
          emit('check', u, u, v, dist[v]);
          const candidate = dist[u] + 1;
          if (candidate < dist[v]) {
            dist[v] = candidate;
            previous[v] = u;
            relaxations++;
            changed = true;
            emit('relax', v, u, v, candidate);
          }
        }
      }
      if (!changed) break;
    }
    // A graph consisting only of the start is already solved without a pass.
    if (accessible.length === 1) expand(start);
  } else {
    const goalRow = Math.floor(goal / cols), goalCol = goal % cols;
    const heuristic = node => algorithm === 'astar' ? Math.abs(Math.floor(node / cols) - goalRow) + Math.abs(node % cols - goalCol) : 0;
    const heap = new MinHeap();
    let serial = 0;
    const firstH = heuristic(start);
    // Heap entries are [f, h, insertion order, node, g]. A* breaks equal f
    // values toward lower h; Dijkstra and zero-weight A* use insertion order.
    heap.push([weight * firstH, weight === 0 ? 0 : firstH, serial++, start, 0]);
    while (heap.size) {
      const [, , , u, cost] = heap.pop();
      if (cost !== dist[u]) { stalePops++; continue; }
      expand(u);
      if (u === goal) break;
      for (const v of adjacency[u]) {
        edgeChecks++;
        emit('check', u, u, v, dist[v]);
        const candidate = cost + 1;
        if (candidate >= dist[v]) continue;
        dist[v] = candidate;
        previous[v] = u;
        relaxations++;
        const h = heuristic(v);
        heap.push([candidate + weight * h, weight === 0 ? 0 : h, serial++, v, candidate]);
        emit('relax', v, u, v, candidate);
      }
    }
  }

  const status = Number.isFinite(dist[goal]) ? 'found' : 'unreachable';
  const path = [];
  if (status === 'found') {
    let node = goal;
    while (node !== -1) { path.push(node); node = previous[node]; }
    path.reverse();
  }
  // With an inflated heuristic, an ancestor can be improved before its new
  // label is propagated to every descendant. Report the cost of the returned
  // predecessor path itself so the path length and displayed cost agree.
  const distance = status === 'found' ? path.length - 1 : null;
  // A final event is always available, even after the operation trace cap.
  if (tracing) events.push({kind: 'finish', node: goal, distance});
  return {
    algorithm, status, path, distance, expanded, expandedUnique, edgeChecks, relaxations, passes, stalePops,
    visited: Array.from(visited).flatMap((value, node) => value ? [node] : []),
    discovered: Array.from(dist).flatMap((value, node) => Number.isFinite(value) ? [node] : []),
    events, traceTruncated, traceLimit: TRACE_LIMIT,
    accessibleCells: accessible.length, goalEstimate: status === 'found' ? dist[goal] : null
  };
}
