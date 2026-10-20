import {mountValidParenthesisString} from '../visualizations/greedy-lessons.mjs';

export default {
  pattern: 'Track flexible matches or a range of open counts',
  problem: 'Decide whether a string containing (, ), and * can be valid parentheses. Each * may represent (, ), or an empty string. Parentheses must be matched in order.',
  example: 's = "(*))"\nChoose * as (, giving "(())".\nOutput: True\n\ns = "*(" → False because an earlier star cannot close a later open.',
  insight: 'The first version stores indices of opens and stars. A closing parenthesis uses an open when possible, otherwise an earlier star. Any opens left at the end need stars strictly to their right. The reference instead keeps the smallest and largest feasible number of unmatched opens for each prefix; stars widen that range by one in both directions.',
  steps: ['Stack version: push indices of ( into stack and indices of * into stars. For ), pop an open if possible, otherwise a star; return False if neither exists.', 'After scanning, pop remaining opens and stars from the right. Return False if a star is missing or its index precedes the open; otherwise it can serve as ). Return True when all opens are matched.', 'Reference: count1 is the maximum feasible open count, and count2 is the minimum. For (, increment both; for ), decrement both; for *, increment count1 and decrement count2.', 'Clamp count2 to 0, because a feasible open count cannot be negative. If count1 is negative, return False: this prefix has too many closings under every interpretation.', 'After the scan, return count2 == 0. A minimum of zero means at least one interpretation closes every open.'],
  complexity: 'Stack version: O(n) time and O(n) space for the index stacks; each index is pushed and popped at most once. Reference: O(n) time and O(1) auxiliary space for the two counters. Both preserve the string.',
  pitfall: 'Indices matter in the stack solution: an earlier star cannot close a later (. Prefer real opens while scanning to preserve stars’ flexibility. In the reference, count1 is the upper bound and count2 the lower bound; these names can obscure their roles. Both assume only the three allowed characters and return True for an empty string.'
};

export const mountVisualization = mountValidParenthesisString;
