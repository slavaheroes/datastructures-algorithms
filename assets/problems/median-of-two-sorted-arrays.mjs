import {mountBinarySearch} from '../visualizations/binary-search.mjs';

export default {
  pattern: 'Balance two sorted partitions',
  problem: 'Return the median of two arrays sorted in nondecreasing order. Either array may be empty, but their combined length must be positive.',
  example: 'nums1 = [1,3], nums2 = [2]\nOutput: 2.0\nThe combined sorted values are [1,2,3].',
  insight: 'Partition both arrays so their left portions contain total // 2 values together. A valid partition puts every left value before every right value. Because each array is sorted, it is enough to compare the two pairs of crossed boundary values. Binary search only the shorter array.',
  steps: ['Swap nums1 and nums2 when nums1 is longer. Let half = total // 2 and initialize l = 0, r = len(nums1) − 1.', 'Calculate i = (l + r) // 2 and j = half − i − 2. These are the last indices in each left portion, so i or j can be −1.', 'Read left1, right1, left2, and right2 at the partition boundaries. Use −∞ for an empty left side and +∞ for an empty right side.', 'If left1 <= right2 and left2 <= right1, the partition is valid. If left1 > right2, move r to i − 1; otherwise move l to i + 1.', 'For an odd total, return min(right1, right2). For an even total, return the average of max(left1, left2) and min(right1, right2).'],
  complexity: 'O(log(min(m, n) + 1)) time and O(1) auxiliary space for array lengths m and n. The +1 reflects the constant-time case when the shorter array is empty. No merged array is created.',
  pitfall: 'The left half has floor(total / 2) values, so an odd-length median belongs to the right half. Python floor division can produce i = −1 when l = 0 and r = −1; this is a valid empty left partition. The source assumes sorted input and at least one total element.'
};

export const mountVisualization = root => mountBinarySearch(root, 'median');
