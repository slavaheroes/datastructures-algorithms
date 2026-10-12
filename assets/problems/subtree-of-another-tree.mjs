export default {
  pattern: 'Try each root with a structural comparison',
  problem: 'Determine whether root contains a subtree with exactly the same shape and node values as subRoot.',
  example: 'root = [3,4,5,1,2], subRoot = [4,1,2]\nOutput: true\nThe entire subtree rooted at 4 matches.',
  insight: 'Treat each node in root as a candidate subtree root. The local isSameTree helper compares a candidate with subRoot completely. If they differ, continue searching both branches.',
  steps: ['An empty subRoot is accepted; a missing root cannot contain a nonempty subRoot.', 'Compare root and subRoot with isSameTree, including missing children.', 'If they do not match, recursively search root.left and root.right.', 'Stop as soon as an exact match is found.'],
  complexity: 'O(n × m) worst-case time, where n and m are the two node counts. O(h_root + h_subRoot) is a safe recursive stack bound, at most O(n + m).',
  pitfall: 'A candidate with the same values but an extra child is not a match. This source checks complete subtrees, rather than allowing selected branches to be skipped.',
  treeVisualizer: true
};
