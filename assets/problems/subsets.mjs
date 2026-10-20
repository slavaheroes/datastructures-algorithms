export default {
  pattern: 'Start-index backtracking',
  problem: 'Return every subset of an array of distinct integers. Each element can be chosen at most once, and the order of the returned subsets does not matter.',
  example: 'nums = [1,2,3]\nOutput: [[],[1],[1,2],[1,2,3],[1,3],[2],[2,3],[3]]',
  insight: 'Every recursive call already represents one valid subset. Copy it into the result, then try each remaining index as the next choice. Passing j + 1 keeps indices increasing, so the same subset cannot be generated in a different order.',
  steps: ['Start backtrack(0, []) and save a copy of the empty path.', 'For every j from the starting index to the end, append nums[j].', 'Recurse with j + 1; the chosen element and all earlier indices are no longer available.', 'Pop the last element after the recursive call so the next sibling starts from the same path.'],
  complexity: 'O(n · 2^n) time including copies of the 2^n subsets. O(n) auxiliary space for the path and recursion; O(n · 2^n) output space.',
  pitfall: 'Append curr_list.copy(), because appending the mutable path itself would make every result refer to the same list. The source assumes distinct values; use Subsets II when input values may repeat. Empty input returns [[]].'
};
