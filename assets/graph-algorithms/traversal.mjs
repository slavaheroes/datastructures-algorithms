// Standalone teaching implementations. The saved NeetCode solutions stay unchanged.
const clone = value => JSON.parse(JSON.stringify(value));
const line = (code, statement) => code.split('\n').findIndex(text => text.trim() === statement) + 1;

function adjacency({n, edges, directed}) {
  const adj = Array.from({length: n}, () => []);
  edges.forEach(([u, v], id) => {
    adj[u].push([v, id]);
    if (!directed) adj[v].push([u, id]);
  });
  return adj;
}

const dfsCode = `def has_cycle(n, edges, directed=True):
    adj = [[] for _ in range(n)]
    for edge_id, (u, v) in enumerate(edges):
        adj[u].append((v, edge_id))
        if not directed:
            adj[v].append((u, edge_id))
    state = [0] * n  # 0: unseen, 1: active, 2: finished

    def dfs(u, parent_edge=-1):
        state[u] = 1
        for v, edge_id in adj[u]:
            if not directed and edge_id == parent_edge:
                continue
            if state[v] == 1 or (not directed and state[v] == 2):
                return True
            if state[v] == 0 and dfs(v, edge_id):
                return True
        state[u] = 2
        return False

    for u in range(n):
        if state[u] == 0 and dfs(u):
            return True
    return False`;

export const dfsCycle = {
  id: 'dfs-cycle-detection',
  title: 'DFS for cycle detection',
  summary: 'Follow a depth-first search and distinguish the active recursion path from finished nodes.',
  explanation: [
    'Depth-first search follows one path as far as possible before returning to another branch. Track three states: unseen, active on the current recursion path, and finished after all outgoing edges have been checked.',
    'In a directed graph, an edge to an active node closes a cycle. An edge to a finished node is safe: the two paths may simply merge. Start another DFS from every unseen node so disconnected components are checked too.',
    'In an undirected graph, skip the exact edge used to enter the current node. Any other edge to a visited node closes a cycle. Tracking the parent edge, rather than only the parent node, also handles parallel edges correctly.'
  ],
  steps: [
    'Choose an unseen node and mark it active when its recursive call starts.',
    'Inspect each adjacent edge; in an undirected graph, skip only the incoming edge.',
    'Recurse into an unseen neighbor. An edge to an active node detects a cycle; a directed edge to a finished node does not.',
    'After all neighbors are checked, mark the node finished and return. Continue from unseen components.'
  ],
  complexity: {time: 'O(V + E): visit every node and inspect every adjacency entry once.', space: 'O(V + E) including the adjacency list; O(V) for states and the recursion stack.'},
  notes: [
    'Visited alone is not enough for directed cycle detection: active and finished nodes have different meanings.',
    'A self-loop is a cycle. Two parallel undirected edges form a two-edge cycle in this multigraph model.',
    'The graph is limited to 16 nodes here. Recursive Python DFS may reach the recursion limit on much larger graphs.'
  ],
  related: [{id: 'course-schedule', title: 'Course Schedule'}, {id: 'graph-valid-tree', title: 'Graph Valid Tree'}],
  weighted: false, direction: 'choice', sourceMode: 'none',
  examples: [
    {label: 'Directed cycle', n: 5, edges: [[0, 1], [1, 2], [2, 0], [2, 3]], directed: true},
    {label: 'Directed acyclic graph', n: 6, edges: [[0, 1], [0, 2], [1, 3], [2, 3], [4, 5]], directed: true},
    {label: 'Undirected tree', n: 6, edges: [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5]], directed: false}
  ],
  code: dfsCode,
  trace(input) {
    const {n, directed} = input, adj = adjacency(input);
    const state = Array(n).fill(0), stack = [], treeEdges = [], frames = [];
    const emit = (message, statement, extra = {}) => {
      frames.push(clone({
        message, operation: message, codeLines: [line(dfsCode, statement)],
        variables: [['state', state], ['call stack', stack], ['directed', directed]],
        activeNodes: [], visitedNodes: state.flatMap((s, i) => s ? [i] : []),
        finishedNodes: state.flatMap((s, i) => s === 2 ? [i] : []), frontierNodes: stack,
        activeEdges: [], acceptedEdges: treeEdges, rejectedEdges: [],
        table: {headers: ['Node', 'DFS state'], rows: state.map((s, i) => [i, ['unseen', 'active', 'finished'][s]])},
        ...extra
      }));
    };
    emit('All nodes are unseen. Check every component for a cycle.', 'state = [0] * n  # 0: unseen, 1: active, 2: finished');
    function dfs(u, parentEdge = -1) {
      state[u] = 1;
      stack.push(u);
      emit(`Enter node ${u}; it is now on the active recursion path.`, 'state[u] = 1', {activeNodes: [u]});
      for (const [v, edgeId] of adj[u]) {
        emit(`Inspect edge ${u} ${directed ? '→' : '—'} ${v}.`, 'for v, edge_id in adj[u]:', {activeNodes: [u, v], activeEdges: [edgeId]});
        if (!directed && edgeId === parentEdge) {
          emit('Skip the incoming undirected edge; traversing it backward does not form a cycle.', 'continue', {activeNodes: [u], activeEdges: [edgeId]});
          continue;
        }
        if (state[v] === 1 || (!directed && state[v] === 2)) {
          emit(`Cycle found: edge ${u} ${directed ? '→' : '—'} ${v} reaches ${state[v] === 1 ? 'an active' : 'a visited'} node${directed ? ' on the current path' : ' through a different edge'}.`, 'return True', {activeNodes: [u, v], activeEdges: [edgeId], rejectedEdges: [edgeId]});
          return true;
        }
        if (state[v] === 0) {
          treeEdges.push(edgeId);
          emit(`Node ${v} is unseen; follow this edge into a recursive call.`, 'if state[v] == 0 and dfs(v, edge_id):', {activeNodes: [u, v], activeEdges: [edgeId]});
          if (dfs(v, edgeId)) return true;
        } else {
          emit(`Node ${v} is finished. This directed edge does not close the active path.`, 'if state[v] == 1 or (not directed and state[v] == 2):', {activeNodes: [u], activeEdges: [edgeId]});
        }
      }
      state[u] = 2;
      stack.pop();
      emit(`Finish node ${u} and return to its caller.`, 'state[u] = 2', {activeNodes: [u]});
      return false;
    }
    for (let u = 0; u < n; u++) {
      if (state[u] !== 0) continue;
      emit(`Start a DFS in the component containing node ${u}.`, 'if state[u] == 0 and dfs(u):', {activeNodes: [u]});
      if (dfs(u)) return frames;
    }
    emit('No cycle exists: every component has finished without finding a closing edge.', 'return False');
    // Highlight the outer return, not the identically named recursive return.
    frames[frames.length - 1].codeLines = [dfsCode.split('\n').length];
    return frames;
  }
};

