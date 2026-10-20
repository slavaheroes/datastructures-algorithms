export default {
  pattern: 'Maintain the farthest reachable index',
  problem: 'Starting at index 0, nums[i] is the maximum forward jump length from index i. Decide whether the last index is reachable.',
  example: 'nums = [2,3,1,1,4]\nIndex 0 reaches indices 1 and 2; index 1 can reach the last index.\nOutput: True\n\n[3,2,1,0,4] → False',
  insight: 'A reachable index can extend a continuous reachable prefix. There is no need to choose an exact jump: retain the farthest endpoint contributed by every reachable index seen so far. If the next index lies beyond that endpoint, no later index can rescue it.',
  steps: ['Initialize maxPos = 0.', 'At each index i, return False if i > maxPos.', 'Otherwise extend maxPos to max(maxPos, i + nums[i]).', 'After the loop, return whether maxPos >= len(nums) − 1. The source continues scanning even when it can already reach the end.'],
  complexity: 'O(n) time and O(1) auxiliary space. The saved comment reverses these labels; the actual code uses a linear scan and one reach variable.',
  pitfall: 'The problem assumes a nonempty array of nonnegative jump lengths. A zero blocks progress only when every earlier reach also stops there. The source returns True for an empty list as a consequence of comparing 0 with −1; that is outside the intended problem input.'
};
