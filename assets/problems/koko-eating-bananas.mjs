export default {
  pattern: 'Binary search the smallest feasible speed',
  problem: 'Koko eats from one pile per hour, at up to k bananas per hour, and cannot move to another pile during that hour. Return the smallest integer speed that finishes all piles within h hours. Piles are positive and h is at least the number of piles.',
  example: 'piles = [3,6,7,11], h = 8\nOutput: 4\nAt speed 4, the piles take 1 + 2 + 2 + 3 = 8 hours.',
  insight: 'Increasing the eating speed can only reduce the required hours. Search speeds from 1 through the largest pile and use the total of ceil(pile / speed) to decide whether a candidate is feasible.',
  steps: ['Initialize l = 1, r = max(piles), and res = r. Under the problem constraints this maximum speed is feasible.', 'Choose mid = (l + r) // 2. get_hours adds math.ceil(pile / mid) for every pile.', 'If the hours are at most h, save the smaller feasible speed in res and set r = mid − 1.', 'Otherwise set l = mid + 1. Return res after all candidate speeds have been eliminated.'],
  complexity: 'O(n log M) time and O(1) auxiliary space, where n is the number of piles and M is the largest pile. Each feasibility check scans every pile.',
  pitfall: 'Rounding up is essential: a partly eaten pile still consumes an hour. This source uses math.ceil with division, and assumes a nonempty list plus a feasible h; it does not report impossible inputs.'
};
