export default {
  pattern: 'Multi-source BFS from all treasure cells',
  problem: 'Fill each reachable land cell with its shortest distance to a treasure. The grid uses -1 for walls, 0 for treasure, and 2147483647 for unvisited land. Leave unreachable land unchanged.',
  example: 'grid = [[0,2147483647,-1],[2147483647,2147483647,2147483647]]\nAfter filling: [[0,1,-1],[1,2,3]]',
  insight: 'Put every treasure in the queue at distance 0. FIFO order expands all distance-0 cells before distance-1 cells, so the first discovered route to a land cell is a shortest route to any treasure.',
  steps: ['Add every 0 coordinate to visited and enqueue (row, column, 0).', 'Pop a coordinate and its distance. Skip coordinates outside the grid and wall cells.', 'Write dist into the valid cell.', 'For down, up, right, and left, enqueue a coordinate with dist + 1 only if it is absent from visited; mark it visited when enqueuing.', 'Continue until the queue is empty. The method updates the grid in place and has no explicit returned value.'],
  complexity: 'O(RC) time and O(RC) queue/visited space. This implementation also stores a bounded border of invalid neighbor coordinates, which does not change the bound.',
  pitfall: 'Bounds and walls are checked when dequeuing, so visited can contain wall and out-of-bounds coordinates. Those entries are never expanded. The implementation expects a nonempty rectangular grid.'
};
