import {mountBurstBalloons} from '../visualizations/dp-strings-intervals.mjs';

export default {
  pattern: 'Choose the last action inside an interval',
  problem: 'Burst every balloon in nums to maximize collected coins. Bursting a balloon earns its value times its two current neighbor values; a missing neighbor has value 1.',
  example: 'nums = [3,1,5,8]\nBurst values 1, 5, 3, then 8:\n3×1×5 + 3×5×8 + 1×3×8 + 1×8×1 = 167\nOutput: 167',
  insight: 'The first saved version enumerates the next burst, removes it by slicing a new list, and recursively tries the remaining orders. The final version instead chooses which balloon is last within [left,right]. At that moment the outside neighbors left−1 and right+1 still exist. That fixes the last reward and makes the left and right subintervals independent.',
  steps: ['Both versions add virtual boundary values 1 to each end. These are never burst.', 'First version: return 0 when only boundaries remain. Try every internal balloon as the next burst, add its immediate reward to recursion on the reduced list, and return the maximum.', 'Final version: allocate an (n+2) × (n+2) zero table. Empty intervals retain value 0.', 'Iterate left downward from n to 1, and right upward from left to n. Try each k in the interval as the last balloon.', 'Compute dp[left][k−1] + nums[left−1]×nums[k]×nums[right+1] + dp[k+1][right]. Store the maximum over k, then return dp[1][n].'],
  complexity: 'First version: O(n!) time; its recursion retains copied lists with O(n²) peak auxiliary space across a path. Final version: O(n³) time and O(n²) space for the interval table. The first bound includes the copying and loop work across the factorial search tree.',
  pitfall: 'The interval choice is the last burst, so its neighbors are the fixed outside boundaries, not k−1 and k+1 from the original array. Both saved classes remain in the Python file; the later class is the final implementation. Balloon values are nonnegative, matching the zero initial maximum.'
};

export const mountVisualization = mountBurstBalloons;
