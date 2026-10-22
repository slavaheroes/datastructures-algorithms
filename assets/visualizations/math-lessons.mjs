import {escape, integer, mountSequencePlayback} from './sequence-playback.mjs';
import {entries, grid, sequence} from './study-views.mjs';

function matrixInput(fields) {
  if (fields.matrix.length > 1000) throw Error('Use a matrix of at most 6 rows and 6 columns.');
  let matrix;
  try { matrix = JSON.parse(fields.matrix); } catch { throw Error('Enter a JSON matrix such as [[1,1,1],[1,0,1],[1,1,1]].'); }
  if (!Array.isArray(matrix) || matrix.length < 1 || matrix.length > 6 || matrix.some(row => !Array.isArray(row) || row.length < 1 || row.length > 6 || row.length !== matrix[0].length || row.some(value => !Number.isInteger(value) || value < -99 || value > 99))) throw Error('Use a rectangular 1–6 by 1–6 matrix with integers from −99 to 99.');
  return {matrix};
}

function zeroesTrace(input) {
  const matrix = input.matrix.map(row => [...row]), frames = [], rows = matrix.length, cols = matrix[0].length;
  let rowOneZero = false, colOneZero = false, active = null, dependencies = [], phase = 'Inspect first column';
  const add = message => frames.push(structuredClone({message, matrix, active, dependencies, phase, stats: [['Phase', phase], ['rowOneZero', String(rowOneZero)], ['colOneZero', String(colOneZero)]]}));
  add('Keep two flags for the original first row and column. Later, their cells will store markers for the interior.');
  for (let i = 0; i < rows; i++) {
    active = [i, 0];
    if (matrix[i][0] === 0) colOneZero = true;
    add(`Read original first-column cell [${i},0] = ${matrix[i][0]}. colOneZero = ${colOneZero}.`);
  }
  phase = 'Inspect first row';
  for (let j = 0; j < cols; j++) {
    active = [0, j];
    if (matrix[0][j] === 0) rowOneZero = true;
    add(`Read original first-row cell [0,${j}] = ${matrix[0][j]}. rowOneZero = ${rowOneZero}.`);
  }
  phase = 'Store interior zero markers';
  for (let i = 1; i < rows; i++) {
    for (let j = 1; j < cols; j++) {
      active = [i, j]; dependencies = [];
      add(`Inspect interior [${i},${j}] = ${matrix[i][j]}.${matrix[i][j] === 0 ? ' Store its row and column markers next.' : ' No markers are needed.'}`);
      if (matrix[i][j] === 0) {
        matrix[i][0] = 0; active = [i, 0]; dependencies = [[i, j]];
        add(`Write matrix[${i}][0] = 0 to mark row ${i}.`);
        matrix[0][j] = 0; active = [0, j];
        add(`Write matrix[0][${j}] = 0 to mark column ${j}. The interior scan never visits these marker cells.`);
      }
    }
  }
  active = null; dependencies = []; phase = 'Apply markers to interior';
  add('All original interior zeros have been inspected. It is now safe to overwrite the interior using the stored markers.');
  for (let i = 1; i < rows; i++) {
    for (let j = 1; j < cols; j++) {
      active = [i, j]; dependencies = [[0, j], [i, 0]];
      const clear = matrix[0][j] === 0 || matrix[i][0] === 0;
      if (clear) matrix[i][j] = 0;
      add(`For [${i},${j}], column marker = ${matrix[0][j]}, row marker = ${matrix[i][0]}. ${clear ? 'At least one is zero: write 0.' : 'Neither is zero: keep the value.'}`);
    }
  }
  dependencies = []; phase = 'Finish first row and column';
  if (rowOneZero) {
    for (let j = 0; j < cols; j++) { active = [0, j]; matrix[0][j] = 0; add(`rowOneZero is True. Clear first-row cell [0,${j}].`); }
  } else { active = null; add('rowOneZero is False. Keep the first row’s existing values and column markers.'); }
  if (colOneZero) {
    for (let i = 0; i < rows; i++) { active = [i, 0]; matrix[i][0] = 0; add(`colOneZero is True. Clear first-column cell [${i},0].`); }
  } else { active = null; add('colOneZero is False. Keep the first column’s existing values and row markers.'); }
  active = null; phase = 'Complete'; add('The matrix has been updated in place. Only rows and columns containing an original zero have been cleared; the method returns None.');
  return frames;
}

export function mountSetMatrixZeroes(root) {
  return mountSequencePlayback(root, {
    id: 'set-matrix-zeroes', description: 'Use the first row and column as markers, saving their original zero status in two flags before writing any marker.',
    inputs: [{key: 'matrix', label: 'Matrix · JSON rows', value: '[[1,1,1],[1,0,1],[1,1,1]]'}],
    hint: 'A rectangular matrix of 1–6 rows and 1–6 columns; integers from −99 to 99. Try [[0,1,2],[3,4,5]] to see the two flags.',
    legend: 'Orange outline: current cell. Green fill: zero marker in the first row or column. Underline: cells read as dependencies. The original matrix below keeps the starting zeros visible.',
    parse: matrixInput, modes: [{label: 'In-place first-row / first-column markers', trace: zeroesTrace}],
    render: (frame, input) => {
      const markers = [], originals = [];
      frame.matrix.forEach((row, i) => row.forEach((value, j) => { if (value === 0 && (i === 0 || j === 0)) markers.push([i, j]); }));
      input.matrix.forEach((row, i) => row.forEach((value, j) => { if (value === 0) originals.push([i, j]); }));
      return grid(`Working matrix · ${frame.phase}`, frame.matrix, {active: frame.active, dependencies: frame.dependencies, marked: markers}) + grid('Original matrix · original zeros marked', input.matrix, {marked: originals});
    }
  });
}

