import {mountPow} from '../visualizations/math-lessons.mjs';

export const mountVisualization = mountPow;
export default {
  pattern: 'Exponentiation by squaring',
  problem: 'Compute x raised to the integer power n. A negative exponent means the reciprocal of the corresponding positive power; a zero base requires a positive exponent.',
  example: 'x = 2, n = 10 → 1024\nx = 2, n = −2 → 0.25\nx = −2, n = 3 → −8',
  insight: 'Squaring the current factor and halving the remaining degree reduces the exponent logarithmically. This source uses a less common accumulator invariant: at loop boundaries, res × x^(degree − 1) equals the original base raised to abs(n). It starts res at x, performs an extra res *= x for odd degree, always performs another res *= x, then squares x and halves degree.',
  steps: ['Return x immediately when x is 1 or 0. Otherwise return 1 for n = 0, or handle x = −1 by exponent parity.', 'Set res = x and degree = abs(n).', 'While degree > 1, multiply res by x once if degree is odd, then multiply res by x unconditionally.', 'Square x and replace degree with degree // 2. Repeat until degree is 1.', 'Return res for a positive n, or 1 / res for a negative n.'],
  complexity: 'O(log(|n| + 1)) time and O(1) auxiliary space under the usual fixed-width floating-point arithmetic model. The special cases return in O(1) time.',
  pitfall: 'The saved implementation starts res at x rather than 1; changing that initialization without changing its multiplication rules breaks the invariant. Its first short circuit returns 0 for x = 0 even when n = 0, and for negative n; the visualizer excludes zero with a nonpositive exponent. Floating-point multiplication can round, overflow, or underflow; the visualization uses small bounded examples and rejects unrepresentable results.'
};
