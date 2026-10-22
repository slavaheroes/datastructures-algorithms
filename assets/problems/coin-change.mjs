import {mountCoinChange} from '../visualizations/dp-foundations.mjs';

export default {
  pattern: 'Minimize the last-coin transition',
  problem: 'Given distinct positive coin denominations and a nonnegative amount, return the fewest coins needed to form the amount. Each coin type may be used repeatedly. Return −1 if the amount is impossible.',
  example: 'coins = [1,2,5], amount = 11\n5 + 5 + 1 uses 3 coins.\nOutput: 3\n\ncoins = [2], amount = 3 → −1\namount = 0 → 0',
  insight: 'If the last coin has value c, a solution for amount a consists of that coin plus a solution for a−c. Try every denomination and minimize 1 + dp[a−c]. Positive denominations guarantee the dependency is a smaller amount, so increasing amount order computes every needed remainder first. Infinity distinguishes an impossible remainder from a valid zero-coin base case.',
  steps: ['Allocate amount+1 zeros. dp[0] = 0 is the completed base case.', 'For each amount i from 1 through amount, start a local best at infinity.', 'For every coin c with i−c ≥ 0, compare best with 1 + dp[i−c].', 'Store best in dp[i]; it remains infinity when no reachable remainder exists.', 'Return −1 if the final cell is infinity, otherwise return its minimum count.'],
  complexity: 'O(kA) time and O(A) auxiliary space for k denominations and target amount A. Including initialization and the amount-zero case, the bounds are O(A + kA) time and O(A+1) space.',
  pitfall: 'Coins must be positive. A zero denomination would read the cell currently being computed; a negative denomination can read a future or out-of-range cell. The source initializes all cells to 0, but only dp[0] is a completed answer before the loop. This problem minimizes the number of coins; Coin Change 2 counts combinations.'
};

export const mountVisualization = mountCoinChange;
