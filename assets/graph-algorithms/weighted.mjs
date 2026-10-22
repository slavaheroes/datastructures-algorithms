// Standalone teaching implementations. Original practice solutions stay unchanged.
const line = (code, statement) => code.split('\n').findIndex(text => text.trim() === statement) + 1;
const distance = value => Number.isFinite(value) ? value : '∞';
const queueOrder = (a, b) => {
  for (let index = 0; index < a.length; index++) {
    if (a[index] !== b[index]) return a[index] - b[index];
  }
  return 0;
};
const ordered = heap => heap.map(entry => [...entry]).sort(queueOrder);
const snapshot = (frames, frame) => frames.push(structuredClone(frame));

const dijkstraCode = `from heapq import heappop, heappush

def dijkstra(n, edges, source, directed=True):
    graph = [[] for _ in range(n)]
    for edge_id, (u, v, weight) in enumerate(edges):
        if weight < 0:
            raise ValueError("Dijkstra needs nonnegative weights")
        graph[u].append((v, weight, edge_id))
        if not directed:
            graph[v].append((u, weight, edge_id))
    dist = [float("inf")] * n
    previous = [None] * n
    parent_edge = [None] * n
    dist[source] = 0
    settled = set()
    heap = [(0, source)]
    while heap:
        cost, u = heappop(heap)
        if u in settled or cost != dist[u]:
            continue
        settled.add(u)
        for v, weight, edge_id in graph[u]:
            candidate = cost + weight
            if candidate < dist[v]:
                dist[v] = candidate
                previous[v] = u
                parent_edge[v] = edge_id
                heappush(heap, (candidate, v))
    return dist, previous`;

function validateDijkstra(input) {
  if (input.edges.some(([, , weight]) => weight < 0)) {
    throw Error('Dijkstra needs nonnegative edge weights. Use Bellman–Ford to explore negative edges.');
  }
}

function dijkstraTrace(input) {
  validateDijkstra(input);
  const {n, edges, source, directed} = input;
  const graph = Array.from({length: n}, () => []);
  edges.forEach(([u, v, weight], edgeId) => {
    graph[u].push([v, weight, edgeId]);
    if (!directed) graph[v].push([u, weight, edgeId]);
  });
  const dist = Array(n).fill(Infinity), previous = Array(n).fill(null), parentEdge = Array(n).fill(null);
  const settled = new Set(), heap = [[0, source]], frames = [];
  dist[source] = 0;
  function emit(message, statement, values = {}, decorations = {}) {
    snapshot(frames, {
      message, operation: statement, codeLines: statement ? [line(dijkstraCode, statement)] : [],
      variables: [['source', source], ['dist', dist.map(distance)], ['previous', previous], ['settled', [...settled]], ['priority queue (sorted view: cost, node)', ordered(heap)], ...Object.entries(values)],
      visitedNodes: dist.flatMap((value, node) => Number.isFinite(value) ? [node] : []),
      finishedNodes: [...settled], frontierNodes: [...new Set(heap.map(([, node]) => node).filter(node => !settled.has(node)))],
      acceptedEdges: [...settled].flatMap(node => parentEdge[node] === null ? [] : [parentEdge[node]]),
      table: {headers: ['Node', 'Distance', 'Previous', 'Status'], rows: dist.map((value, node) => [node, distance(value), previous[node] ?? '—', settled.has(node) ? 'final' : Number.isFinite(value) ? 'tentative' : 'unreached'])},
      ...decorations
    });
  }
  emit(`Start at ${source}. Its distance is 0; every other distance is infinity.`, 'heap = [(0, source)]');
  while (heap.length) {
    heap.sort(queueOrder);
    const [cost, u] = heap.shift();
    const values = {u, cost};
    emit(`Pop node ${u} with candidate cost ${cost}, the smallest queued cost.`, 'cost, u = heappop(heap)', values, {activeNodes: [u]});
    if (settled.has(u) || cost !== dist[u]) {
      emit(`Skip this old entry for ${u}; its best distance is already ${dist[u]}${settled.has(u) ? ' and final' : ''}.`, 'continue', values, {activeNodes: [u]});
      continue;
    }
    settled.add(u);
    emit(`Finalize distance ${cost} for node ${u}. Nonnegative weights make this safe.`, 'settled.add(u)', values, {activeNodes: [u]});
    for (const [v, weight, edgeId] of graph[u]) {
      const candidate = cost + weight;
      const current = {...values, v, weight, candidate};
      emit(`Try ${u} → ${v}: ${cost} + ${weight} = ${candidate}; current best is ${distance(dist[v])}.`, 'candidate = cost + weight', current, {activeNodes: [u, v], activeEdges: [edgeId]});
      if (candidate < dist[v]) {
        dist[v] = candidate;
        previous[v] = u;
        parentEdge[v] = edgeId;
        emit(`Improve node ${v} to ${candidate}; record ${u} as its predecessor.`, 'dist[v] = candidate', current, {activeNodes: [v], activeEdges: [edgeId], codeLines: ['dist[v] = candidate', 'previous[v] = u', 'parent_edge[v] = edge_id'].map(statement => line(dijkstraCode, statement))});
        heap.push([candidate, v]);
        emit(`Push (${candidate}, ${v}) so this improved route can be explored. Older entries stay queued until popped.`, 'heappush(heap, (candidate, v))', current, {activeNodes: [v], activeEdges: [edgeId]});
      } else {
        emit(`Keep distance ${distance(dist[v])} for node ${v}; this route does not improve it.`, 'if candidate < dist[v]:', current, {activeNodes: [v], rejectedEdges: [edgeId]});
      }
    }
  }
  const unreachable = dist.flatMap((value, node) => Number.isFinite(value) ? [] : [node]);
  emit(`Shortest paths are complete.${unreachable.length ? ` Nodes ${unreachable.join(', ')} are unreachable from ${source} and keep distance ∞.` : ' Every node is reachable.'}`, 'return dist, previous');
  return frames;
}

