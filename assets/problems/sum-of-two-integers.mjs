import {mountSumOfTwoIntegers} from '../visualizations/bit-lessons.mjs';

export default {
  pattern: 'Propagate carries with XOR and shifted AND',
  problem: 'Return the sum of two integers a and b without using + or − for addition. The saved implementation uses a signed 32-bit representation.',
  example: 'a = −3, b = 5\nXOR produces the sum bits without carries; shifted AND produces the pending carries.\nRepeat until no carry remains.\nOutput: 2\n\na = 1, b = 2 → 3',
  insight: 'XOR adds each pair of bits without carrying. AND finds positions where both bits are 1; shifting those positions left forms the carries to add next. Repeating the same decomposition eventually leaves b = 0. Python has unbounded signed integers, so the 0xFFFFFFFF mask enforces 32-bit behavior and makes carry propagation terminate for negative operands.',
  steps: ['Set mask = 0xFFFFFFFF and max_int = 0x7FFFFFFF.', 'While b is nonzero, compute carry = (a & b) << 1 using the current operands.', 'Assign a = (a ^ b) & mask, then b = carry & mask.', 'When b becomes zero, a contains the final low 32 bits.', 'Return a when a <= max_int. Otherwise return ~(a ^ mask) to recover the corresponding negative Python integer.'],
  complexity: 'O(1) time and O(1) auxiliary space for a fixed 32-bit word: carries can move through at most 32 positions. For a variable width w, carry propagation takes O(w) rounds in the worst case when word operations are treated as constant time.',
  pitfall: 'Compute carry before overwriting a. Mask both the XOR result and the shifted carry; Python’s infinite sign extension otherwise allows negative carries to persist. The final conversion interprets bit 31 as a sign bit. Values whose mathematical sum exceeds the signed 32-bit range wrap in this implementation; the original problem’s bounded operands avoid that overflow.'
};

export const mountVisualization = mountSumOfTwoIntegers;
