export default {
  pattern: 'Postorder height checks',
  problem: 'Determine whether every node’s left and right subtree heights differ by at most one.',
  example: 'root = [3,9,20,null,null,15,7]\nOutput: true\nroot = [1,2,2,3,3,null,null,4,4]\nOutput: false',
  insight: 'Calculate heights from the leaves upward and check the balance condition at the same time. self.res records any imbalance, and subsequent helper calls return early once it becomes false.',
  steps: ['A missing node has height 0.', 'Find the left and right heights, then set self.res = False if their difference exceeds 1.', 'Return 1 + max(left_h, right_h) to the parent.', 'Return self.res after visiting the root. Once false, later height calls stop immediately.'],
  complexity: 'O(n) time in the worst case and O(h) recursive stack space.',
  pitfall: 'Checking only the root is insufficient: an imbalance can occur deeper down. This source does not reset self.res, so use a fresh Solution for each independent check.',
  treeVisualizer: true
};
