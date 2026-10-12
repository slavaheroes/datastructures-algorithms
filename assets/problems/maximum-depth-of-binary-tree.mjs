export default {
  pattern: 'Recursive subtree height',
  problem: 'Return the number of nodes on the longest path from the root to a leaf. An empty tree has depth zero.',
  example: 'root = [3,9,20,null,null,15,7]\nOutput: 3',
  insight: 'A subtree’s depth is one plus the greater depth of its two children. This source handles an empty node and a leaf directly before combining recursive results.',
  steps: ['Return 0 for None and 1 for a leaf.', 'Find the maximum depth of the left and right subtrees.', 'Add 1 for the current node. At root 3, the child depths are 1 and 2, so return 3.'],
  complexity: 'O(n) time and O(h) recursive stack space. A balanced tree has h = O(log n); a chain has h = O(n).',
  pitfall: 'Depth counts nodes here, so a one-node tree has depth 1. Missing children contribute zero.',
  treeVisualizer: true
};
