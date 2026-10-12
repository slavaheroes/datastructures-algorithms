export default {
  pattern: 'Size-k min-heap',
  problem: 'Return the kth largest element of a nonempty array. Count duplicate values separately; this is an order statistic rather than the kth distinct value.',
  example: 'nums = [3,2,3,1,2,4,5,5,6], k = 4\nThe four largest values are [4,5,5,6].\nOutput: 4',
  insight: 'Keep the largest k values encountered in a min-heap. Its root is the smallest of those retained values, which is the current kth largest. A new value can change that boundary only when it is larger than the root; heapreplace removes the old boundary and inserts the larger candidate in one operation.',
  steps: ['Copy the first k values and heapify that copy as a min-heap.', 'Scan the remaining array by index so no second slice of the remaining values is created.', 'If a value is larger than heap[0], call heapreplace. If it is smaller or equal, leave the heap unchanged.', 'After the scan, return heap[0]. The original nums array is preserved.'],
  complexity: 'O(k) heap construction and O((n − k) log(k + 1)) worst-case scanning work, giving O(n log(k + 1)) time overall. O(k) auxiliary space for the copied heap.',
  pitfall: 'Require 1 ≤ k ≤ len(nums). Duplicates remain separate entries in the heap. heapreplace is used only after checking the candidate against the root; replacing with a smaller value would discard one of the largest k.'
};
