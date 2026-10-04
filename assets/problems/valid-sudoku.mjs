export default {
  "pattern": "Constraint sets",
  "problem": "Check that filled cells in a 9×9 Sudoku board do not repeat a digit in any row, column, or 3×3 box. Empty cells are '.'.",
  "example": "A row ['5', '3', '.', '.', '7', '.', '.', '.', '.'] is locally valid.\nAdding another '5' to that row makes the board invalid.",
  "insight": "Each filled cell belongs to three independent constraints. Keep a set for each row, column, and box.",
  "steps": [
    "Create nine row sets, nine column sets, and nine box sets.",
    "Skip empty cells. Compute box ID (r // 3) * 3 + c // 3.",
    "Reject a digit already in any applicable set; otherwise insert it into all three. Return True when all cells pass."
  ],
  "complexity": "O(1) time and space for the fixed 81-cell board. For a generalized N×N board with square sub-boxes, time and stored entries are O(N²).",
  "pitfall": "Validity does not imply solvability. Input must have the standard 9×9 shape and contain only '.' or digits '1' through '9'."
};
