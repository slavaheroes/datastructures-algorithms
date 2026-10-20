export default {
  pattern: 'Sorted backtracking with sibling deduplication',
  problem: 'Return every distinct subset of an integer array that may contain duplicate values.',
  example: 'nums = [1,2,2]\nOutput: [[],[1],[1,2],[1,2,2],[2],[2,2]]',
  insight: 'Sort first so equal values are adjacent. At one recursion depth, choosing the second equal value as a new sibling would duplicate the first choice. Skip it only when j > i; deeper calls are still allowed to choose another copy.',
  steps: ['Sort nums in place and copy the current path into the result on every call.', 'Loop j from i onward.', 'Skip nums[j] when j > i and nums[j] equals nums[j − 1].', 'Otherwise append the value, recurse with j + 1, and pop it on return.'],
  complexity: 'O(n log n + n · 2^n) worst-case time, including output copies. O(n) auxiliary space for the recursion, path, and Python sort workspace; O(n · 2^n) output space in the distinct-value worst case.',
  pitfall: 'Checking j > i rather than j > 0 preserves subsets such as [2,2]. The source carries curr_sum but never uses it to make a decision. Sorting mutates the input list.'
};
