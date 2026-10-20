import {mountJumpGameII} from '../visualizations/greedy-lessons.mjs';

export default {
  pattern: 'Expand one reachable frontier per jump',
  problem: 'Starting at index 0, nums[i] is the maximum forward jump length. Return the minimum jumps needed to reach the final index. The problem guarantees that the final index is reachable.',
  example: 'nums = [2,3,1,1,4]\n0 → 1 → 4 reaches the end with two jumps.\nOutput: 2',
  insight: 'The correct reference groups indices into frontiers reachable with the same number of jumps, like breadth-first search on implicit forward edges. Scan the whole current frontier to find the farthest next endpoint, then increase the jump count once. The first stored version instead keeps a visited dictionary with counts only at selected landing positions; its fallback for missing indices can overestimate a minimum distance.',
  steps: ['Reference: initialize res = 0 and l = r = 0. The initial frontier is only the starting index.', 'While r is before the final index, scan i from l through r and maximize farthest = i + nums[i].', 'Set l = r + 1, r = farthest, and increment res. All newly reached positions belong to this next jump count.', 'Return res once the frontier reaches or passes the final index. Each scanned frontier is disjoint from the preceding one.', 'First stored version: initialize visited[0] = 0. For a missing index i, assign visited[i − 1] + 1; update the capped farthest landing using visited[i] + 1. Playback preserves these operations so its limitation can be inspected.'],
  complexity: 'Reference: O(n) time and O(1) auxiliary space, because each index is scanned at most once across disjoint frontiers. First dictionary version: O(n) expected time and O(n) space with average constant-time dictionary operations. Neither mutates nums.',
  pitfall: 'The first version is preserved but can overcount: for [4,0,4,0,0,0,0] it records 3 even though 0 → 2 → 6 uses 2 jumps. Use the reference for the minimum-jump reasoning. Both assume reachability; the reference has no failure exit and can stop making progress on unreachable input. The visualization validates reachability before tracing either version. A one-element array requires zero jumps.'
};

export const mountVisualization = mountJumpGameII;
