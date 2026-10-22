import {mountRegularExpressionMatching} from '../visualizations/dp-strings-intervals.mjs';

export default {
  pattern: 'Match prefixes with optional repeated atoms',
  problem: 'Decide whether pattern p matches all of string s. A literal matches itself, . matches any one character, and * matches zero or more copies of the preceding letter or dot.',
  example: 's = "aab", p = "c*a*b"\nc* uses zero c characters, a* uses two a characters, and b matches b.\nOutput: True\n\ns = "ab", p = ".*" → True\ns = "aa", p = "a" → False',
  insight: 'dp[i][j] says whether the first i text characters fully match the first j pattern characters. A matching literal or dot consumes one character from each side. For an atom followed by *, either discard the atom-star pair (zero copies), or consume one matching text character while keeping the whole starred pattern available for more copies.',
  steps: ['Allocate a False table of size (len(s)+1) × (len(p)+1), and set dp[0][0] = True.', 'Initialize the empty-text row: when p[j−1] is *, copy dp[0][j−2] to allow zero occurrences of that atom.', 'For positive prefix lengths, a matching literal or . copies dp[i−1][j−1].', 'For *, start with dp[i][j−2] for zero copies. If its preceding atom matches s[i−1], also allow dp[i−1][j] for one more copy.', 'Leave unmatched literal cells False. Return dp[len(s)][len(p)] for the complete match.'],
  complexity: 'O((|s|+1)(|p|+1)) time and space, conventionally O(|s|·|p|) for nonempty inputs. The table includes empty prefixes.',
  pitfall: 'This is the stated matching problem, not the full Python regex language. * repeats its preceding atom and is not a standalone wildcard. Patterns must be well formed, with no leading or consecutive stars. The saved source assumes this; the visualization validates it. Full matching must consume the entire string.'
};

export const mountVisualization = mountRegularExpressionMatching;
