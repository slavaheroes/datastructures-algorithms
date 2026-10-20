import {mountCombinationSum} from '../visualizations/backtracking-lessons.mjs';

export const mountVisualization = mountCombinationSum;
export default {
  pattern: 'Backtracking with reusable candidates',
  problem: 'Given distinct positive candidates and a target, return all unique combinations whose values sum to the target. A candidate may be used any number of times.',
  example: 'nums = [2,3,6,7], target = 7\nOutput: [[2,2,3],[7]]',
  insight: 'Keep candidate indices nondecreasing. After selecting index j, recurse with j again so that candidate can be reused, while earlier indices stay unavailable. The saved source computes sum(curr_list) at each call, copies a successful path, and abandons a path only after its sum exceeds the target.',
  steps: ['Start with index 0 and an empty path.', 'If sum(curr_list) equals the target, append a copy and return.', 'If the sum is greater than the target, return without recording this path.', 'For each candidate j at or after i, append nums[j], recurse with j, then pop it. The source does not sort the candidates or break the loop on a large value.'],
  complexity: 'Let n be the number of candidates and D = floor(target / minimum candidate). A loose upper bound for this implementation is O((D + 1) · (n + 1)^(D + 1)) time: it can enter an overshooting call one level beyond a feasible path and recomputes the path sum. O(D + 1) auxiliary space for recursion and the path. If S combinations are returned, output space is O(S · D).',
  pitfall: 'Candidates must be positive; zero or negative values would break the depth bound and can prevent termination. Reusing j is intentional; j + 1 would solve a different problem. Results follow the original candidate order, so a combination need not be numerically sorted.'
};
