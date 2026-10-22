import {mountTargetSum} from '../visualizations/dp-foundations.mjs';

export default {
  pattern: 'Roll a dictionary of reachable sums and counts',
  problem: 'Assign a plus or minus sign to every element of a nonnegative integer array. Return how many sign assignments evaluate to the target sum.',
  example: 'nums = [1,1,1,1,1], target = 3\nExactly one of the five 1s must have a minus sign.\nOutput: 5\n\nnums = [0,0,1], target = 1 → 4',
  insight: 'Different partial expressions may reach the same sum, so store their count together. Starting from {0: 1}, each number sends every previous sum to two next sums: adding the number and subtracting it. Add the previous count to both destinations. A fresh dictionary for each layer ensures every number is used exactly once.',
  steps: ['Initialize memo = {0: 1}: one empty expression reaches sum 0.', 'For each number, create an empty temp dictionary.', 'For every previous sum k with count v, visit both signed values +number and −number.', 'For each destination nk, add v to temp[nk]. Even +0 and −0 are separate sign choices.', 'Replace memo with temp. After all numbers, return memo[target] if present, otherwise 0.'],
  complexity: 'With S = sum(nums), at most 2S+1 integer sums can occur in a layer. Under average constant-time dictionary operations, time is O(n(S+1)) and auxiliary space is O(S+1). The +1 accounts for all-zero input; counts then grow even though only sum 0 is stored. Large Python integer arithmetic adds bit-length costs beyond this usual DP analysis.',
  pitfall: 'The dictionary values count assignments, not just reachable sums. Updating memo in place would let the current number be used repeatedly. Zeros still double the number of sign assignments. A target outside [−S,S] returns 0 naturally. The visualization displays sparse map entries in insertion order rather than allocating a dense table of impossible sums.'
};

export const mountVisualization = mountTargetSum;
