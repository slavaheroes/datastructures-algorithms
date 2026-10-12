export default {
  pattern: 'Check strictly increasing inorder values',
  problem: 'Determine whether every node obeys the binary search tree rule: all values in its left subtree are smaller, and all values in its right subtree are larger.',
  example: 'root = [2,1,3]\nOutput: true\nroot = [5,1,4,null,null,3,6]\nOutput: false\nInorder values [1,5,3,4,6] are not strictly increasing.',
  insight: 'An inorder traversal visits a BST’s values in sorted order. This source collects the complete traversal in a list, then rejects any adjacent pair that is equal or decreasing.',
  steps: ['Recursively visit the left subtree, append the current value, then visit the right subtree.', 'Inspect inorder[i] and inorder[i - 1] for every adjacent pair.', 'Return False if inorder[i] ≤ inorder[i - 1]; otherwise return True after the scan.'],
  complexity: 'O(n) time and O(n) auxiliary space for the stored inorder values, including O(h) recursive stack space.',
  pitfall: 'The condition applies to the whole subtree, rather than only immediate children. Duplicates are rejected because the ordering must be strictly increasing. An empty tree is accepted.',
  treeVisualizer: true
};
