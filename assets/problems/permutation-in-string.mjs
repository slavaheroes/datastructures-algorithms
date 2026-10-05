import {mountWindow} from '../visualizations/sliding-window.mjs';
export default {
  pattern: 'Fixed-width frequency window',
  problem: 'Return whether s2 contains a contiguous substring that is a permutation of s1. Inputs contain lowercase English letters.',
  example: 's1 = "ab", s2 = "eidbaooo"\nOutput: true\nThe window "ba" has exactly one a and one b.',
  insight: 'Order does not matter in a permutation, but character counts do. Maintain a window of length len(s1) over s2 and compare its 26 counts with the target counts.',
  steps: ['If s1 is longer than s2, return False. Count all characters in s1 into need.', 'Add the next s2 character to window. If the window is too wide, remove its leftmost character and move left.', 'When the width equals len(s1), compare all 26 counts. Return True on the first exact match.', 'Return False if no window matches. The supplied implementation also treats an empty s1 as matching.'],
  complexity: 'O(|s1| + |s2|) time because each comparison scans a fixed 26 entries; O(26) = O(1) auxiliary space.',
  pitfall: 'A set comparison loses multiplicity: "aab" needs two a characters. A window must have both the correct counts and the exact target length.'
};
export const mountVisualization = root => mountWindow(root, 'permutation');
