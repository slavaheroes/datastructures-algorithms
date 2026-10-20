export default {
  pattern: 'Reverse reachability from two borders',
  problem: 'Return coordinates from which water can reach both the Pacific border (top or left) and Atlantic border (bottom or right). Water normally moves to an adjacent cell of equal or lower height.',
  example: 'heights = [[1,2],[4,3]]\nOutput coordinates: [[0,1],[1,0],[1,1]] in any order.',
  insight: 'Reverse the flow: start at an ocean border and walk to equal or higher cells. Such a reverse path proves that water from the higher cell can flow down to that ocean.',
  steps: ['Create separate pac and atl reachability sets.', 'From every top and left border cell, DFS into pac; from every bottom and right border cell, DFS into atl.', 'Stop outside the grid, at an already reached cell, or when the current height is below prevValue.', 'Otherwise add the cell and visit up, down, right, and left with its height as the new prevValue.', 'Return coordinates in pac that also occur in atl.'],
  complexity: 'O(RC) time and O(RC) auxiliary space for the two sets and worst-case recursion stack, excluding the returned coordinates.',
  pitfall: 'The border calls use prevValue = 0, matching the problem’s nonnegative heights. Negative heights would need a different starting bound. The input is not modified, and output order follows a set rather than row-major order. The source expects a nonempty rectangular grid.'
};
