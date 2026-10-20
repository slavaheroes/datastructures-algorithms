export default {
  pattern: 'Backtracking over palindromic prefixes',
  problem: 'Split a string into contiguous nonempty parts so that every part is a palindrome. Return all valid partitions.',
  example: 's = "aab"\nOutput: [["a","a","b"],["aa","b"]]',
  insight: 'At the next unpartitioned index i, try every ending j. Check s[i:j + 1] with two pointers before adding it. A palindromic choice leaves the same problem on the remaining suffix, and reaching the end completes a partition.',
  steps: ['Start backtrack(0, []) with no selected parts.', 'For every ending j at or after i, compare matching characters from both ends inward.', 'When the substring is a palindrome, append its slice and recurse from j + 1.', 'Pop the chosen part after returning. At i == len(s), save a copy of the whole partition.'],
  complexity: 'O(n · 2^n) worst-case time including repeated palindrome scans, substring construction, and output copies. There are up to 2^(n − 1) partitions for a nonempty all-equal string. O(n) auxiliary space for the recursion and the characters in the active path; O(n · 2^n) output space.',
  pitfall: 'This implementation checks palindromes on demand; it does not build a dynamic-programming table. The next recursion begins after the chosen substring, so every character appears in exactly one part. Empty input returns [[]].'
};
