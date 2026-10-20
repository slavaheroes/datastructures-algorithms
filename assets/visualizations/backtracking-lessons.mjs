import {escape, integer, mountSequencePlayback} from './sequence-playback.mjs';

const MAX_FRAMES = 1800;
const list = values => `[${values.join(', ')}]`;

function record(frames, frame) {
  if (frames.length >= MAX_FRAMES) throw Error(`This search needs more than ${MAX_FRAMES} steps. Use fewer candidates or a smaller target to see the complete search.`);
  frames.push(frame);
}

function combinationInput(fields) {
  if (fields.candidates.length > 160) throw Error('Use at most 6 distinct positive candidates.');
  let candidates;
  try { candidates = JSON.parse(fields.candidates); }
  catch { throw Error('Candidates must be a JSON array, such as [2,3,6,7].'); }
  if (!Array.isArray(candidates) || candidates.length < 1 || candidates.length > 6 || candidates.some(value => !Number.isInteger(value) || value < 1 || value > 20) || new Set(candidates).size !== candidates.length) {
    throw Error('Use 1–6 distinct integers from 1 to 20. The saved algorithm requires positive candidates.');
  }
  return {candidates, target: integer(fields.target, 0, 12, 'Target')};
}

function combinationTrace(input) {
  const frames = [], path = [], calls = [], results = [];
  let visits = 0, pruned = 0;
  function save(message, selected = null, state = '') {
    const sum = path.reduce((total, value) => total + value, 0);
    record(frames, {
      message, selected, state, path: [...path], sum,
      calls: calls.map(call => ({...call, path: [...call.path]})), results: results.map(result => [...result]),
      stats: [['Path sum / target', `${sum} / ${input.target}`], ['Recursive calls', visits], ['Pruned calls', pruned], ['Combinations found', results.length]]
    });
  }
  save('Start with an empty path. Candidates stay in their original order; the source does not sort them.');
  function backtrack(start) {
    visits++;
    calls.push({start, path: [...path]});
    const sum = path.reduce((total, value) => total + value, 0);
    save(`Enter backtrack(${start}, ${list(path)}). Compute sum(curr_list) = ${sum}.`, null, 'visit');
    if (sum === input.target) {
      results.push([...path]);
      save(`The sum equals ${input.target}. Append a copy of ${list(path)} to results, then return.`, null, 'solution');
      calls.pop(); return;
    }
    if (sum > input.target) {
      pruned++;
      save(`${sum} exceeds ${input.target}. Prune this call and return to its parent.`, null, 'pruned');
      calls.pop(); return;
    }
    for (let j = start; j < input.candidates.length; j++) {
      path.push(input.candidates[j]);
      save(`Append candidate ${input.candidates[j]} at index ${j}. Recurse with the same index ${j}, allowing reuse.`, j, 'choose');
      backtrack(j);
      const removed = path.pop();
      save(`Pop ${removed}. Restore ${list(path)} before trying the next candidate in this call.`, j, 'undo');
    }
    calls.pop();
  }
  backtrack(0);
  save(`Search complete. Return ${JSON.stringify(results)}. Every choice has been undone.`, null, 'complete');
  return frames;
}

function resultsPanel(results, title = 'Recorded combinations') {
  return `<section class="backtrack-panel"><h4>${escape(title)}</h4>${results.length ? `<ol class="backtrack-results">${results.map(result => `<li><code>${escape(JSON.stringify(result))}</code></li>`).join('')}</ol>` : '<p class="hint">No result recorded yet.</p>'}</section>`;
}

