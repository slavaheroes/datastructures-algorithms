import {mountSetMatrixZeroes} from '../visualizations/math-lessons.mjs';

export const mountVisualization = mountSetMatrixZeroes;
export default {
  pattern: 'Reuse the first row and column as markers',
  problem: 'Given a nonempty rectangular integer matrix, set an entire row and column to zero whenever one of their original cells is zero. Modify the matrix in place.',
  example: 'matrix = [[1,1,1],[1,0,1],[1,1,1]]\nAfter modification: [[1,0,1],[0,0,0],[1,0,1]]\nThe middle row and middle column contain the original zero.',
  insight: 'Clearing cells as soon as a zero is found would create new zeros that incorrectly clear other rows. First record all required rows and columns. The source stores row markers in the first column and column markers in the first row; two booleans remember whether those shared storage areas originally contained zeros themselves.',
  steps: ['Scan the original first column into colOneZero, then the original first row into rowOneZero.', 'Scan only interior cells. For an original zero at [i,j], set matrix[i][0] and matrix[0][j] to zero.', 'Scan the interior again. Set [i,j] to zero if its first-row or first-column marker is zero.', 'Finally clear the first row when rowOneZero is True and the first column when colOneZero is True. The method returns None.'],
  complexity: 'O(r × c) time for r rows and c columns, and O(1) auxiliary space. The matrix itself holds the markers; playback snapshots are excluded.',
  pitfall: 'Read both flags before writing any markers, and clear the first row and column last. An originally nonzero first row can still acquire zeros because it contains column markers; those zeros are part of the correct result. The saved source assumes at least one row and one column.'
};
