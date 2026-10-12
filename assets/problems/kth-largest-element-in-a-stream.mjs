export default {
  pattern: 'Keep the k largest values in a min-heap',
  problem: 'Maintain the kth largest value of a stream. Construct the object from an initial array, then return the current kth largest value after each add operation.',
  example: 'k = 3, nums = [4,5,8,2]\nadd(3) → 4\nadd(5) → 5\nadd(10) → 5\nadd(9) → 8\nadd(4) → 8',
  insight: 'The smallest value among the k largest values is the kth largest overall. The source heapifies the original nums list, removes minimums until at most k values remain, and retains that list as self.heap. Each insertion keeps the same boundary by discarding the minimum when the heap grows beyond k.',
  steps: ['Save k and use nums itself as the min-heap; heapify changes the supplied list in place.', 'Remove minimums while the heap has more than k elements. Values left in the heap are the largest k seen so far.', 'For add(val), push val. If there are now k + 1 elements, pop the minimum.', 'Return heap[0]. Once k values have been seen, this root is the kth largest; equal values count separately.'],
  complexity: 'For m initial values, construction takes O(m + max(0, m − k) log(m + 1)) time. Each add takes O(log(k + 1)) time. The object retains up to k values after trimming, so its logical heap storage is O(k); construction uses the input list rather than allocating a second heap.',
  pitfall: 'The problem guarantees that the kth largest value exists when it is requested. Before k values have been seen, the root is only the smallest value seen so far. k must be positive, and a heap is only partially ordered: heap[0] is the minimum, but the rest of the list is not sorted.'
};