export const dijkstra = {
  id: 'dijkstra', title: 'Dijkstra’s algorithm',
  summary: 'Find shortest paths from one source when all edge weights are nonnegative.',
  explanation: [
    'Keep the cheapest known distance to every node. A min heap chooses the smallest candidate distance next. When that node is removed with its current best distance, its distance becomes final.',
    'Relax each outgoing edge: compare the route through the current node with the neighbor’s best known route. An improvement updates the distance and predecessor and adds a new heap entry. An old entry may remain in the heap; skip it when it is removed.',
    'The graph highlights finalized shortest-path edges. The table separates tentative distances from final distances, and the queue is shown in priority order rather than as a heap’s internal array.'
  ],
  steps: ['Set the source distance to 0 and all other distances to ∞.', 'Pop the smallest candidate; skip an outdated or already finalized entry.', 'Finalize the node, then relax each outgoing edge.', 'Push improvements and repeat until the queue is empty.'],
  complexity: {time: 'O(V + E log(E + 2)) with this lazy min heap, including parallel edges. On a simple graph this is commonly written O((V + E) log V).', space: 'O(V + E) for adjacency lists, distances, predecessors, and queued candidates.'},
  notes: ['Negative weights are rejected: a later negative edge can invalidate a finalized distance.', 'Distances measure total path weight. This differs from Prim, which chooses the next cheapest edge across a tree boundary.', 'This is a general shortest-path demonstration. Cheapest Flights also needs a stop-count state; Swim in Rising Water uses a maximum elevation instead of a sum.'],
  related: [{id: 'network-delay-time', title: 'Network Delay Time'}, {id: 'cheapest-flights-within-k-stops', title: 'Cheapest Flights Within K Stops'}, {id: 'swim-in-rising-water', title: 'Swim in Rising Water'}],
  weighted: true, direction: 'choice', sourceMode: 'single',
  examples: [
    {label: 'Improved route and stale entries', n: 6, edges: [[0,1,8],[0,2,2],[2,1,1],[2,3,7],[1,3,2],[1,4,6],[3,4,1],[4,5,3]], source: 0, directed: true},
    {label: 'Unreachable nodes', n: 6, edges: [[0,1,4],[0,2,1],[2,1,2],[3,4,1]], source: 0, directed: true},
    {label: 'Undirected graph with a zero edge', n: 5, edges: [[0,1,0],[0,2,5],[1,2,2],[1,3,4],[2,4,3],[3,4,1]], source: 0, directed: false}
  ],
  validate: validateDijkstra, code: dijkstraCode, trace: dijkstraTrace
};

