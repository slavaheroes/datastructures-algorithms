import {mountMedianStream} from '../visualizations/heap-lessons.mjs';

export const mountVisualization = mountMedianStream;

export default {
  pattern: 'Lower max-heap and upper min-heap',
  problem: 'Support inserting numbers into a stream and returning the median of all values seen so far. For an even count, the median is the average of the two middle values.',
  example: 'addNum(1); findMedian() → 1\naddNum(2); findMedian() → 1.5\naddNum(3); findMedian() → 2',
  insight: 'Partition the values into a lower half in maxHeap and an upper half in minHeap. The two roots expose the middle boundary, and heap sizes differ by at most one. This source compares each incoming number with its stored median and, when needed, moves a root to the other heap before inserting into the chosen half.',
  steps: ['Start with two empty heaps and median = None. Put the first number into minHeap, save it as the median, and return.', 'If num > median, choose minHeap. If that upper heap is already larger, first move its minimum root into maxHeap, then push num into minHeap.', 'Otherwise choose maxHeap, including values equal to the median. If that lower heap is already larger, first move its maximum root into minHeap, then push num into maxHeap.', 'Update the stored median: average the roots when sizes match; otherwise use the root of the larger heap. findMedian simply returns the stored value.'],
  complexity: 'Each addNum takes O(log(n + 1)) time for n values seen so far. findMedian takes O(1) time because the median is stored after every insertion. O(n) total heap space.',
  pitfall: 'The source uses Python 3.14 max-heap functions for the lower half, so values are stored directly rather than negated. Equal incoming values go to maxHeap. Before any insertion, findMedian returns None in this implementation; the problem normally requests a median only after a value has been added. Heap arrays are not sorted lists.'
};
