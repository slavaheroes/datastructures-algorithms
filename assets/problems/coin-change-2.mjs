import {mountCoinChange2} from '../visualizations/dp-foundations.mjs';

export default {
  pattern: 'Count unordered combinations by coin type',
  problem: 'Given distinct positive coin denominations and a nonnegative amount, return the number of combinations that form the amount. Each coin type may be used repeatedly; different orders of the same coins count once.',
  example: 'coins = [1,2,5], amount = 5\n5\n2 + 2 + 1\n2 + 1 + 1 + 1\n1 + 1 + 1 + 1 + 1\nOutput: 4',
  insight: 'Let dp[i][a] count combinations for amount a using only the first i coin types. Split combinations into those that omit the current type and those that use at least one current coin. Omitting it reads the previous row. Using it removes one current coin and reads the same row at a smaller amount, allowing unlimited reuse without counting permutations.',
  steps: ['Allocate (number of coin types + 1) rows and amount+1 columns of zeros.', 'Set every dp[i][0] to 1: the empty choice forms amount 0 in one way.', 'Process each coin type i and each positive amount a in increasing order.', 'Set add = dp[i][a−coin] when the coin fits, otherwise 0. Then set dp[i][a] = dp[i−1][a] + add.', 'Return the bottom-right cell, using every coin type at the requested amount.'],
  complexity: 'O(kA) time and O(kA) auxiliary space for k coin types and amount A in the usual positive-size case. Including zero amount and initialization, the full table has O((k+1)(A+1)) cells.',
  pitfall: 'Read the same row for the reuse term; using the previous row there would permit each type only once. Distinct denominations are required, because repeated values would be treated as separate types and overcount. Amount 0 has one combination, not zero. Coin Change instead asks for the minimum number of coins.'
};

export const mountVisualization = mountCoinChange2;
