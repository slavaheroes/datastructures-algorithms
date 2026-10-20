export default {
  pattern: 'Backtracking over a Cartesian product',
  problem: 'Return all letter strings represented by a sequence of phone keypad digits from 2 through 9.',
  example: 'digits = "23"\nOutput: ["ad","ae","af","bd","be","bf","cd","ce","cf"]',
  insight: 'For digit i, branch once per mapped letter and append it to the current string. Each complete root-to-leaf path chooses exactly one letter for every digit. The source builds new strings instead of mutating a shared character list.',
  steps: ['Return [] immediately when digits is empty.', 'Look up the letters for digits[i] in the fixed mapping.', 'For each letter, recurse with i + 1 and curr + letter.', 'When curr has the same length as digits, append it to the result.'],
  complexity: 'For n digits and P equal to the product of their letter counts, O(n · P) time. P is at most 4^n. The saved implementation retains intermediate immutable prefix strings on the recursion stack, which can occupy O(n²) auxiliary character space; the output uses O(n · P).',
  pitfall: 'Digits 0 and 1 have no mapping and are outside the problem’s input contract. The O(n²) stack-string space describes this source’s string concatenation; a mutable path implementation can reduce auxiliary space to O(n).'
};
