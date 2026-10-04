export default {
  pattern: 'Opposing pointers in a sorted array',
  problem: 'Given a non-decreasing array with exactly one solution, return the 1-based indices of two distinct values whose sum is the target.',
  example: 'numbers = [2, 7, 11, 15], target = 9\nOutput: [1, 2]',
  insight: 'Sorting tells you which endpoint to discard. If the sum is too small, increase the left value; if it is too large, decrease the right value. Each move removes pairs that cannot reach the target.',
  steps: [
    'Start at indices 0 and 3. The sum 2 + 15 = 17 is too large, so move right inward.',
    'At indices 0 and 2, the sum 2 + 11 = 13 is still too large. Move right again.',
    'At indices 0 and 1, 2 + 7 = 9. Return [1, 2] after converting to 1-based indices.'
  ],
  complexity: 'O(n) time and O(1) auxiliary space. At most n - 1 pointer moves are needed.',
  pitfall: 'This algorithm requires a sorted input. Return indices plus one, not the values or 0-based indices. left < right prevents using the same element twice. The implementation returns [] if no pair exists.'
};
