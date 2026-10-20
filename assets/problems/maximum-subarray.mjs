export default {
  pattern: 'Keep a useful running sum',
  problem: 'Return the largest sum of any nonempty contiguous subarray of an integer array.',
  example: 'nums = [-2,1,-3,4,-1,2,1,-5,4]\nThe subarray [4,-1,2,1] has sum 6.\nOutput: 6',
  insight: 'A negative prefix makes every future continuation worse, so discard it. Keep the best sum before resetting: an all-negative input must still return its largest element rather than zero.',
  steps: ['Initialize maxsum to negative infinity and curr_sum to 0.', 'Add the next number to curr_sum and update maxsum with that value.', 'If curr_sum is negative, reset it to 0 so the next element can begin a fresh candidate.', 'After processing all elements, return maxsum.'],
  complexity: 'O(n) time and O(1) auxiliary space. The source scans once and does not modify nums.',
  pitfall: 'Update maxsum before resetting a negative running sum. With [-3,-1,-2], this preserves −1 as the answer. The problem requires a nonempty array; the source would return negative infinity for an empty one.'
};
