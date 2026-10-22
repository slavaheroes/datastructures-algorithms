// These are teaching implementations. Practice lessons still load their original Python files.
function listing(rows) {
  return {
    code: rows.map(([, text]) => text).join('\n'),
    lines: Object.fromEntries(rows.filter(([key]) => key).map(([key], index) => [key, rows.findIndex(([tag]) => tag === key) + 1]))
  };
}

const unionListing = listing([
  ['function', 'def union_find(n, edges):'],
  ['parent', '    parent = list(range(n))'],
  ['size', '    size = [1] * n'],
  ['components', '    components = n'],
  ['', ''],
  ['find', '    def find(node):'],
  ['check_parent', '        if parent[node] != node:'],
  ['compress', '            parent[node] = find(parent[node])'],
  ['return_root', '        return parent[node]'],
  ['', ''],
  ['redundant', '    redundant = []'],
  ['loop', '    for edge_id, (u, v) in enumerate(edges):'],
  ['find_u', '        root_u = find(u)'],
  ['find_v', '        root_v = find(v)'],
  ['same_root', '        if root_u == root_v:'],
  ['reject', '            redundant.append(edge_id)'],
  ['continue', '            continue'],
  ['compare_size', '        if size[root_u] < size[root_v]:'],
  ['swap', '            root_u, root_v = root_v, root_u'],
  ['attach', '        parent[root_v] = root_u'],
  ['grow', '        size[root_u] += size[root_v]'],
  ['decrement', '        components -= 1'],
  ['return', '    return parent, components, redundant']
]);

function unionTrace({n, edges}) {
  const parent = Array.from({length: n}, (_, i) => i);
  const size = Array(n).fill(1);
  const accepted = [], redundant = [], frames = [], calls = [];
  let components = n, edgeId = null, u = null, v = null, rootU = null, rootV = null;
  const rootOf = node => {
    while (parent[node] !== node) node = parent[node];
    return node;
  };
  function emit(key, message, activeNodes = []) {
    const byRoot = new Map();
    for (let node = 0; node < n; node++) {
      const root = rootOf(node);
      if (!byRoot.has(root)) byRoot.set(root, []);
      byRoot.get(root).push(node);
    }
    frames.push({
      message, operation: message, codeLines: [unionListing.lines[key]],
      variables: [['components', components], ['edge_id', edgeId], ['u', u], ['v', v], ['root_u', rootU], ['root_v', rootV], ['find call stack', [...calls]], ['redundant edge IDs', [...redundant]]],
      activeNodes: [...activeNodes], activeEdges: edgeId === null ? [] : [edgeId],
      acceptedEdges: [...accepted], rejectedEdges: [...redundant],
      forestEdges: parent.flatMap((p, node) => node === p ? [] : [[node, p]]),
      groups: [...byRoot.values()].map(group => [...group]),
      table: {headers: ['Node', 'Parent', 'Root', 'Size at root'], rows: parent.map((p, node) => [node, p, rootOf(node), node === p ? size[node] : '—'])}
    });
  }
  function find(node) {
    calls.push(node);
    emit('check_parent', `Find the representative of ${node}: its parent is ${parent[node]}.`, [node]);
    if (parent[node] !== node) {
      const previous = parent[node];
      const root = find(previous);
      parent[node] = root;
      emit('compress', previous === root ? `${node} already points directly to root ${root}.` : `Compress the path: change parent[${node}] from ${previous} to root ${root}.`, [node, root]);
    }
    emit('return_root', `find(${node}) returns root ${parent[node]}.`, [node, parent[node]]);
    calls.pop();
    return parent[node];
  }
  emit('components', `Start with ${n} separate components. Every node is its own parent.`);
  edges.forEach(([from, to], index) => {
    edgeId = index; u = from; v = to; rootU = null; rootV = null;
    emit('loop', `Process edge ${index}: ${u} — ${v}.`, [u, v]);
    rootU = find(u);
    emit('find_u', `The representative of ${u} is ${rootU}.`, [u, rootU]);
    rootV = find(v);
    emit('find_v', `The representative of ${v} is ${rootV}.`, [v, rootV]);
    emit('same_root', rootU === rootV ? `Both endpoints have root ${rootU}; they are already connected.` : `The roots ${rootU} and ${rootV} differ; these components can merge.`, [rootU, rootV]);
    if (rootU === rootV) {
      redundant.push(index);
      emit('reject', `Edge ${index} is redundant: adding it creates a cycle in the processed undirected multigraph.`, [u, v]);
      return;
    }
    emit('compare_size', `Compare component sizes: ${size[rootU]} at root ${rootU} and ${size[rootV]} at root ${rootV}.`, [rootU, rootV]);
    if (size[rootU] < size[rootV]) {
      [rootU, rootV] = [rootV, rootU];
      emit('swap', `Use root ${rootU} for the larger component.`, [rootU, rootV]);
    }
    parent[rootV] = rootU;
    emit('attach', `Attach root ${rootV} to root ${rootU}. Only a root changes parent during union.`, [rootU, rootV]);
    size[rootU] += size[rootV];
    emit('grow', `The merged component has ${size[rootU]} nodes. Sizes at non-roots are no longer used.`, [rootU]);
    components--;
    accepted.push(index);
    emit('decrement', `The union succeeds. ${components} components remain.`, [rootU, rootV]);
  });
  edgeId = null;
  emit('return', `Finished: ${components} components and ${redundant.length} redundant edges. The parent forest describes the disjoint sets.`);
  return frames;
}

