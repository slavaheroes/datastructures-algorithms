export default {
  pattern: 'Subtree heights with a running maximum',
  problem: 'Return the largest number of edges on any path between two nodes in a binary tree. The path may pass through any node.',
  example: 'root = [1,2,3,4,5]\nOutput: 3\nA longest path is 4 → 2 → 1 → 3.',
  insight: 'For every node, left_height + right_height is the longest path that turns there. Recursive calls return subtree heights; the outermost call returns the largest diameter stored in self.maxDiam.',
  steps: ['A missing node returns height 0.', 'Compute both child heights before inspecting the current node.', 'Update self.maxDiam with left_height + right_height.', 'Inner calls return 1 + max(left_height, right_height). The call at rec_depth = 0 returns self.maxDiam.'],
  complexity: 'O(n) time and O(h) recursive stack space. The running maximum uses O(1) additional space.',
  pitfall: 'The diameter counts edges while the recursive return counts nodes. self.maxDiam is a class-backed value updated on the instance; use a fresh Solution for each independent tree because this source does not reset it.',
  treeVisualizer: true
};
