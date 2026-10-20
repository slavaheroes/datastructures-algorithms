export default {
  pattern: 'Sort starts, then merge adjacent candidates',
  problem: 'Merge every overlapping interval and return non-overlapping ranges that cover the same points. Touching closed intervals such as [1,4] and [4,5] also merge.',
  example: 'intervals = [[1,3],[2,6],[8,10],[15,18]]\n[1,3] and [2,6] overlap.\nOutput: [[1,6],[8,10],[15,18]]',
  insight: 'Sorting puts every possible extension of the current merged range next to it. Once an interval starts beyond the current end, every later start is at least as large, so that merged range is finished.',
  steps: ['Sort intervals lexicographically, primarily by start. Seed res with intervals[0].', 'Compare curr with the last result prev.', 'When curr[0] <= prev[1], replace the last result with [min(prev[0], curr[0]), max(prev[1], curr[1])]. The minimum is redundant after sorting but is present in the source.', 'Otherwise append curr as a new disjoint range. Continue through every interval, then return res.'],
  complexity: 'O(n log(n + 1)) time for sorting and a linear merge pass. O(n) space for the result and up to O(n) temporary storage used by Python’s sort. The scan itself has O(1) state beyond the output.',
  pitfall: 'The source assumes at least one interval because it reads intervals[0]. It sorts the supplied list in place. A merged result is a new pair, while unchanged ranges may share their nested list objects with the input. Use <= for closed intervals; changing it to < changes whether touching ranges merge.'
};
