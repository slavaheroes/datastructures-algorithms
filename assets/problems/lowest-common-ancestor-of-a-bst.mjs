import {mountLca} from '../visualizations/tree-lessons.mjs';

export const mountVisualization = mountLca;

export default {
  pattern: 'Follow the BST interval',
  problem: 'Find the lowest node in a binary search tree that is an ancestor of both p and q. A node can be its own ancestor; both target nodes are present and values are unique.',
  example: 'root = [6,2,8,0,4,7,9,null,null,3,5]\np = 2, q = 8 → Output: 6\np = 2, q = 4 → Output: 2',
  insight: 'Order the target nodes by value. If both values are smaller than the current root, their ancestor lies left; if both are larger, it lies right. Stop when the values straddle the root or the root is either target.',
  steps: ['Swap p and q when needed so p.val ≤ q.val.', 'Return the current root when p.val < root.val < q.val.', 'Recurse left if both targets are smaller, or right if both are larger.', 'If root is p or q, return root: that target also contains the other target below it.'],
  complexity: 'O(h) time and O(h) recursive stack space. For a balanced BST h = O(log n); for a chain h = O(n).',
  pitfall: 'The final comparison uses node identity: pass the actual p and q objects from the tree. The directional rule depends on a valid BST with distinct values, rather than an arbitrary binary tree.'
};
