export default {
  pattern: 'Start one DFS per component',
  problem: 'Count connected components in an undirected graph with nodes labeled 0 through n − 1. Include isolated nodes.',
  example: 'n = 5, edges = [[0,1],[1,2],[3,4]]\nOutput: 2\nn = 3, edges = [] → 3',
  insight: 'DFS marks an entire component. The first unvisited node in the next outer-loop iteration therefore belongs to a component that has not yet been counted.',
  steps: ['Build adjacency sets in both directions and an empty visited set.', 'Scan every integer node from 0 through n − 1, including nodes absent from the edge list.', 'When a node is unvisited, increment res and call dfs(node, -1).', 'DFS returns for an already visited node; otherwise it marks the node and visits neighbors other than its parent.', 'Return res.'],
  complexity: 'O(V + E) time and O(V + E) auxiliary space for the graph, visited set, and recursive calls.',
  pitfall: 'Counting only nodes present in edges would miss isolated components. The parent parameter avoids the immediate return edge, while visited handles every other cycle. The graph is not modified during DFS.'
};