export const unionFind = {
  id: 'union-find', title: 'Union Find',
  summary: 'Track disjoint sets with parent pointers, path compression, and union by size.',
  explanation: [
    'Union Find, also called a disjoint-set union structure, stores a collection of non-overlapping sets. Each node points to a parent. Following parents reaches a root, which represents the entire component. Initially, every node is its own component.',
    'find(node) returns that representative. Path compression makes each visited node point directly to the root. union(u, v) finds both roots and attaches the smaller component to the larger one. If both roots are equal, no merge is needed.',
    'Here, each input edge requests a union. A failed union detects a redundant edge in an undirected graph. The extra parent-pointer diagram shows the data structure itself: its links are bookkeeping pointers and may differ from the original graph edges.'
  ],
  steps: ['Initialize one parent and size entry per node.', 'Follow parent pointers to find the roots of both endpoints.', 'Compress each visited path while returning from find.', 'If roots match, mark the edge redundant; otherwise attach the smaller component to the larger.', 'Update the root size and component count, then process the next edge.'],
  complexity: {time: 'O(V) initialization, then O(α(V)) amortized per find or union; O(V + E α(V)) for all input edges.', space: 'O(V) for parents and sizes, plus O(E) for the returned redundant edge IDs. The recursive find uses O(log V) stack space before compression with union by size.'},
  notes: ['α is the inverse Ackermann function and grows extremely slowly. The bound is amortized across operations, not a constant worst-case guarantee for every find.', 'Root sizes count component members. Size entries at non-roots are ignored.', 'Isolated nodes remain separate components. Repeated edges and self-loops are redundant connections.', 'This teaching version uses full recursive path compression. The saved Redundant Connection reference uses iterative path halving.'],
  related: [{id: 'redundant-connection', title: 'Redundant Connection'}, {id: 'number-of-connected-components', title: 'Number of Connected Components'}],
  weighted: false, direction: 'undirected', sourceMode: 'none',
  examples: [
    {label: 'Merges and path compression', n: 9, edges: [[0, 1], [2, 3], [0, 2], [4, 5], [6, 7], [4, 6], [0, 4], [7, 1], [3, 5]]},
    {label: 'Cycle and isolated nodes', n: 6, edges: [[0, 1], [1, 2], [2, 0], [3, 4], [4, 4]]}
  ],
  code: unionListing.code, trace: unionTrace
};

const eulerListing = listing([
  ['function', 'def hierholzer(n, edges, start):'],
  ['initialize', '    outgoing = [[] for _ in range(n)]'],
  ['degrees', '    indegree, outdegree = [0] * n, [0] * n'],
  ['weak', '    weak = [[] for _ in range(n)]'],
  ['build', '    for edge_id, (u, v) in enumerate(edges):'],
  ['add', '        outgoing[u].append((v, edge_id))'],
  ['degree_add', '        outdegree[u] += 1; indegree[v] += 1'],
  ['weak_add', '        weak[u].append(v); weak[v].append(u)'],
  ['delta', '    delta = [outdegree[u] - indegree[u] for u in range(n)]'],
  ['ends', '    starts = [u for u in range(n) if delta[u] == 1]'],
  ['ends_minus', '    ends = [u for u in range(n) if delta[u] == -1]'],
  ['valid_degree', '    if any(abs(d) > 1 for d in delta) or (len(starts), len(ends)) not in [(0, 0), (1, 1)]:'],
  ['degree_error', '        return []  # No directed Eulerian trail has these degrees.'],
  ['valid_start', '    if edges and ((starts and start != starts[0]) or outdegree[start] == 0):'],
  ['start_error', '        return []  # Choose the required trail start or an active circuit vertex.'],
  ['reachable', '    seen, pending = {start}, [start]'],
  ['pending_loop', '    while pending:'],
  ['pop_check', '        u = pending.pop()'],
  ['neighbors', '        for v in weak[u]:'],
  ['not_seen', '            if v not in seen:'],
  ['visit', '                seen.add(v); pending.append(v)'],
  ['connected', '    if any(indegree[u] + outdegree[u] > 0 and u not in seen for u in range(n)):'],
  ['connection_error', '        return []  # All vertices with edges must be weakly connected.'],
  ['sort_loop', '    for neighbors in outgoing:'],
  ['sort', '        neighbors.sort(reverse=True)'],
  ['stack', '    stack, reverse_route, used = [start], [], 0'],
  ['loop', '    while stack:'],
  ['peek', '        u = stack[-1]'],
  ['has_edge', '        if outgoing[u]:'],
  ['consume', '            v, edge_id = outgoing[u].pop()'],
  ['push', '            stack.append(v); used += 1'],
  ['backtrack', '        else:'],
  ['append', '            reverse_route.append(stack.pop())'],
  ['route', '    route = reverse_route[::-1]'],
  ['all_used', '    if used != len(edges) or len(route) != len(edges) + 1:'],
  ['usage_error', '        return []'],
  ['return', '    return route']
]);

