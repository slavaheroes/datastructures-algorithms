import {mountWindow} from '../visualizations/sliding-window.mjs';
export default {
  pattern: 'Window with a historical frequency maximum',
  problem: 'Given uppercase English letters and a budget k, return the longest substring that can become one repeated character after at most k replacements.',
  example: 's = "AABABBA", k = 1\nOutput: 4\nReplace B in "AABA" with A.',
  insight: 'A window needs length − highest character frequency replacements. The source keeps maxFreq as the largest frequency ever seen, even after shrinking. If window length − maxFreq exceeds k, it removes just one left character. This preserves the best achievable length, although the displayed current window may not itself be feasible.',
  steps: ['Add s[i] to freq and raise maxFreq if this count exceeds the historical maximum.', 'If i − j + 1 − maxFreq > k, decrement freq[s[j]] and advance j once.', 'Update maxLen with the retained length and advance i.', 'A stale maxFreq cannot create a new record: exceeding the earlier attainable length requires a larger frequency record. The visualization shows both the historical bound and the current window’s exact replacement cost.'],
  complexity: 'O(n) time and O(26) = O(1) auxiliary space for uppercase English letters.',
  pitfall: 'Do not interpret maxFreq as the exact maximum of every current window. A stale value is safe for finding the best length, but cannot certify that the current substring is a valid answer. The source uses if, not a shrinking while loop.'
};
export const mountVisualization = root => mountWindow(root, 'replacement');
