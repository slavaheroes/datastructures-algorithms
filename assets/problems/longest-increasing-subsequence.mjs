import {mountLongestIncreasingSubsequence} from '../visualizations/dp-foundations.mjs';

export default {
  pattern: 'Extend increasing subsequences into completed suffixes',
  problem: 'Given a nonempty integer array, return the length of its longest strictly increasing subsequence. A subsequence preserves input order but may skip elements.',
  example: 'nums = [10,9,2,5,3,7,101,18]\nOne longest subsequence is [2,3,7,101].\nOutput: 4\n\n[7,7,7] → 1',
  insight: 'Let dp[i] be the best increasing subsequence that starts exactly at i. The value at i can stand alone, giving length 1. It can also precede any later larger value nums[j], giving length 1 + dp[j]. Computing i from right to left makes all eligible later states available. The answer is the maximum starting-state length, because an optimal subsequence may start anywhere.',
  steps: ['Initialize dp with 1 for every index. The source also explicitly sets its last cell to 1.', 'Visit starting index i from the final index down to 0.', 'Scan j from i through the final index. The self-comparison at j = i has no effect.', 'If nums[i] < nums[j], set dp[i] = max(dp[i], 1 + dp[j]). Equal values are ineligible.', 'Return max(dp), rather than dp[0].'],
  complexity: 'O(n²) time and O(n) auxiliary space. The nested scans examine n(n+1)/2 index pairs. This saved solution uses suffix dynamic programming rather than the O(n log n) tails method.',
  pitfall: 'A subsequence need not be contiguous. The comparison is strictly less than, so duplicates cannot extend it. The implementation requires a nonempty array: dp[-1] and max(dp) do not support an empty list, so the visualization rejects empty input.'
};

export const mountVisualization = mountLongestIncreasingSubsequence;