const bellmanFordCode = `def bellman_ford(n, edges, source):
    dist = [float("inf")] * n
    previous = [None] * n
    dist[source] = 0
    for pass_no in range(1, n):
        changed = False
        for edge_id, (u, v, weight) in enumerate(edges):
            if dist[u] != float("inf") and dist[u] + weight < dist[v]:
                dist[v] = dist[u] + weight
                previous[v] = u
                changed = True
        if not changed:
            break
    for u, v, weight in edges:
        if dist[u] != float("inf") and dist[u] + weight < dist[v]:  # Negative-cycle check.
            return None, None  # Reachable negative cycle: no result.
    return dist, previous`;

function bellmanFordTrace(input) {
  const {n, edges, source} = input;
  const dist = Array(n).fill(Infinity), previous = Array(n).fill(null), parentEdge = Array(n).fill(null), frames = [];
  dist[source] = 0;
  let pass = 0, changed = false, negativeCycle = false;
  function emit(message, statement, values = {}, decorations = {}) {
    snapshot(frames, {
      message, operation: statement, codeLines: statement ? [line(bellmanFordCode, statement)] : [],
      variables: [['source', source], ['pass_no', pass], ['changed', changed], [negativeCycle ? 'last estimates (not a shortest-path result)' : 'dist', dist.map(distance)], ['previous', previous], ...Object.entries(values)],
      visitedNodes: dist.flatMap((value, node) => Number.isFinite(value) ? [node] : []),
      acceptedEdges: negativeCycle ? [] : parentEdge.filter(edgeId => edgeId !== null),
      table: {headers: ['Node', negativeCycle ? 'Last estimate — no result' : 'Distance estimate', 'Previous', 'Status'], rows: dist.map((value, node) => [node, distance(value), previous[node] ?? '—', negativeCycle ? (Number.isFinite(value) ? 'not final' : 'unreachable') : Number.isFinite(value) ? 'reachable' : 'unreached'])},
      ...decorations
    });
  }
  emit(`Start at ${source}. Repeatedly relax every directed edge; negative edge weights are allowed.`, 'dist[source] = 0');
  for (pass = 1; pass < n; pass++) {
    changed = false;
    emit(`Begin pass ${pass} of at most ${n - 1}.`, 'changed = False');
    for (let edgeId = 0; edgeId < edges.length; edgeId++) {
      const [u, v, weight] = edges[edgeId];
      const values = {u, v, weight, edge_id: edgeId};
      emit(Number.isFinite(dist[u]) ? `Check ${u} → ${v}: candidate ${dist[u] + weight}, current estimate ${distance(dist[v])}.` : `Skip ${u} → ${v}: node ${u} is still unreachable.`, 'if dist[u] != float("inf") and dist[u] + weight < dist[v]:', values, {activeNodes: [u, v], activeEdges: [edgeId]});
      if (Number.isFinite(dist[u]) && dist[u] + weight < dist[v]) {
        dist[v] = dist[u] + weight;
        previous[v] = u;
        parentEdge[v] = edgeId;
        changed = true;
        emit(`Improve node ${v} to ${dist[v]} through ${u}. Later edges in this pass can use this updated estimate.`, 'dist[v] = dist[u] + weight', values, {activeNodes: [v], activeEdges: [edgeId], codeLines: ['dist[v] = dist[u] + weight', 'previous[v] = u', 'changed = True'].map(statement => line(bellmanFordCode, statement))});
      }
    }
    if (!changed) {
      emit('This pass made no changes. Stop early: another full pass cannot improve any distance.', 'break');
      break;
    }
  }
  // Keep the displayed pass number at the last executed pass, including n = 1.
  pass = Math.min(pass, n - 1);
  emit('Check every edge once more. A reachable improvement now proves there is a reachable negative cycle.', 'for u, v, weight in edges:');
  for (let edgeId = 0; edgeId < edges.length; edgeId++) {
    const [u, v, weight] = edges[edgeId];
    const values = {u, v, weight};
    emit(Number.isFinite(dist[u]) ? `Negative-cycle check on ${u} → ${v}: compare ${dist[u] + weight} with ${dist[v]}.` : `Ignore ${u} → ${v} for cycle detection: its start is unreachable from ${source}.`, 'if dist[u] != float("inf") and dist[u] + weight < dist[v]:  # Negative-cycle check.', values, {activeNodes: [u, v], activeEdges: [edgeId]});
    if (Number.isFinite(dist[u]) && dist[u] + weight < dist[v]) {
      negativeCycle = true;
      emit('No shortest-path result is returned. A reachable negative cycle lets some path costs decrease without bound. The table contains last estimates, not final shortest distances; the highlighted edge is a witness to further relaxation.', 'return None, None  # Reachable negative cycle: no result.', {...values, result: 'No result: reachable negative cycle'}, {activeNodes: [u, v], rejectedEdges: [edgeId]});
      return frames;
    }
  }
  const unreachable = dist.flatMap((value, node) => Number.isFinite(value) ? [] : [node]);
  emit(`No reachable negative cycle was found. These are the shortest distances from ${source}.${unreachable.length ? ` Nodes ${unreachable.join(', ')} remain unreachable, even if that disconnected part contains a negative cycle.` : ''}`, 'return dist, previous', {result: 'Shortest distances'}, {
    finishedNodes: dist.flatMap((value, node) => Number.isFinite(value) ? [node] : []),
    table: {headers: ['Node', 'Shortest distance', 'Previous', 'Status'], rows: dist.map((value, node) => [node, distance(value), previous[node] ?? '—', Number.isFinite(value) ? 'final' : 'unreachable'])}
  });
  return frames;
}

