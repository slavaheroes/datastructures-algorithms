import {mountBinarySearch} from '../visualizations/binary-search.mjs';

export default {
  pattern: 'Keep the range containing the rotation point',
  problem: 'Return the smallest value of a nonempty strictly increasing array that has been rotated. An unrotated array is also valid.',
  example: 'nums = [3,4,5,1,2]\nOutput: 1',
  insight: 'Compare nums[mid] with the active right endpoint. If the middle is larger, the wrap to smaller values must occur after mid. Otherwise mid belongs to the lower sorted portion, so the minimum is at mid or somewhere to its left.',
  steps: ['Initialize the inclusive range l = 0 and r = len(nums) − 1.', 'While r > l, choose mid = (l + r) // 2 and compare nums[mid] with nums[r].', 'If nums[mid] > nums[r], set l = mid + 1. Otherwise set r = mid, preserving mid as a possible minimum.', 'When l equals r, return nums[l].'],
  complexity: 'O(log n) time and O(1) auxiliary space. A one-element input returns immediately.',
  pitfall: 'Use r = mid, not mid − 1: the middle value may itself be the minimum. The source assumes nonempty input with distinct values. The candidate at L in the visualization is the start of the surviving range, not a separate best-so-far variable.'
};

export const mountVisualization = root => mountBinarySearch(root, 'minimum');
