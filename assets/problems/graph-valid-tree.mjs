export default {
  pattern: 'Undirected DFS with a parent edge',
  problem: 'Determine whether an undirected graph on n nodes labeled 0 through n − 1 is a tree: connected and free of cycles.',
  example: 'n = 5, edges = [[0,1],[0,2],[0,3],[1,4]] → True\nn = 3, edges = [[0,1],[1,2],[2,0]] → False',
  insight: 'In an undirected graph, seeing the edge back to the DFS parent is expected. Reaching any other already visited node exposes a cycle. A successful traversal must also reach all n nodes.',
  steps: ['Build adjacency sets in both directions.', 'Start dfs(0, -1). Return False if the current node has already been visited.', 'Add the current node to visited and recursively search each neighbor except its parent.', 'Propagate False immediately if any recursive call finds a cycle.', 'Return True only when DFS succeeds and len(visited) equals n.'],
  complexity: 'O(V + E) time and O(V + E) auxiliary space, including adjacency sets and up to O(V) recursive calls.',
  pitfall: 'The implementation assumes n ≥ 1 and the problem’s simple-graph input. Sets discard repeated edges, so duplicate edges are not treated as a two-edge cycle. Connectivity is necessary even if no cycle is found in node 0’s component.'
};
