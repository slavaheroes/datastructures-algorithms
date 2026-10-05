import {mountWindow} from '../visualizations/sliding-window.mjs';
export default {
  pattern: 'Expand to cover, shrink to minimize',
  problem: 'Return the shortest substring of s containing every character of t with its required multiplicity. Return an empty string when no such window exists.',
  example: 's = "ADOBECODEBANC", t = "ABC"\nOutput: "BANC"',
  insight: 'Count only target characters in the current window. matches counts distinct character requirements already satisfied, not the number of matched positions. Once all requirements are met, record a better result and shrink from the left until coverage breaks.',
  steps: ['Return an empty string immediately if t is empty or longer than s. Build t_freq and initialize matches = 0.', 'For each s[i] that belongs to t_freq, increment its count. Increment matches only when this count reaches its required count exactly.', 'While matches equals the number of distinct target characters, save the window if it is strictly shorter than the best.', 'Remove s[j] when relevant. If its count falls below the requirement, decrement matches. Advance j, then continue expanding from the right.'],
  complexity: 'O(|s| + |t|) time. The two maps use O(distinct characters in t) auxiliary space; the returned substring additionally needs O(answer length) space.',
  pitfall: 'Extra copies of a required character do not increase matches. Removing a surplus copy does not decrease matches. Record a valid window before removing its left character. Equal-length ties keep the earlier result.'
};
export const mountVisualization = root => mountWindow(root, 'minimum');
