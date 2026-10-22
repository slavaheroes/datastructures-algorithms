function integer(value, minimum, maximum, label) {
  const number = Number(value);
  if (value === null || value === undefined || !String(value).trim() ||
      !Number.isSafeInteger(number) || number < minimum || number > maximum) {
    throw Error(`${label} must be an integer from ${minimum} to ${maximum}.`);
  }
  return number;
}

export function parseSettings(fields) {
  return {
    rows: integer(fields.rows, 5, 40, 'Rows'),
    cols: integer(fields.cols, 5, 40, 'Columns'),
    density: integer(fields.density, 0, 45, 'Blocked cells (%)'),
    seed: integer(fields.seed, 0, 4294967295, 'Seed')
  };
}

// Mulberry32 gives the same blocked cells for the same settings. Each cell is
// sampled independently; the density is a probability, not an exact wall count.
function seededRandom(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6D2B79F5) >>> 0;
    let value = state;
    value = Math.imul(value ^ value >>> 15, value | 1);
    value ^= value + Math.imul(value ^ value >>> 7, value | 61);
    return ((value ^ value >>> 14) >>> 0) / 4294967296;
  };
}

export function randomGrid(settings) {
  const {rows, cols, density, seed} = parseSettings(settings);
  const random = seededRandom(seed), start = 0, goal = rows * cols - 1;
  const walls = [];
  for (let node = 0; node < rows * cols; node++) {
    if (node !== start && node !== goal && random() < density / 100) walls.push(node);
  }
  // There is deliberately no reachability check or hidden corridor carving.
  // An impossible map is a valid comparison example for all three algorithms.
  return {rows, cols, walls, start, goal, heuristicWeight: 1};
}

export function cloneGrid(grid) {
  return {...grid, walls: [...grid.walls]};
}

export function editGrid(grid, node, mode) {
  if (!Number.isSafeInteger(node) || node < 0 || node >= grid.rows * grid.cols) {
    throw Error('Choose a cell inside the grid.');
  }
  if (!['wall', 'start', 'goal'].includes(mode)) throw Error('Choose walls, start, or goal as the edit mode.');
  const next = cloneGrid(grid), walls = new Set(next.walls);
  if (mode === 'wall') {
    if (node === next.start || node === next.goal) throw Error('Move the start or goal before blocking that cell.');
    if (walls.has(node)) walls.delete(node);
    else walls.add(node);
  } else {
    const other = mode === 'start' ? 'goal' : 'start';
    if (node === next[other]) throw Error('Choose different cells for the start and goal.');
    next[mode] = node;
    walls.delete(node);
  }
  next.walls = [...walls].sort((a, b) => a - b);
  return next;
}

function misleadingHeuristicGrid() {
  const rows = 8, cols = 11, open = new Set();
  const cell = (row, col) => row * cols + col;
  for (let col = 1; col <= 9; col++) open.add(cell(1, col));
  open.add(cell(2, 1)); open.add(cell(2, 9));
  for (let col = 1; col <= 5; col++) open.add(cell(3, col));
  open.add(cell(3, 9));
  for (let row = 4; row <= 6; row++) {
    open.add(cell(row, 5)); open.add(cell(row, 9));
  }
  for (let col = 5; col <= 9; col++) open.add(cell(6, col));
  return {
    rows, cols,
    walls: Array.from({length: rows * cols}, (_, node) => node).filter(node => !open.has(node)),
    start: cell(3, 1), goal: cell(3, 9), heuristicWeight: 5
  };
}

export const gridPresets = [
  {
    id: 'open-room', label: 'Open grid',
    description: 'All cells are accessible. Manhattan distance can guide A* directly toward the goal; Dijkstra expands by distance from the start.',
    grid: {rows: 16, cols: 24, walls: [], start: 25, goal: 358, heuristicWeight: 1}
  },
  {
    id: 'unreachable', label: 'Unreachable goal',
    description: 'The four neighbors of the goal are blocked. Every algorithm must report that no route exists. A* cannot make an inaccessible goal reachable.',
    grid: {rows: 12, cols: 18, walls: [178, 195, 197, 214], start: 19, goal: 196, heuristicWeight: 1}
  },
  {
    id: 'misleading-heuristic', label: 'A* with an overestimating heuristic',
    description: 'A* uses 5 × Manhattan distance and returns a 14-step lower route, while the upper route takes 12 steps. Set the heuristic weight back to 1 to restore the shortest-path guarantee.',
    grid: misleadingHeuristicGrid()
  }
];
