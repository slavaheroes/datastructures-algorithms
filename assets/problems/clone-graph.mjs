export default {
  pattern: 'DFS with an original-to-copy map',
  problem: 'Given a node in a connected undirected graph, return the corresponding node of a deep copy. Node objects have a value and a list of neighbor objects.',
  example: 'Original neighbors: 1 → [2,3], 2 → [1], 3 → [1]\nCopy neighbors: 1′ → [2′,3′], 2′ → [1′], 3′ → [1′]\nOriginal and copied objects are distinct.',
  insight: 'A value alone does not identify a graph node. Map each original node object to its copied object before exploring neighbors. A back edge then retrieves the existing copy instead of recursing forever.',
  steps: ['Call clone(node, {}) and return None immediately for a missing node.', 'Allocate Node(node.val) and record lookupTable[node] = new_node.', 'Build a new neighbors list in the same order as the original list.', 'Reuse lookupTable[n] for a previously copied neighbor; otherwise recursively clone that neighbor.', 'Assign the completed neighbor list to new_node and return it.'],
  complexity: 'O(V + E) time for the reachable component. O(V) map and recursion space, plus O(V + E) space for the copied graph.',
  pitfall: 'Register the copy before visiting any neighbor, including a self-loop. This source copies only nodes reachable from the supplied node and preserves repeated neighbor entries and neighbor order.'
};
