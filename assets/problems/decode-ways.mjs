import {mountDecodeWays} from '../visualizations/dp-foundations.mjs';

export default {
  pattern: 'Count ways to decode each suffix',
  problem: 'Given a string of digits, count how many ways it can be decoded using 1 → A through 26 → Z. A code cannot start with 0.',
  example: 's = "226"\n2 | 2 | 6 → BBF\n22 | 6 → VF\n2 | 26 → BZ\nOutput: 3\n\n"06" → 0; "10" → 1',
  insight: 'At index i, a valid decoding consumes either one nonzero digit or a pair from 10 through 26. Those two choices lead to independent suffix counts dp[i+1] and dp[i+2]. Fill right to left so both counts already exist. The empty suffix has one decoding: it is the successful end of a complete sequence of choices.',
  steps: ['Allocate n+1 zeros and set dp[n] = 1 for the empty suffix.', 'Visit i from n−1 down to 0. If s[i] is 0, keep dp[i] = 0.', 'Otherwise copy dp[i+1] for the one-digit choice.', 'When a two-character slice exists and its integer value is at most 26, add dp[i+2]. The earlier nonzero check rules out leading-zero pairs.', 'Return dp[0], the number of ways to decode the complete string.'],
  complexity: 'O(n) time and O(n) auxiliary space. Each index checks a slice of at most two characters, so each transition takes constant time.',
  pitfall: 'A zero cannot decode alone. It can only be consumed as part of 10 or 20. Setting the empty-suffix count to 0 would erase every successful branch. The intended input is nonempty; the saved implementation returns 1 for an empty string because dp[0] is also its base case.'
};

export const mountVisualization = mountDecodeWays;
