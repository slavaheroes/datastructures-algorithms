export default {
  pattern: 'Floyd cycle entry in an implicit list',
  problem: 'An array has n + 1 integers, each in [1,n], with exactly one distinct repeated value. Find that value without modifying the array and with constant auxiliary space.',
  example: 'nums = [1,3,4,2,2]\nIndex walk: 0 → 1 → 3 → 2 → 4 → 2 → …\nOutput: 2',
  insight: 'Treat index i as a node whose next node is nums[i]. Every step stays inside the array. A repeated value merges incoming links and creates the reachable cycle entry. Index 0 cannot be inside that cycle because no value points to 0.',
  steps: ['Start slow = fast = 0. Repeatedly advance slow = nums[slow] and fast = nums[nums[fast]] until they meet.', 'Keep slow at the meeting index and set slow2 = 0.', 'Advance both one link at a time until equal; that index is the repeated value.', 'In the example the cycle is 2 → 4 → 2. Resetting one pointer to 0 makes both meet at 2. The cycle lesson explains the distance proof.'],
  complexity: 'O(n) time and O(1) auxiliary space. The input array is unchanged.',
  pitfall: 'This requires the stated [1,n] value range. The source advances before checking equality in phase two; that works here because the cycle entry is never index 0. Its final return after the second infinite loop is unreachable.'
};
