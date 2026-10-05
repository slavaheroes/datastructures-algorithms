import {mountWindow} from '../visualizations/sliding-window.mjs';
export default {
  pattern: 'Lazy max-heap or monotonic deque',
  problem: 'For each contiguous window of k numbers, return its maximum. The problem requires 1 ≤ k ≤ the number of elements.',
  example: 'nums = [1,3,-1,-3,5,3,6,7], k = 3\nOutput: [3,3,5,5,6,7]',
  insight: 'The first source uses a max-heap of (value, index) pairs and removes expired entries only when they reach the root. The efficient version keeps indices in a deque with nonincreasing values: a newer, larger value makes smaller values behind it useless for all future windows.',
  steps: ['Heap version: push the first k pairs. Before sliding, append the root value to result. Insert the next pair and advance the left boundary.', 'Pop heap roots whose indices precede the new left boundary. After the loop, append the last window maximum. Pair comparison favors the newer index when values tie.', 'Deque version: remove smaller values from the back, append the current index, and remove an expired index from the front.', 'Once a full window exists, append the front value and advance the left boundary. Equal values remain in the deque because the comparison is strictly smaller.'],
  complexity: 'Heap version: O(n log n) time and O(n) auxiliary space in the worst case because expired non-root entries remain. Deque version: O(n) time and O(k) auxiliary space; each index enters and leaves at most once. Both allocate O(n − k + 1) output space.',
  pitfall: 'Store indices so expiration can be checked. The heap is not limited to k entries. The source uses Python 3.14 max-heap functions and platform-provided heapq/deque names. The demo shows the heap in priority order rather than its internal array layout.'
};
export const mountVisualization = root => mountWindow(root, 'maximum');
