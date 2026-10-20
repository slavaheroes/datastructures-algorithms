import {mountNQueens} from '../visualizations/backtracking-lessons.mjs';

export const mountVisualization = mountNQueens;
export default {
  pattern: 'Row-by-row backtracking with occupied diagonals',
  problem: 'Place n queens on an n × n chessboard so that no two share a row, column, or diagonal. Return all distinct boards, using Q for a queen and . for an empty cell.',
  example: 'n = 4\nOutput: [[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]',
  insight: 'Place exactly one queen per recursive row. cols[c] says whether a column is free. Diagonal sets contain r + c and r − c for placed queens. Constant-time occupancy checks reject an attacked square before the source mutates the board.',
  steps: ['Create an empty board, mark every column free, and start with empty positive and negative diagonal sets.', 'At row r, try columns from left to right. Skip a square when either diagonal is occupied or its column is unavailable.', 'Place Q, mark its column unavailable, and add both diagonal keys.', 'Recurse to row r + 1. When r == n, join every board row and append the board copy.', 'Undo the queen, column flag, and diagonal keys after returning so sibling branches start from the same board.'],
  complexity: 'The source scans n columns in each call, giving a loose O(n · n! + S · n²) time bound for S solution boards, including copying them. O(n²) auxiliary space for the board, plus O(n) occupancy state and recursion; O(S · n²) output space.',
  pitfall: 'Undo both diagonal keys as well as the column flag. Squares share a descending diagonal when r − c matches and an ascending diagonal when r + c matches. The visualization follows the source’s diagonal checks before the column check and enumerates every solution.'
};