function powerInput(fields) {
  const base = Number(fields.base), exponent = integer(fields.exponent, -32, 32, 'Exponent');
  if (fields.base.trim() === '' || !Number.isFinite(base) || Math.abs(base) > 10) throw Error('Base must be a finite number from −10 to 10.');
  if (base === 0 && exponent <= 0) throw Error('Use a positive exponent for a zero base; zero to a nonpositive power is outside this example’s domain.');
  return {base, exponent};
}
function powerTrace(input) {
  const frames = [], history = [];
  let x = input.base, degree = Math.abs(input.exponent), res = null, result = null, bit = null, operation = 'Check special cases';
  const add = message => {
    if (![x, res, result].every(value => value === null || Number.isFinite(value))) throw Error('This input overflows floating-point playback. Use a smaller magnitude or exponent.');
    frames.push(structuredClone({message, x, degree, res, result, bit, operation, history, stats: [['Current factor x', x], ['Remaining degree', degree], ['Accumulator res', res ?? '—'], ['Returned result', result ?? '—']]}));
  };
  add('Follow the saved source: check x = 1 or 0, then n = 0, then x = −1, before initializing res.');
  if (x === 1 || x === 0) { result = x; add(`x = ${x}. The first special case returns ${result} immediately.`); return frames; }
  if (input.exponent === 0) { result = 1; add('n = 0. Return 1.'); return frames; }
  if (x === -1) { result = Math.abs(input.exponent % 2) === 1 ? x : -x; add(`x = −1 and n is ${Math.abs(input.exponent % 2) === 1 ? 'odd' : 'even'}. Return ${result}.`); return frames; }
  res = x; operation = 'Initialize';
  add(`Start res = x = ${x}, degree = abs(n) = ${degree}. At a loop boundary, res × x^(degree − 1) equals the desired positive power.`);
  let position = 0;
  while (degree > 1) {
    bit = position; operation = 'Inspect parity';
    add(`degree = ${degree} is ${degree % 2 ? 'odd' : 'even'}. Its lowest bit determines whether the extra multiplication runs.`);
    if (degree % 2 === 1) {
      const previous = res; res *= x; operation = 'Odd-degree extra multiplication'; history.push([operation, `${previous} × ${x}`, res]);
      add(`Odd degree: res = ${previous} × ${x} = ${res}.`);
    }
    const previousRes = res; res *= x; operation = 'Always multiply accumulator'; history.push([operation, `${previousRes} × ${x}`, res]);
    add(`The source always executes res *= x: res becomes ${res}.`);
    const previousX = x; x *= x; operation = 'Square factor'; history.push([operation, `${previousX} × ${previousX}`, x]);
    add(`Square the factor: x becomes ${x}. The next iteration uses a factor representing twice as many original powers.`);
    degree = Math.floor(degree / 2); operation = 'Halve degree';
    add(`Set degree = degree // 2 = ${degree}. The loop-boundary invariant holds again.`); position++;
  }
  bit = null; operation = 'Return';
  if (res === 0 && input.base !== 0) throw Error('This input underflows floating-point playback. Use a larger base magnitude or smaller exponent.');
  result = input.exponent > 0 ? res : 1 / res;
  add(input.exponent > 0 ? `degree is 1. Return res = ${result}.` : `degree is 1. Since n is negative, return 1 / res = ${result}.`);
  return frames;
}
export function mountPow(root) {
  return mountSequencePlayback(root, {
    id: 'pow-x-n', description: 'Follow the saved exponentiation-by-squaring variant: res begins at x, odd degree adds a multiplication, and every iteration multiplies res, squares x, and halves degree.',
    inputs: [{key: 'base', label: 'Base x', value: '2'}, {key: 'exponent', label: 'Integer exponent n', value: '10', type: 'number'}],
    hint: 'Base from −10 to 10; integer exponent from −32 to 32. A zero base requires a positive exponent. Playback rejects floating-point overflow or underflow.',
    legend: 'Orange: the original exponent bit being processed, starting at the least significant bit. The registers and multiplication log follow the source’s order. Decimal results use floating-point arithmetic.',
    parse: powerInput, modes: [{label: 'Saved res = x squaring variant', trace: powerTrace}],
    render: (frame, input) => sequence('Bits of abs(n) · least significant first', [...Math.abs(input.exponent).toString(2)].reverse(), {active: frame.bit, notes: [...Math.abs(input.exponent).toString(2)].map((_, i) => `2^${i}`)}) + entries('Source registers', ['Variable', 'Current value'], [['res', frame.res], ['x', frame.x], ['degree', frame.degree], ['n (unchanged)', input.exponent], ['return value', frame.result]]) + `<p class="study-detail">${escape(frame.operation)}</p>` + entries('Multiplication log', ['Operation', 'Expression', 'Result'], frame.history)
  });
}