function renderCombination(frame, input) {
  const height = Math.max(108, 68 * (frame.path.length + 1) + 32);
  let sum = 0;
  const points = [0, ...frame.path].map((value, depth) => {
    sum += value;
    return {value, depth, sum, y: 40 + depth * 68};
  });
  const branch = points.map((point, index) => `${index ? `<line x1="110" y1="${point.y - 48}" x2="110" y2="${point.y - 20}" class="backtrack-edge"/>` : ''}<g transform="translate(110 ${point.y})" class="backtrack-node ${index === points.length - 1 ? `current ${frame.state}` : ''}" ${index === points.length - 1 ? 'data-follow' : ''}><circle r="21"/><text y="5">${index ? point.value : '∅'}</text><text x="92" y="4" class="backtrack-node-detail">sum ${point.sum}</text></g>`).join('');
  const candidates = input.candidates.map((value, index) => `<li class="${index === frame.selected ? 'current' : ''}"><span>index ${index}</span><strong>${value}</strong><span>${index === frame.selected ? 'chosen' : 'candidate'}</span></li>`).join('');
  const calls = frame.calls.length ? `<div class="height-table svg-scroll"><table><caption>Active recursive calls · oldest first</caption><thead><tr><th scope="col">Depth</th><th scope="col">Start index</th><th scope="col">Path on entry</th></tr></thead><tbody>${frame.calls.map((call, index) => `<tr><td>${index}</td><td>${call.start}</td><td>${escape(list(call.path))}</td></tr>`).join('')}</tbody></table></div>` : '<p class="hint">No active recursive calls.</p>';
  return `<section class="backtrack-panel"><h4>Candidates · choices use nondecreasing indices</h4><ol class="backtrack-candidates">${candidates}</ol></section><div class="backtrack-layout"><section class="backtrack-panel"><h4>Current search branch · each edge appends one candidate</h4><div class="svg-scroll backtrack-branch"><svg class="backtrack-svg" viewBox="0 0 320 ${height}" style="height:${height}px;min-width:280px" role="img" aria-label="${escape(`Current path ${list(frame.path)}, sum ${frame.sum}, target ${input.target}. ${frame.state}.`)}">${branch}</svg></div><p class="hint">∅ is the empty path. Previously explored branches are removed when the path is popped.</p></section><section class="backtrack-panel"><h4>Call stack and output</h4>${calls}${resultsPanel(frame.results)}</section></div>`;
}

export function mountCombinationSum(root) {
  return mountSequencePlayback(root, {
    id: 'combination-sum', description: 'Follow candidate reuse, successful paths, overshoot pruning, and undo operations in the saved Combination Sum implementation.',
    inputs: [{key: 'candidates', label: 'Candidates · JSON array', value: '[2,3,6,7]'}, {key: 'target', label: 'Target', value: '7', type: 'number'}],
    hint: 'Use 1–6 distinct candidates from 1 to 20, and a target from 0 to 12. Searches are limited to 1,800 steps; reduce the target if the complete trace is too large. Target 0 returns the empty combination.',
    legend: 'Outline: latest branch node or chosen candidate. Dashed outline: overshoot and prune. Thick green outline: a saved combination. The call stack shows each path on entry.',
    parse: combinationInput, modes: [{label: 'Reusable candidates with sum checks', trace: combinationTrace}], render: renderCombination
  });
}

function queensTrace(input) {
  const {n} = input, frames = [], queens = [], columns = new Set(), positive = new Set(), negative = new Set(), solutions = [];
  let attempts = 0;
  function save(message, row = null, column = null, state = '') {
    record(frames, {
      message, row, column, state, queens: [...queens], solutions: solutions.map(board => [...board]),
      columns: [...columns], positive: [...positive], negative: [...negative],
      stats: [['Next row', queens.length === n ? 'Complete board' : queens.length], ['Queens placed', queens.length], ['Squares checked', attempts], ['Solutions found', solutions.length]]
    });
  }
  save('Create an empty board. All columns are free, and both diagonal sets are empty.');
  function backtrack(row) {
    if (row === n) {
      solutions.push(queens.map(column => '.'.repeat(column) + 'Q' + '.'.repeat(n - column - 1)));
      save(`All ${n} rows have a queen. Copy this board into results, then backtrack to search for other boards.`, null, null, 'solution');
      return;
    }
    for (let column = 0; column < n; column++) {
      attempts++;
      if (positive.has(row + column) || negative.has(row - column)) {
        save(`Try (${row}, ${column}). ${positive.has(row + column) ? `r + c = ${row + column}` : `r − c = ${row - column}`} is already occupied. Skip this diagonal conflict.`, row, column, 'rejected');
        continue;
      }
      if (columns.has(column)) {
        save(`Try (${row}, ${column}). Diagonals are free, but cols[${column}] is False. Skip this occupied column.`, row, column, 'rejected');
        continue;
      }
      save(`Try (${row}, ${column}). The column and both diagonals are free.`, row, column, 'available');
      queens.push(column); columns.add(column); positive.add(row + column); negative.add(row - column);
      save(`Place Q at (${row}, ${column}). Mark the column and diagonals, then call backtrack(${row + 1}).`, row, column, 'placed');
      backtrack(row + 1);
      queens.pop(); columns.delete(column); positive.delete(row + column); negative.delete(row - column);
      save(`Remove Q from (${row}, ${column}). Restore cols[${column}] = True and discard diagonal keys ${row + column} and ${row - column}.`, row, column, 'undo');
    }
  }
  backtrack(0);
  save(`Search complete. Return ${solutions.length} distinct board${solutions.length === 1 ? '' : 's'}. The working board is empty again.`, null, null, 'complete');
  return frames;
}