export const bellmanFord = {
  id: 'bellman-ford', title: 'Bellman–Ford algorithm',
  summary: 'Find shortest paths with negative edges, and detect a negative cycle reachable from the source.',
  explanation: [
    'Relax every edge repeatedly. Relaxation asks whether reaching the edge’s start and then taking that edge improves the distance at its end. A pass can propagate several improvements because this version updates distances in place.',
    'Without a reachable negative cycle, a shortest path can be chosen without repeating a node, so V − 1 full passes are sufficient. Stop earlier if an entire pass makes no changes.',
    'After those passes, check for another reachable improvement. If one exists, a reachable negative cycle makes some distances unbounded below. This demonstration returns no shortest-path result in that case; it leaves the last estimates visible and labels them as estimates.'
  ],
  steps: ['Set the source distance to 0 and other distances to ∞.', 'Scan all directed edges and apply every improvement.', 'Repeat up to V − 1 passes, stopping when a full pass changes nothing.', 'Scan once more to detect a reachable negative cycle; otherwise return the distances.'],
  complexity: {time: 'O(VE + V) in the worst case, including initialization. Early stopping can reduce the number of passes.', space: 'O(V) extra space for distances and predecessors, excluding the supplied edge list.'},
  notes: ['An edge from an unreachable node never relaxes another node. A negative cycle in an unreachable component does not affect this source’s distances.', 'Dijkstra finalizes one nearest candidate at a time and requires nonnegative weights. Bellman–Ford revisits edges and permits negative weights.', 'This is the standard repeated-edge-pass algorithm. Your saved Cheapest Flights reference uses queue-based, stop-bounded relaxation; the flight limit changes the state and stopping rule.'],
  related: [{id: 'cheapest-flights-within-k-stops', title: 'Cheapest Flights Within K Stops'}],
  weighted: true, direction: 'directed', sourceMode: 'single',
  examples: [
    {label: 'Negative edge without a negative cycle', n: 5, edges: [[0,1,4],[0,2,5],[1,2,-2],[1,3,4],[2,3,3],[3,4,1]], source: 0, directed: true},
    {label: 'Reachable negative cycle', n: 5, edges: [[0,1,1],[1,2,-2],[2,1,-2],[2,3,1]], source: 0, directed: true},
    {label: 'Unreachable negative cycle', n: 5, edges: [[0,1,2],[1,2,3],[3,4,-2],[4,3,1]], source: 0, directed: true},
    {label: 'Several passes before convergence', n: 5, edges: [[3,4,1],[2,3,1],[1,2,-1],[0,1,4]], source: 0, directed: true}
  ],
  code: bellmanFordCode, trace: bellmanFordTrace
};