const bfsCode = `from collections import deque

def multi_source_bfs(n, edges, sources, directed=False):
    adj = [[] for _ in range(n)]
    for edge_id, (u, v) in enumerate(edges):
        adj[u].append((v, edge_id))
        if not directed:
            adj[v].append((u, edge_id))
    distance = [None] * n
    queue = deque()
    for source in sources:
        if distance[source] is None:
            distance[source] = 0
            queue.append(source)
    while queue:
        u = queue.popleft()
        for v, edge_id in adj[u]:
            if distance[v] is None:
                distance[v] = distance[u] + 1
                queue.append(v)
    return distance`;

export const multiSourceBfs = {
  id: 'multi-source-bfs',
  title: 'Multi-source BFS',
  summary: 'Start from several nodes at once and find each node’s distance to its nearest source.',
  explanation: [
    'Ordinary breadth-first search begins with one source. Multi-source BFS puts every source into the same queue with distance zero before processing any of them. Their search fronts then expand together, one edge at a time.',
    'Because every edge has the same cost, the first discovery of a node gives its shortest distance from any source. Mark nodes when they enter the queue so they are not added again. Nodes unreachable from every source keep distance None.',
    'On a grid, neighbors are usually the four adjacent cells. Rotting Oranges starts with every rotten orange; Islands and Treasure starts with every treasure cell. The same queue rule applies to the graph shown here.'
  ],
  steps: [
    'Set every distance to None. Set each source distance to zero and enqueue every source.',
    'Remove the oldest queued node.',
    'For each undiscovered neighbor, assign current distance + 1 and immediately enqueue it.',
    'Repeat until the queue is empty. The distances describe the nearest source; None means unreachable.'
  ],
  complexity: {time: 'O(V + E): each node enters the queue at most once and each adjacency entry is inspected once.', space: 'O(V + E) including the adjacency list; O(V) for the distance array and queue.'},
  notes: [
    'This computes shortest paths only when all edges have equal cost. Use Dijkstra for nonnegative, unequal weights.',
    'Source order decides which source discovers a tied node first, but it does not change shortest distances.',
    'Distances count edges. Directed mode follows outgoing edges only.'
  ],
  related: [{id: 'rotting-oranges', title: 'Rotting Oranges'}, {id: 'islands-and-treasure', title: 'Islands and Treasure'}],
  weighted: false, direction: 'choice', sourceMode: 'multi',
  examples: [
    {label: 'Two search fronts', n: 8, edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [2, 7]], sources: [0, 6], directed: false},
    {label: 'Unreachable node', n: 7, edges: [[0, 1], [1, 2], [3, 4], [4, 5]], sources: [0, 3], directed: false},
    {label: 'Directed edges', n: 6, edges: [[0, 1], [1, 2], [3, 2], [4, 3], [5, 4]], sources: [0, 5], directed: true}
  ],
  code: bfsCode,
  trace(input) {
    const {n, sources} = input, adj = adjacency(input);
    const distance = Array(n).fill(null), queue = [], processed = [], treeEdges = [], frames = [];
    const emit = (message, statement, extra = {}) => {
      frames.push(clone({
        message, operation: message, codeLines: [line(bfsCode, statement)],
        variables: [['sources', sources], ['queue (front first)', queue], ['distance', distance]],
        activeNodes: [], visitedNodes: distance.flatMap((d, i) => d === null ? [] : [i]),
        frontierNodes: queue, finishedNodes: processed, activeEdges: [], acceptedEdges: treeEdges,
        table: {headers: ['Node', 'Distance', 'State'], rows: distance.map((d, i) => [i, d === null ? 'None' : d, processed.includes(i) ? 'finished' : queue.includes(i) ? 'queued' : d === null ? 'unreachable so far' : 'expanding'])},
        ...extra
      }));
    };
    emit('Begin with all nodes undiscovered. Queue every source before expanding any node.', 'distance = [None] * n');
    for (const source of sources) {
      if (distance[source] !== null) continue;
      distance[source] = 0;
      queue.push(source);
      emit(`Source ${source} has distance 0; add it to the queue.`, 'queue.append(source)', {activeNodes: [source]});
    }
    while (queue.length) {
      const u = queue.shift();
      emit(`Remove node ${u} from the front of the queue; its distance is ${distance[u]}.`, 'u = queue.popleft()', {activeNodes: [u]});
      for (const [v, edgeId] of adj[u]) {
        if (distance[v] === null) {
          distance[v] = distance[u] + 1;
          queue.push(v);
          treeEdges.push(edgeId);
          emit(`Discover node ${v} at distance ${distance[v]}; mark it now and enqueue it once.`, 'queue.append(v)', {codeLines: [line(bfsCode, 'distance[v] = distance[u] + 1'), line(bfsCode, 'queue.append(v)')], activeNodes: [u, v], activeEdges: [edgeId]});
        } else {
          emit(`Node ${v} already has distance ${distance[v]}; do not enqueue it again.`, 'if distance[v] is None:', {activeNodes: [u], activeEdges: [edgeId]});
        }
      }
      processed.push(u);
      emit(`All neighbors of node ${u} have been checked.`, 'while queue:', {activeNodes: [u]});
    }
    const unreachable = distance.flatMap((d, i) => d === null ? [i] : []);
    emit(`Queue empty. ${unreachable.length ? `Nodes ${unreachable.join(', ')} are unreachable from every source.` : 'Every node has its shortest distance from the nearest source.'}`, 'return distance');
    return frames;
  }
};

