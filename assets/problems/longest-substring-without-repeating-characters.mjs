import {mountWindow} from '../visualizations/sliding-window.mjs';
export default {
  pattern: 'Unique window or last-seen indices',
  problem: 'Return the length of the longest contiguous substring with no repeated characters.',
  example: 's = "abcabcbb"\nOutput: 3\n"abc" is a longest substring.',
  insight: 'The first version removes characters from the left until the incoming character is absent, then inserts it. The second stores each character’s last index and jumps the left boundary directly past a repeat, without ever moving left backward.',
  steps: ['Frequency version: initialize 128 zero counts. Before inserting s[i], repeatedly remove s[j] while the incoming character’s count is positive.', 'Update maxLen from i − j + 1, add the incoming character, and advance i.', 'Last-seen version: for each right index r, set l = max(last[s[r]] + 1, l) if this character was seen.', 'Record its new index and update res from r − l + 1. The visualization can follow either version.'],
  complexity: 'Both versions take O(n) time. The first uses O(128) = O(1) auxiliary space and assumes ASCII input. The second uses O(min(n, alphabet size)) dictionary space.',
  pitfall: 'A substring is contiguous. In the last-seen version, max prevents an old occurrence outside the window from moving l backward, as in "abba". The first source cannot index non-ASCII characters; the demo restricts both modes to printable ASCII.'
};
export const mountVisualization = root => mountWindow(root, 'unique');
