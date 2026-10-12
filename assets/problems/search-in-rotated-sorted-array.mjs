export default {
  pattern: 'Use the sorted half after a rotation',
  problem: 'Given a strictly increasing array rotated at some pivot, return the zero-based index of target or −1 if absent.',
  example: 'nums = [4,5,6,7,0,1,2], target = 0\nOutput: 4',
  insight: 'After checking the middle value, compare it with the right endpoint. When nums[mid] > nums[r], the left half is sorted; otherwise the right half is sorted. The target’s bounds determine which half to keep.',
  steps: ['Use the inclusive range l = 0 through r = len(nums) − 1. Return mid immediately on an exact match.', 'If nums[mid] > nums[r], keep the left half only when nums[l] <= target < nums[mid]; otherwise move l past mid.', 'Otherwise keep the right half only when nums[mid] < target <= nums[r]; otherwise move r before mid.', 'Return −1 once l exceeds r.'],
  complexity: 'O(log n) time for a nonempty array and O(1) auxiliary space. Empty input returns −1.',
  pitfall: 'The comparisons rely on distinct values. Duplicate values can hide which half is sorted and need a different algorithm. Unlike ordinary binary search, the whole active range need not be sorted.'
};
