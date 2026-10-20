export default {
  pattern: 'Flood-fill each unvisited island',
  problem: 'Count groups of "1" cells connected horizontally or vertically in a rectangular grid of "0" and "1" strings.',
  example: 'grid = [["1","1","0"],["0","1","0"],["1","0","1"]]\nOutput: 3',
  insight: 'One DFS consumes one complete island. When the outer scan reaches a remaining "1", it must belong to a new island because every previously counted island has already been marked.',
  steps: ['Scan the grid in row-major order with res = 0.', 'At each "1", increment res and run dfs from that cell.', 'Stop for coordinates outside the grid, water "0", or an already visited "#".', 'Replace the land cell with "#", then visit down, up, right, and left.', 'Return res after scanning every cell.'],
  complexity: 'For R rows and C columns, O(RC) time and O(RC) worst-case recursion space. The grid itself stores visitation markers.',
  pitfall: 'The implementation mutates the input grid and expects a nonempty rectangular grid of strings. Diagonal land cells are separate islands. A long connected island can require deep Python recursion.'
};
