import {mountRottingOranges} from '../visualizations/graph-lessons.mjs';
export const mountVisualization = mountRottingOranges;
export default {
  pattern: 'Multi-source BFS with elapsed time',
  problem: 'A fresh orange rots one minute after a horizontally or vertically adjacent orange is rotten. Return the minutes needed for every orange to rot, or -1 if some fresh orange cannot be reached. Grid values are 0 empty, 1 fresh, and 2 rotten.',
  example: 'grid = [[2,1,1],[1,1,0],[0,1,1]]\nOutput: 4',
  insight: 'All initially rotten oranges start in the queue at minute 0. The queue interleaves their waves in increasing time order, so the first accepted visit to an orange gives its earliest rotting time.',
  steps: ['Enqueue every original 2 as (row, column, 0), and set maxTime = 0.', 'Pop an entry; skip coordinates outside the grid and cells whose current value is ≤ 0.', 'For an accepted cell, update maxTime and write -1 to mark it processed.', 'Enqueue down, up, right, and left with minutes + 1. This source enqueues neighbors before checking bounds or cell contents.', 'After BFS, return -1 if any 1 remains; otherwise return maxTime.'],
  complexity: 'O(RC) time and O(RC) queue space. Every accepted orange is expanded once and adds exactly four entries, including entries that will be skipped.',
  pitfall: 'The source mutates rotten and reached fresh cells to -1, rather than 2. Its visited set is declared but unused. Duplicate entries are handled by the ≤ 0 check on dequeue. A grid without fresh oranges returns 0. The source expects a nonempty rectangular grid.'
};
