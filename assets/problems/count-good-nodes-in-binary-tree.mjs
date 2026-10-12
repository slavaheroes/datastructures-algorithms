export default {
  pattern: 'Carry the path maximum downward',
  problem: 'Count nodes whose value is at least every value on the path from the root to that node.',
  example: 'root = [3,1,4,3,null,1,5]\nOutput: 4\nThe good values are the root 3, the lower 3, 4, and 5.',
  insight: 'Pass the largest value seen above the current node into depth-first search. If node.val ≥ max_val, increment self.ans. Each child receives max(node.val, max_val).',
  steps: ['Start at the root with max_val = −infinity, so the root is always good.', 'Count the current node when its value is at least the path maximum.', 'Visit each existing child with the updated maximum.', 'Return self.ans after both branches have been explored.'],
  complexity: 'O(n) time and O(h) recursive stack space. The counter and maximum for each call require constant space.',
  pitfall: 'Equality counts: a repeated path maximum is still good. The source assumes a nonempty root and does not reset self.ans, so use a fresh Solution for each independent tree.',
  treeVisualizer: true
};