function renderQueens(frame, input) {
  const rows = Array.from({length: input.n}, (_, row) => `<tr><th scope="row">${row}</th>${Array.from({length: input.n}, (_, column) => {
    const queen = frame.queens[row] === column, attempted = frame.row === row && frame.column === column;
    const attacked = frame.queens.some((placed, r) => row === r || column === placed || Math.abs(row - r) === Math.abs(column - placed));
    return `<td class="${(row + column) % 2 ? 'alternate' : ''} ${queen ? 'has-queen' : ''} ${attempted ? `attempted ${frame.state}` : ''}"><span aria-hidden="true">${queen ? 'Q' : attacked ? '×' : '·'}</span><span class="sr-only">${escape(`Row ${row}, column ${column}: ${queen ? 'queen' : attacked ? 'attacked' : 'free'}${attempted ? `, ${frame.state}` : ''}`)}</span></td>`;
  }).join('')}</tr>`).join('');
  const sorted = values => list([...values].sort((a, b) => a - b));
  const setState = `<div class="height-table svg-scroll"><table><caption>Occupancy after the current operation</caption><thead><tr><th scope="col">Source variable</th><th scope="col">State</th></tr></thead><tbody><tr><td>cols · True means free</td><td>${escape(list(Array.from({length: input.n}, (_, column) => frame.columns.includes(column) ? 'False' : 'True')))}</td></tr><tr><td>posDiag · r + c</td><td>${escape(sorted(frame.positive))}</td></tr><tr><td>negDiag · r − c</td><td>${escape(sorted(frame.negative))}</td></tr></tbody></table></div>`;
  const stack = frame.queens.length ? `<ol class="backtrack-placements">${frame.queens.map((column, row) => `<li>row ${row} → column ${column}</li>`).join('')}</ol>` : '<p class="hint">The placement stack is empty.</p>';
  const solutions = frame.solutions.length ? `<ol class="backtrack-boards">${frame.solutions.map((board, i) => `<li><span>Solution ${i + 1}</span><pre aria-label="Solution ${i + 1}">${board.join('\n')}</pre></li>`).join('')}</ol>` : '<p class="hint">No solution recorded yet.</p>';
  return `<div class="backtrack-layout"><section class="backtrack-panel"><h4>Working board · zero-based coordinates</h4><div class="svg-scroll"><table class="backtrack-board"><caption class="sr-only">Queens and attacked squares in the current search</caption><thead><tr><td></td>${Array.from({length: input.n}, (_, c) => `<th scope="col">${c}</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table></div></section><section class="backtrack-panel"><h4>Current placements · one queen per row</h4>${stack}${setState}</section></div><section class="backtrack-panel"><h4>Copied solution boards</h4>${solutions}</section>`;
}

export function mountNQueens(root) {
  return mountSequencePlayback(root, {
    id: 'n-queens', description: 'Try columns from left to right in each row. See why a square is rejected, how a queen updates the occupancy sets, and how backtracking restores them.',
    inputs: [{key: 'n', label: 'Board size n', value: '4', type: 'number'}],
    hint: 'Choose n from 1 to 6. The complete search is recorded, including boards with no solution (n = 2 and n = 3).',
    legend: 'Q: placed queen. ×: attacked square. Orange outline: current square. Dashed outline: rejected or removed placement. Saved boards remain below after their working queens are removed.',
    parse: fields => ({n: integer(fields.n, 1, 6, 'Board size')}), modes: [{label: 'Row backtracking with diagonal sets', trace: queensTrace}], render: renderQueens
  });
}
