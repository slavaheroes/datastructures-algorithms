export default {
  pattern: 'Halve a sorted search range',
  problem: 'Given a strictly increasing integer array nums and a target, return its zero-based index or −1 if it does not occur.',
  example: 'nums = [-1,0,3,5,9,12], target = 9\nOutput: 4',
  insight: 'The middle value divides a sorted array into values that are too small and values that are too large. Compare it with the target, then discard the half that cannot contain the answer.',
  steps: ['Set l = 0 and r = len(nums) − 1. These endpoints are inclusive.', 'While l <= r, calculate mid = (l + r) // 2. Return mid when nums[mid] equals target.', 'If nums[mid] is smaller than target, set l = mid + 1. Otherwise set r = mid − 1.', 'If the range becomes empty, return −1.'],
  complexity: 'O(log n) time for a nonempty array and O(1) auxiliary space. An empty array returns −1 immediately.',
  pitfall: 'Exclude mid after a failed comparison: keeping it can prevent the range from shrinking. The source expects sorted input and does not sort the array.'
};
