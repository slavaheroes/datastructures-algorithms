import {mountNumberOf1Bits} from '../visualizations/bit-lessons.mjs';

export default {
  pattern: 'Inspect low bits or remove the lowest set bit',
  problem: 'Given an unsigned 32-bit integer n, return the number of 1 bits in its binary representation.',
  example: 'n = 11\n32-bit form: 00000000000000000000000000001011\nOutput: 3\n\nn = 0 → 0',
  insight: 'The first saved version adds n & 1 to a counter, then shifts n right to expose the next bit. The second uses n & (n − 1): subtracting one flips the lowest set bit to zero and all lower zeros to ones, so AND removes exactly that one set bit. Its iteration count equals the answer.',
  steps: ['Initialize count = 0.', 'First version: while n is nonzero, add n & 1 to count and replace n with n >> 1.', 'Second version: while n is nonzero, replace n with n & (n − 1) and increment count.', 'Return count. Both loops stop immediately for zero.'],
  complexity: 'For fixed 32-bit input, both versions use O(1) time and O(1) auxiliary space. In a variable-width word model, the shift version takes O(b) iterations for b significant bits, while clearing bits takes O(k) iterations for k set bits; this counts bitwise operations as constant time.',
  pitfall: 'The input is nonnegative and fits in 32 bits. Python right shifts negative integers with sign extension, and neither loop has the intended termination behavior for negative input. The second Solution class is the last class defined in the saved file; the visualization exposes both versions.'
};

export const mountVisualization = mountNumberOf1Bits;
