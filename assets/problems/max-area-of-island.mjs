export default {
  pattern: 'DFS area accumulation',
  problem: 'Return the largest number of horizontally or vertically connected 1 cells in an integer grid. Return 0 when there is no land.',
  example: 'grid = [[1,1,0],[0,1,0],[1,0,1]]\nIsland areas: 3, 1, 1\nOutput: 3',
  insight: 'Each newly visited land cell contributes 1. Its recursive calls return the sizes of still-unvisited neighboring regions, so adding their results counts each cell exactly once.',
  steps: ['Scan every grid position, keeping res = 0.', 'For a 1 cell, call dfs. Return 0 at an invalid coordinate, water 0, or visited land 2.', 'Mark new land as 2 and start area = 1.', 'Add the areas returned from down, up, right, and left neighbors.', 'Update res with the maximum completed island area and return it.'],
  complexity: 'O(RC) time and O(RC) worst-case recursion space for an R × C grid.',
  pitfall: 'This source changes every visited 1 to 2. Its outer loops handle an empty grid, while nonempty input is assumed rectangular. Recursion can be as deep as the largest island.'
};