const kahnCode = `from collections import deque

def topological_sort(n, edges):
    adj = [[] for _ in range(n)]
    indegree = [0] * n
    for edge_id, (u, v) in enumerate(edges):
        adj[u].append((v, edge_id))
        indegree[v] += 1
    queue = deque(u for u in range(n) if indegree[u] == 0)
    order = []
    while queue:
        u = queue.popleft()
        order.append(u)
        for v, edge_id in adj[u]:
            indegree[v] -= 1
            if indegree[v] == 0:
                queue.append(v)
    if len(order) != n:
        return None  # A cycle prevents a complete ordering.
    return order`;

export const kahn = {
  id: 'kahn-topological-sort',
  title: 'Kahn’s topological sort',
  summary: 'Build a dependency order by repeatedly removing nodes with zero incoming edges.',
  explanation: [
    'A topological order places each node before all nodes that depend on it. For an edge u → v, u must appear before v. Such a complete ordering exists exactly when the directed graph has no cycle.',
    'Kahn’s algorithm counts incoming edges for every node. A node with indegree zero has no remaining prerequisites, so it can be processed. Removing its outgoing edges may free other nodes, which enter the queue when their indegree becomes zero.',
    'If the queue becomes empty before every node is processed, a cycle prevents completion. The remaining nodes are blocked by a cycle: some may be downstream from the cycle rather than members of it.'
  ],
  steps: [
    'Count each node’s indegree and enqueue all nodes with indegree zero.',
    'Remove the first queued node and append it to the ordering.',
    'Remove each outgoing edge by decreasing its destination’s indegree. Enqueue a destination when its indegree reaches zero.',
    'If all nodes were processed, return the ordering. Otherwise report that a cycle prevents a complete order.'
  ],
  complexity: {time: 'O(V + E): initialize indegrees, process every node once, and remove every edge once.', space: 'O(V + E) including the adjacency list; O(V) for indegrees, the queue, and the order.'},
  notes: [
    'Topological sorting applies to directed graphs. It does not sort nodes by numeric value.',
    'A graph can have several valid orders. This example starts zero-indegree nodes in numeric order and processes outgoing edges in input order.',
    'An isolated node has indegree zero and belongs in the ordering. Parallel edges each contribute one to indegree.'
  ],
  related: [{id: 'course-schedule', title: 'Course Schedule'}, {id: 'course-schedule-ii', title: 'Course Schedule II'}, {id: 'alien-dictionary', title: 'Alien Dictionary'}],
  weighted: false, direction: 'directed', sourceMode: 'none',
  examples: [
    {label: 'Dependency order', n: 6, edges: [[0, 2], [1, 2], [1, 3], [2, 4], [3, 4], [4, 5]], directed: true},
    {label: 'Cycle blocks later nodes', n: 6, edges: [[0, 1], [1, 2], [2, 1], [2, 3], [4, 5]], directed: true},
    {label: 'Isolated nodes', n: 5, edges: [[0, 1], [1, 2]], directed: true}
  ],
  code: kahnCode,
  trace(input) {
    const {n, edges} = input;
    const adj = adjacency({...input, directed: true});
    const indegree = Array(n).fill(0), queue = [], order = [], removed = [], frames = [];
    for (const [, v] of edges) indegree[v]++;
    const emit = (message, statement, extra = {}) => {
      frames.push(clone({
        message, operation: message, codeLines: [line(kahnCode, statement)],
        variables: [['indegree', indegree], ['queue (front first)', queue], ['order', order]],
        activeNodes: [], visitedNodes: order, finishedNodes: order, frontierNodes: queue,
        activeEdges: [], acceptedEdges: removed,
        table: {headers: ['Node', 'Remaining indegree', 'State'], rows: indegree.map((d, i) => [i, d, order.includes(i) ? 'ordered' : queue.includes(i) ? 'ready' : 'waiting'])},
        ...extra
      }));
    };
    emit('Count the incoming edges for every node.', 'indegree[v] += 1');
    for (let u = 0; u < n; u++) if (indegree[u] === 0) queue.push(u);
    emit(`Queue all zero-indegree nodes: ${queue.length ? queue.join(', ') : 'none'}.`, 'queue = deque(u for u in range(n) if indegree[u] == 0)');
    while (queue.length) {
      const u = queue.shift();
      emit(`Remove ready node ${u} from the queue.`, 'u = queue.popleft()', {activeNodes: [u]});
      order.push(u);
      emit(`Append node ${u} to the dependency order.`, 'order.append(u)', {activeNodes: [u]});
      for (const [v, edgeId] of adj[u]) {
        indegree[v]--;
        removed.push(edgeId);
        emit(`Remove edge ${u} → ${v}; node ${v} now has indegree ${indegree[v]}.`, 'indegree[v] -= 1', {activeNodes: [u, v], activeEdges: [edgeId]});
        if (indegree[v] === 0) {
          queue.push(v);
          emit(`Node ${v} has no remaining incoming edges; enqueue it.`, 'queue.append(v)', {activeNodes: [v]});
        }
      }
    }
    if (order.length !== n) {
      const blocked = Array.from({length: n}, (_, u) => u).filter(u => !order.includes(u));
      emit(`No complete topological order exists. Nodes ${blocked.join(', ')} are blocked by a cycle; they are not necessarily all cycle members.`, 'return None  # A cycle prevents a complete ordering.', {activeNodes: blocked, variables: [['indegree', indegree], ['queue (front first)', queue], ['partial order', order], ['blocked nodes', blocked]]});
    } else {
      emit(`Complete topological order: ${order.join(' → ')}. Every edge points forward in this order.`, 'return order');
    }
    return frames;
  }
};
