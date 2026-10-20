export default {
  pattern: 'Single-use choices with duplicate skipping',
  problem: 'Return unique combinations that sum to a target from a positive integer array that may contain duplicates. Each input occurrence can be used at most once.',
  example: 'candidates = [10,1,2,7,6,1,5], target = 8\nOutput: [[1,1,6],[1,2,5],[1,7],[2,6]]',
  insight: 'Sort the candidates and skip equal sibling choices, while passing j + 1 to consume each input occurrence once. A running curr_sum makes each sum check constant time. The saved implementation prunes on entry after the sum exceeds the target, rather than breaking the sorted loop early.',
  steps: ['Sort candidates in place, then start with index 0, empty path, and sum 0.', 'Save a copy and return when curr_sum equals target.', 'Return when the sum is too large or the starting index reaches the end.', 'For each remaining j, skip equal siblings, append candidates[j], recurse with j + 1 and the updated sum, then pop.'],
  complexity: 'O(n log n + n · 2^n) worst-case time including result copies. The search path and recursion use O(min(n, D + 1)) space for positive candidates, where D = floor(target / minimum candidate); Python sorting may use O(n) additional space, so total auxiliary space is O(n). Output uses O(S · min(n, D)) for S returned combinations.',
  pitfall: 'Separate occurrences of a value may both appear in one combination; duplicate skipping applies only to siblings at the same depth. Passing j instead of j + 1 would incorrectly allow unlimited reuse. The input list is sorted in place.'
};
