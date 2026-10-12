export default {
  pattern: 'Rightmost value at each breadth-first level',
  problem: 'Return the values visible when looking at a binary tree from its right side, from top to bottom.',
  example: 'root = [1,2,3,null,5,null,4]\nOutput: [1,3,4]',
  insight: 'Before processing a level, the queue contains exactly that level’s nodes in left-to-right order. Record q[-1].val, then pop the current level’s fixed number of nodes and enqueue their children.',
  steps: ['Return [] for an empty tree; otherwise enqueue the root.', 'Save n_nodes = len(q) and append the value at the back of the queue.', 'Pop exactly n_nodes entries. Append each left child before its right child.', 'The remaining queue is the next level. Repeat until it is empty.'],
  complexity: 'O(n) time, O(w) auxiliary queue space, and O(h) output space. Total space is O(w + h), bounded by O(n).',
  pitfall: 'Capture the level size before adding children. The rightmost visible node may come from a left subtree when the right subtree has no node at that depth. The source expects deque from the problem environment.',
  treeVisualizer: true
};
