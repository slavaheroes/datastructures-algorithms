export default {
  pattern: 'Min-heap of squared distances',
  problem: 'Return the k points closest to (0, 0), using Euclidean distance. The result may be returned in any order.',
  example: 'points = [[1,3],[-2,2],[2,-2]], k = 2\nSquared distances: [10,8,8]\nOutput: [[-2,2],[2,-2]]',
  insight: 'Squaring preserves the order of nonnegative distances, so there is no need to compute square roots. The source makes one (squared distance, original index) tuple for each point, heapifies these tuples, and pops k of them. The index retrieves the original point and breaks equal-distance ties.',
  steps: ['For every point (x, y), append (x² + y², index) to distances.', 'Heapify the complete distances list as a min-heap.', 'Pop the minimum tuple k times and use its index to select the corresponding original point.', 'Return those selected points. In this implementation, equal distances are popped in original-index order.'],
  complexity: 'For n points, O(n + k log(n + 1)) time and O(n) auxiliary heap space, plus O(k) space for the result.',
  pitfall: 'This source keeps all n distances rather than maintaining a size-k heap. The point coordinates are not changed. k must be between 0 and n; popping more than n points would exhaust the heap.'
};
