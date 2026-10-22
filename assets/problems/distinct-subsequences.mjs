import {mountDistinctSubsequences} from '../visualizations/dp-strings-intervals.mjs';

export default {
  pattern: 'Count ways to match two prefixes',
  problem: 'Count the distinct subsequences of s equal to t. A subsequence preserves order while deleting zero or more source characters. Different choices of source positions count separately.',
  example: 's = "rabbbit", t = "rabbit"\nChoose any two of the three consecutive b positions.\nOutput: 3\n\ns = "babgbag", t = "bag" → 5',
  insight: 'Let dp[i][j] count ways to form the first j target characters using the first i source characters. Skipping the final source character contributes dp[i−1][j]. If it matches the final target character, using it contributes another dp[i−1][j−1]. These choices are disjoint because they differ on whether this source position is selected.',
  steps: ['Return 0 immediately if t is longer than s.', 'Allocate an (len(s)+1) × (len(t)+1) zero table. Set dp[i][0] = 1 for every source prefix: selecting no positions forms the empty target once.', 'Scan positive prefix lengths i and j in increasing order. Leave cells with i < j at 0.', 'If s[i−1] equals t[j−1], store dp[i−1][j] + dp[i−1][j−1]. Otherwise copy dp[i−1][j].', 'Return dp[len(s)][len(t)].'],
  complexity: 'O((|s|+1)(|t|+1)) time and space for the allocated table and its initialization. For nonempty strings this is conventionally O(|s|·|t|). The initial length check returns in O(1).',
  pitfall: 'Count source-position selections, not unique intermediate strings. The empty target has one matching subsequence, including when s is empty. When characters match, retain the skip contribution as well as the use contribution.'
};

export const mountVisualization = mountDistinctSubsequences;
