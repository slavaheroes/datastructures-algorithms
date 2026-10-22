import {mountEditDistance} from '../visualizations/dp-strings-intervals.mjs';

export default {
  pattern: 'Minimum cost across two word prefixes',
  problem: 'Return the minimum number of insertions, deletions, and replacements needed to turn word1 into word2. Each operation costs one.',
  example: 'word1 = "horse", word2 = "ros"\nhorse → rorse (replace h) → rose (delete r) → ros (delete e)\nOutput: 3\n\nword1 = "", word2 = "abc" → 3',
  insight: 'dp[i][j] is the best edit count for word1[:i] and word2[:j]. Equal final characters can stay unchanged, so copy the diagonal. Otherwise finish with an insertion (left), deletion (above), or replacement (diagonal), adding one to the cheapest preceding state.',
  steps: ['Allocate an (n+1) × (m+1) table, where n and m are the two word lengths.', 'Set dp[i][0] = i for deletions into an empty target, and dp[0][j] = j for insertions from an empty source.', 'Fill rows and columns in increasing prefix length.', 'For equal final characters, copy dp[i−1][j−1]. Otherwise use 1 + min(dp[i][j−1], dp[i−1][j], dp[i−1][j−1]).', 'Return the bottom-right cell. The saved solution returns the distance without reconstructing an edit sequence.'],
  complexity: 'O((n+1)(m+1)) time and space, conventionally O(nm) for nonempty words. Initialization also handles empty words.',
  pitfall: 'The first row and column count edits involving empty prefixes; leaving them at zero produces incorrect distances. This is standard edit distance without transposition: swapping adjacent letters is not a single operation.'
};

export const mountVisualization = mountEditDistance;
