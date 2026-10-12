export default {
  pattern: 'Swap children with depth-first search',
  problem: 'Mirror a binary tree by exchanging the left and right child of every node. Return the root of the modified tree.',
  example: 'root = [4,2,7,1,3,6,9]\nOutput: [4,7,2,9,6,3,1]',
  insight: 'Each subtree can be mirrored independently. Recursively invert both children and assign them to opposite sides of the current node.',
  steps: ['Return None when the current node is missing.', 'Invert the original right subtree and the original left subtree.', 'Assign those roots to node.left and node.right, respectively. Return node.'],
  complexity: 'O(n) time and O(h) recursive stack space, where n is the number of nodes and h is the tree height. The tree is changed in place.',
  pitfall: 'Swapping only the root’s children leaves the deeper subtrees unchanged. Python evaluates both right-hand expressions before the tuple assignment, so neither original child is lost.',
  treeVisualizer: true
};