const primCode = `from heapq import heappop, heappush

def prim(n, edges, source):
    graph = [[] for _ in range(n)]
    for edge_id, (u, v, weight) in enumerate(edges):
        graph[u].append((weight, v, u, edge_id))
        graph[v].append((weight, u, v, edge_id))
    joined = set()
    tree = []
    total = 0
    heap = [(0, source, -1, -1)]
    while heap and len(joined) < n:
        weight, u, parent, edge_id = heappop(heap)
        if u in joined:
            continue
        joined.add(u)
        if edge_id != -1:
            tree.append(edge_id)
            total += weight
        for edge in graph[u]:
            if edge[1] not in joined:
                heappush(heap, edge)
    if len(joined) != n:
        return None  # Disconnected: no spanning tree.
    return total, tree`;

function primTrace(input) {
  const {n, edges, source} = input;
  const graph = Array.from({length: n}, () => []);
  edges.forEach(([u, v, weight], edgeId) => {
    graph[u].push([weight, v, u, edgeId]);
    graph[v].push([weight, u, v, edgeId]);
  });
  const joined = new Set(), tree = [], heap = [[0, source, -1, -1]], parent = Array(n).fill(null), frames = [];
  let total = 0;
  function emit(message, statement, values = {}, decorations = {}) {
    const frontier = [...new Set(heap.map(([, node]) => node).filter(node => !joined.has(node)))];
    snapshot(frames, {
      message, operation: statement, codeLines: statement ? [line(primCode, statement)] : [],
      variables: [['source', source], ['joined', [...joined]], ['tree (edge IDs)', tree], ['total', total], ['priority queue (sorted: weight, node, parent, edge ID)', ordered(heap)], ...Object.entries(values)],
      visitedNodes: [...joined], finishedNodes: [...joined], frontierNodes: frontier, acceptedEdges: tree,
      table: {headers: ['Node', 'Status', 'Tree parent', 'Chosen edge weight'], rows: Array.from({length: n}, (_, node) => [node, joined.has(node) ? 'in tree' : frontier.includes(node) ? 'candidate' : 'unreached', parent[node] === null ? '—' : parent[node][0], parent[node] === null ? '—' : edges[parent[node][1]][2]])},
      ...decorations
    });
  }
  emit(`Start a tree at node ${source}. The first heap entry is a zero-cost marker, not a graph edge.`, 'heap = [(0, source, -1, -1)]');
  while (heap.length && joined.size < n) {
    heap.sort(queueOrder);
    const [weight, u, from, edgeId] = heap.shift();
    const values = {u, weight, parent: from === -1 ? null : from, edge_id: edgeId === -1 ? null : edgeId};
    const activeEdges = edgeId === -1 ? [] : [edgeId];
    emit(edgeId === -1 ? `Remove the start marker for ${u}.` : `Pop edge ${from} — ${u}, weight ${weight}, the cheapest remaining candidate.`, 'weight, u, parent, edge_id = heappop(heap)', values, {activeNodes: [u], activeEdges});
    if (joined.has(u)) {
      emit(`Skip edge ${from} — ${u}: both endpoints are already in the tree, so adding it would create a cycle.`, 'continue', values, {activeNodes: [u], rejectedEdges: activeEdges});
      continue;
    }
    joined.add(u);
    emit(`Add node ${u} to the growing tree.`, 'joined.add(u)', values, {activeNodes: [u], activeEdges});
    if (edgeId !== -1) {
      tree.push(edgeId);
      parent[u] = [from, edgeId];
      total += weight;
      emit(`Accept edge ${from} — ${u} with weight ${weight}. The selected edges now cost ${total}.`, 'total += weight', values, {activeNodes: [from, u], activeEdges, codeLines: ['tree.append(edge_id)', 'total += weight'].map(statement => line(primCode, statement))});
    }
    for (const entry of graph[u]) {
      const [edgeWeight, v, fromNode, id] = entry;
      if (!joined.has(v)) {
        heap.push([...entry]);
        emit(`Offer edge ${fromNode} — ${v}, weight ${edgeWeight}, across the current tree boundary.`, 'heappush(heap, edge)', {u, edge: entry}, {activeNodes: [u, v], activeEdges: [id]});
      }
    }
  }
  if (joined.size !== n) {
    const missing = Array.from({length: n}, (_, node) => node).filter(node => !joined.has(node));
    emit(`No spanning tree exists: nodes ${missing.join(', ')} cannot be reached from ${source}. The highlighted edges form only this source component’s partial tree, with cost ${total}.`, 'return None  # Disconnected: no spanning tree.', {result: 'No spanning tree: disconnected graph'});
  } else {
    emit(`Minimum spanning tree complete: ${tree.length} edges connect all ${n} nodes with total weight ${total}.`, 'return total, tree', {result: total});
  }
  return frames;
}

