export default {
  pattern: 'Compare corresponding nodes',
  problem: 'Determine whether two binary trees have the same shape and the same value at every corresponding node.',
  example: 'p = [1,2,3], q = [1,2,3]\nOutput: true\np = [1,2], q = [1,null,2]\nOutput: false',
  insight: 'Two empty positions match. A missing node on only one side or unequal values proves the trees differ. Otherwise, compare both corresponding child pairs.',
  steps: ['Return True if both nodes are missing.', 'Return False if only one node is missing or the node values differ.', 'Compare p.left with q.left, then p.right with q.right. Both comparisons must succeed.'],
  complexity: 'O(n) time for matching trees with n nodes; mismatches can stop earlier. O(h) recursive stack space along corresponding branches.',
  pitfall: 'Equal traversal values do not guarantee equal shape unless missing-child positions are also represented. Python’s and short-circuits after the first failed subtree comparison.',
  treeVisualizer: true
};