function eulerTrace({n, edges, source: start}) {
  const outgoing = Array.from({length: n}, () => []), weak = Array.from({length: n}, () => []);
  const indegree = Array(n).fill(0), outdegree = Array(n).fill(0), used = [], reverseRoute = [], stack = [], frames = [];
  const seen = new Set(), pending = [];
  let route = [], activeEdges = [];
  edges.forEach(([u, v], edgeId) => {
    outgoing[u].push([v, edgeId]); outdegree[u]++; indegree[v]++;
    weak[u].push(v); weak[v].push(u);
  });
  const delta = outdegree.map((value, u) => value - indegree[u]);
  function emit(key, message, activeNodes = [], options = {}) {
    frames.push({
      message, operation: message, codeLines: [eulerListing.lines[key]],
      variables: [['start', start], ['stack', [...stack]], ['reverse_route', [...reverseRoute]], ['route', [...route]], ['used / total edges', `${used.length} / ${edges.length}`], ['connectivity pending', [...pending]]],
      activeNodes: [...activeNodes], visitedNodes: [...seen], frontierNodes: [...stack],
      finishedNodes: [...new Set(reverseRoute)], activeEdges: [...activeEdges], acceptedEdges: [...used],
      table: {headers: ['Node', 'In-degree', 'Out-degree', 'Out − in', 'Unused outgoing'], rows: Array.from({length: n}, (_, u) => [u, indegree[u], outdegree[u], delta[u], outgoing[u].length])},
      ...options
    });
  }
  emit('delta', 'Build directed adjacency lists and count incoming and outgoing edges. Each parallel edge keeps its own ID.');
  const starts = delta.flatMap((d, u) => d === 1 ? [u] : []), ends = delta.flatMap((d, u) => d === -1 ? [u] : []);
  const invalid = delta.flatMap((d, u) => Math.abs(d) > 1 ? [u] : []);
  emit('valid_degree', 'A circuit needs equal in/out degrees. An open trail needs one start with out − in = 1 and one end with out − in = −1.');
  if (invalid.length || !((starts.length === 0 && ends.length === 0) || (starts.length === 1 && ends.length === 1))) {
    emit('degree_error', 'No Eulerian trail: the directed degree conditions fail. No route is returned.', [...new Set([...invalid, ...starts, ...ends])]);
    return frames;
  }
  emit('valid_start', starts.length ? `An open Eulerian trail must start at ${starts[0]}. The selected start is ${start}.` : 'The degrees permit a circuit. If edges exist, its start must have an outgoing edge.', [start]);
  if (edges.length && ((starts.length && start !== starts[0]) || outdegree[start] === 0)) {
    emit('start_error', `No route from selected start ${start}. ${starts.length ? `Choose ${starts[0]} as the start.` : 'Choose a node with outgoing edges.'}`, [start]);
    return frames;
  }
  seen.add(start); pending.push(start);
  emit('reachable', 'Check weak connectivity: temporarily ignore edge directions. Isolated vertices do not prevent an Eulerian trail.', [start]);
  while (pending.length) {
    const u = pending.pop();
    emit('pop_check', `Check the undirected neighbors of ${u}.`, [u]);
    for (const v of weak[u]) {
      if (!seen.has(v)) {
        seen.add(v); pending.push(v);
        emit('visit', `Node ${v} belongs to the same weakly connected component as the start.`, [u, v]);
      }
    }
  }
  const unreachable = Array.from({length: n}, (_, u) => u).filter(u => indegree[u] + outdegree[u] > 0 && !seen.has(u));
  if (unreachable.length) {
    emit('connection_error', `No Eulerian trail: vertices ${unreachable.join(', ')} have edges in another component. No route is returned.`, unreachable);
    return frames;
  }
  emit('connected', 'All vertices with edges are weakly connected, and the degree/start checks passed.');
  outgoing.forEach(neighbors => neighbors.sort((a, b) => b[0] - a[0] || b[1] - a[1]));
  emit('sort', 'Sort destinations in reverse order so popping picks the smallest destination, then the smallest edge ID.');
  stack.push(start);
  emit('stack', `Start the traversal stack at ${start}. The final route is still empty.`, [start]);
  while (stack.length) {
    const u = stack[stack.length - 1];
    activeEdges = [];
    emit('peek', `Look at the stack top ${u}. It has ${outgoing[u].length} unused outgoing edges.`, [u]);
    if (outgoing[u].length) {
      const [v, edgeId] = outgoing[u].pop();
      activeEdges = [edgeId];
      emit('consume', `Remove edge ${edgeId}: ${u} → ${v} from the unused adjacency list.`, [u, v]);
      stack.push(v); used.push(edgeId);
      emit('push', `Consume edge ${edgeId} and push ${v}. A vertex can appear on the stack more than once.`, [u, v]);
    } else {
      reverseRoute.push(stack.pop());
      emit('append', `${u} has no unused outgoing edge. Pop it into the reverse route. Append on backtracking, not on discovery.`, [u]);
    }
  }
  activeEdges = [];
  route = [...reverseRoute].reverse();
  emit('route', 'Reverse the completed backtracking order to obtain the forward Eulerian route.', route);
  if (used.length !== edges.length || route.length !== edges.length + 1) {
    route = [];
    emit('usage_error', 'No Eulerian trail: not every edge was consumed. No route is returned.');
    return frames;
  }
  emit('return', `Eulerian ${edges.length && route[0] === route[route.length - 1] ? 'circuit' : 'trail'}: ${route.join(' → ')}. Every edge is used exactly once.`, route);
  return frames;
}