export const prim = {
  id: 'prim', title: 'Prim’s algorithm',
  summary: 'Grow a minimum spanning tree by repeatedly choosing the cheapest edge to a new node.',
  explanation: [
    'A spanning tree connects every node in an undirected graph with no cycles. A minimum spanning tree has the smallest possible sum of edge weights. Prim starts at one node and grows a single tree.',
    'A min heap holds candidate edges leaving nodes already in the tree. Choose the cheapest candidate whose far endpoint has not joined yet, accept that edge, and offer the new node’s outgoing edges. Skip candidates whose endpoint is already in the tree.',
    'The selected edges and their total weight appear at every step. If the queue empties before every node joins, the graph is disconnected: the selected edges span only the source component, and the algorithm returns no spanning tree.'
  ],
  steps: ['Choose a start node and put a zero-cost start marker in the heap.', 'Pop the cheapest candidate and skip an endpoint already in the tree.', 'Join the new node and accept its connecting edge.', 'Offer its edges to nodes outside the tree; repeat until all nodes join or candidates run out.'],
  complexity: {time: 'O(V + E log(E + 2)) with adjacency lists and a lazy edge min heap, including parallel edges.', space: 'O(V + E) for adjacency lists, selected nodes, and candidate edges.'},
  notes: ['Prim needs an undirected graph. Negative edge weights are allowed.', 'Dijkstra minimizes each source-to-node path sum. Prim minimizes the total weight of the spanning tree; the selected tree need not contain shortest paths from its start.', 'Equal weights can produce several valid minimum spanning trees. This version breaks heap ties by destination node, parent node, then edge ID.', 'Your Min Cost to Connect All Points solution uses Manhattan distances to build a complete graph. Its reference version uses array-based Prim in O(V²) time and O(V) extra space.'],
  related: [{id: 'min-cost-to-connect-all-points', title: 'Min Cost to Connect All Points'}],
  weighted: true, direction: 'undirected', sourceMode: 'single',
  examples: [
    {label: 'Minimum spanning tree', n: 6, edges: [[0,1,4],[0,2,2],[1,2,1],[1,3,5],[2,3,8],[2,4,10],[3,4,2],[3,5,6],[4,5,3]], source: 0, directed: false},
    {label: 'Disconnected graph', n: 6, edges: [[0,1,3],[0,2,1],[1,2,2],[3,4,4]], source: 0, directed: false},
    {label: 'Negative and parallel edges', n: 4, edges: [[0,1,5],[0,1,-2],[1,2,3],[0,2,6],[2,3,-1],[1,3,4]], source: 0, directed: false}
  ],
  code: primCode, trace: primTrace
};
