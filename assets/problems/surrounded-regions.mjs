export default {
  pattern: 'Protect border-connected regions',
  problem: 'Change each O region completely surrounded by X cells into X, using horizontal and vertical connectivity. Keep every O connected to a border O.',
  example: 'board = [["X","X","X","X"],["X","O","O","X"],["X","X","O","X"],["X","O","X","X"]]\nAfter capture: [["X","X","X","X"],["X","X","X","X"],["X","X","X","X"],["X","O","X","X"]]\nThe bottom-border O is protected.',
  insight: 'It is easier to identify cells that cannot be captured. Every border O and every O reachable from one has a route out of the board; only the other O cells are surrounded.',
  steps: ['Scan the board and enqueue every O whose row or column lies on the border. Each border cell is examined once.', 'Pop a coordinate; skip out-of-bounds entries, visited cells, and X cells.', 'Add each accepted O to visited and cannot_surround, then enqueue its four neighbors.', 'After BFS, scan all cells and write X wherever the coordinate is absent from cannot_surround.', 'The method updates the board in place and returns no explicit value.'],
  complexity: 'O(RC) time and O(RC) auxiliary space for BFS and the two sets.',
  pitfall: 'Marking happens when dequeuing, so duplicate queue entries are possible but each accepted O expands once. The final pass also writes X over existing X cells. The source assumes a nonempty rectangular board.'
};
