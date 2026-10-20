export default {
  pattern: 'Backtracking with used indices',
  problem: 'Return every ordering of an array of distinct integers. Every input element appears exactly once in each permutation.',
  example: 'nums = [1,2,3]\nOutput: [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]',
  insight: 'Unlike subsets, the next choice can come from any unused input index. A set named path tracks indices already chosen, while curr stores their values in order. Copy curr only when it contains every value.',
  steps: ['Begin with an empty used-index set and an empty value list.', 'At each depth scan all input indices; skip those already in the set.', 'Append a value, add its index, and recurse.', 'After returning, discard the index and pop its value. Save a copy whenever curr reaches length n.'],
  complexity: 'O(n · n!) time for the output copies and the full index scans across the recursion tree. O(n) auxiliary space for the set, path, and recursion; O(n · n!) output space.',
  pitfall: 'The set contains indices, not values. The source assumes distinct integers; repeated values would produce repeated permutations. Empty input produces one empty permutation, [[]].'
};