export const hierholzer = {
  id: 'hierholzer', title: "Hierholzer’s algorithm",
  summary: 'Construct an Eulerian trail by consuming every edge once and recording vertices while backtracking.',
  explanation: [
    'An Eulerian trail uses every edge exactly once; vertices may repeat. If it ends where it starts, it is an Eulerian circuit. Hierholzer keeps a stack for the current walk and consumes unused outgoing edges one by one.',
    'When the stack top has no outgoing edges left, pop it into a reverse route. A dead end belongs at the end of the eventual answer. Reversing the completed backtracking order joins the walks into one trail.',
    'This workspace uses directed graphs. It checks the degree conditions, the chosen start, and weak connectivity of all vertices with edges before traversing. For an open trail, one vertex has one extra outgoing edge and one has one extra incoming edge. A circuit needs equal degrees everywhere. Isolated vertices are allowed.'
  ],
  steps: ['Count in-degrees and out-degrees and validate the selected start.', 'Check that all vertices with edges lie in one weakly connected component.', 'Sort outgoing destinations, then put the start on the stack.', 'Consume an unused outgoing edge and push its destination.', 'When no outgoing edge remains, pop the vertex into the reverse route.', 'Reverse that route and confirm every edge was consumed.'],
  complexity: {time: 'O(V + E) for validation and traversal. Sorting outgoing edges for deterministic smallest-destination order adds O(E log E) in the worst case.', space: 'O(V + E) for adjacency lists, the traversal stack, connectivity state, and the route.'},
  notes: ['Parallel edges and self-loops are separate edges and each must be consumed exactly once.', 'The displayed stack is a walk in progress, not the final answer. The reverse route is built only when a vertex is popped.', 'The sorted-destination rule matches the ordering idea in Reconstruct Itinerary. The generic workspace also validates arbitrary inputs; the practice problem supplies a valid itinerary.'],
  related: [{id: 'reconstruct-itinerary', title: 'Reconstruct Itinerary'}],
  weighted: false, direction: 'directed', sourceMode: 'single',
  examples: [
    {label: 'Circuit with repeated destinations', n: 4, edges: [[0, 1], [1, 2], [2, 0], [0, 3], [3, 0], [0, 1], [1, 0]], source: 0},
    {label: 'Open trail and backtracking', n: 4, edges: [[0, 1], [0, 2], [2, 0], [1, 3]], source: 0},
    {label: 'Disconnected circuits: no trail', n: 4, edges: [[0, 1], [1, 0], [2, 3], [3, 2]], source: 0},
    {label: 'Wrong start for an open trail', n: 3, edges: [[0, 1], [1, 2]], source: 1}
  ],
  code: eulerListing.code, trace: eulerTrace
};
