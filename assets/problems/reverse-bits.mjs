import {mountReverseBits} from '../visualizations/bit-lessons.mjs';

export default {
  pattern: 'Reverse positions within a fixed 32-bit word',
  problem: 'Reverse all 32 bits of an unsigned 32-bit integer n and return the resulting unsigned integer.',
  example: 'n = 43261596\nInput:  00000010100101000001111010011100\nOutput: 00111001011110000010100101000000\nOutput integer: 964176192\n\nn = 1 → 2147483648',
  insight: 'The first saved version consumes n from the low end and adds 2^(31 − d) whenever bit d is set. It stops when the remaining n is zero because all unvisited high bits contribute zero. The reference consumes exactly 32 bits; each iteration shifts the output left and appends the next input bit. Running all 32 iterations preserves leading zeros as trailing output zeros.',
  steps: ['Initialize res = 0. In the first version also initialize d = 0.', 'First version: while n is nonzero, read bit = n & 1 and shift n right.', 'If bit is 1, add 2^(31 − d) to res. Increment d after every consumed bit, including zeros.', 'Reference: repeat 32 times: read bit = n & 1, shift n right, then assign res = (res << 1) | bit.', 'Return res as an unsigned integer.'],
  complexity: 'O(1) time and O(1) auxiliary space for the fixed 32-bit problem. Generalizing the word width to w gives at most O(w) iterations; the reference always executes w iterations.',
  pitfall: 'This reverses a fixed-width bit pattern, not just the digits of the shortest binary string. The reference must continue after the remaining input becomes zero. Python integers do not overflow at bit 31; the visualization uses exact integer operations so results above 2147483647 retain their unsigned value. Both saved versions require unsigned 32-bit input.'
};

export const mountVisualization = mountReverseBits;
