import {mountCountingBits} from '../visualizations/bit-lessons.mjs';

export default {
  pattern: 'DP over the integer with its last bit removed',
  problem: 'Given a nonnegative integer n, return an array of length n + 1 whose entry i is the number of 1 bits in i.',
  example: 'n = 5\nIntegers: 0, 1, 2, 3, 4, 5\nBinary:   0, 1, 10, 11, 100, 101\nOutput: [0,1,1,2,1,2]',
  insight: 'Removing the final binary digit gives i >> 1, which is smaller than every positive i. The number of set bits in i is the count for that smaller integer plus the removed digit, i & 1. An ascending loop therefore has every dependency ready before it is used.',
  steps: ['Allocate res = [0] * (n + 1), establishing res[0] = 0.', 'For each i from 1 through n, compute its smaller dependency i >> 1.', 'Assign res[i] = res[i >> 1] + (i & 1).', 'Return res, including the count for zero and for n.'],
  complexity: 'O(n) time and O(n) space for the returned array, assuming constant-time bit operations on the problem’s bounded integers. The algorithm needs O(1) auxiliary space beyond that output.',
  pitfall: 'The last digit is i & 1, not i itself. For positive i, i >> 1 is strictly smaller, making the forward order essential. n = 0 returns [0]. The visualization bounds n to 32 for readable playback; the Python implementation is not restricted to that visualization limit.'
};

export const mountVisualization = mountCountingBits;
