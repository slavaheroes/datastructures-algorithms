import {mountBuildTree} from '../visualizations/tree-lessons.mjs';

export const mountVisualization = mountBuildTree;

export default {
  pattern: 'Preorder root with inorder boundaries',
  problem: 'Reconstruct a binary tree from its preorder and inorder traversals. Both traversals describe the same tree and contain unique values.',
  example: 'preorder = [3,9,20,15,7]\ninorder = [9,3,15,20,7]\nOutput: [3,9,20,null,null,15,7]',
  insight: 'Preorder supplies the next root. A map gives that value’s index in inorder, which divides the current interval into left and right subtrees. A shared preorder cursor consumes each value once; interval boundaries avoid copying slices.',
  steps: ['Build indices from each inorder value to its position; initialize pi = 0.', 'For an empty interval l > r, return None.', 'Create a node with preorder[pi], advance pi, and find its inorder position idx.', 'Build the left interval [l, idx - 1] before the right interval [idx + 1, r], then return the node.'],
  complexity: 'O(n) expected time for map lookups. O(n) auxiliary space for the index map plus O(h) recursive stack space, and O(n) output nodes.',
  pitfall: 'Build the left subtree first because preorder is root, left, right. Unique values are necessary for the value-to-index map. The source reuses the input arrays and passes boundaries rather than slicing them.'
};
