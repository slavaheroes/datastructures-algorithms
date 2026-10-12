export default {
  pattern: 'Stop inorder traversal at the kth value',
  problem: 'Return the kth smallest node value in a binary search tree, with k counted from 1. The problem guarantees 1 ≤ k ≤ the number of nodes.',
  example: 'root = [3,1,4,null,2], k = 1\nOutput: 1\nInorder values are [1,2,3,4].',
  insight: 'Inorder visits a BST from smallest to largest. Keep a remaining count cnt, decrement it when visiting a node, and save that node’s value when cnt reaches zero. Stop further traversal once the answer is found.',
  steps: ['Initialize cnt = k and res = -1.', 'Recursively visit the left child unless cnt is already zero.', 'After returning from the left subtree, check cnt again before decrementing it for the current node.', 'When cnt reaches zero, save node.val and return. Otherwise visit the right child.'],
  complexity: 'O(h + k) time and O(h) recursive stack space. In the worst case both bounds reach O(n). No complete inorder list is stored.',
  pitfall: 'The second cnt == 0 check prevents counting ancestors after finding the answer in a left subtree. The initial res = -1 is a fallback for invalid k, rather than a value indicating a valid result.',
  treeVisualizer: true
};
