export default {
  pattern: 'Board DFS with temporary cell markers',
  problem: 'Determine whether a word can be formed from horizontally or vertically adjacent board cells, using each cell at most once in that word path.',
  example: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]]\nword = "ABCCED"\nOutput: True',
  insight: 'Start DFS at each board cell. A matching cell is temporarily replaced by # before exploring down, up, right, and left, preventing reuse within that path. Restore the original letter after the four calls. A shared output flag remembers success.',
  steps: ['Record the board dimensions and initialize output = False.', 'If the character index reaches the word length, set output = True and return. This check comes before the coordinate checks.', 'Reject out-of-bounds, marked, or mismatching cells.', 'Save the matched letter, mark its cell #, recurse to four neighbors with the next character index, then restore it.', 'Try every starting cell and return the shared flag. The source continues searching even after a successful path.'],
  complexity: 'For an R × C board and word length L ≥ 1, O(RC · 4 · 3^(L − 1)) is a loose time bound: there are at most four first moves and three later moves without returning to the previous cell. O(min(L, RC)) auxiliary recursion space. The board is marked in place and restored.',
  pitfall: 'The source assumes a nonempty rectangular board and reserves # as its visited marker. It does not short-circuit after success. Restoring the cell is necessary even when a path finds the word so other starts see the original board.'
};
