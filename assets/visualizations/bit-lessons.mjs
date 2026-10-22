import {mountSequencePlayback, integer} from './sequence-playback.mjs';
import {grid} from './study-views.mjs';

const MASK = 0xffffffffn;
const MAX_SIGNED = 0x7fffffffn;
const bitColumns = Array.from({length: 32}, (_, index) => 31 - index);
const bits = value => (BigInt(value) & MASK).toString(2).padStart(32, '0').split('');
const save = (frames, message, state) => frames.push({message, ...structuredClone(state)});
const unsigned = fields => ({n: integer(fields.n, 0, 4294967295, 'n')});

function weightTrace(input, clearLowest = false) {
  const frames = [];
  let n = BigInt(input.n), count = 0, iteration = 0;
  const add = (message, marked = []) => save(frames, message, {
    lanes: [bits(n)], labels: ['n'], active: n ? [0, 31] : null, marked,
    stats: [['n · unsigned decimal', String(n)], ['count', count], ['Iterations', iteration]]
  });
  add('Initialize count = 0. Binary positions run from 31 on the left to 0 on the right.');
  while (n) {
    if (clearLowest) {
      const previous = n, lower = n - 1n, next = n & lower;
      const position = 31 - (previous ^ next).toString(2).length + 1;
      save(frames, `n − 1 = ${lower}. AND it with n to clear the lowest set bit; increment count to ${count + 1}.`, {
        lanes: [bits(previous), bits(lower), bits(next)], labels: ['n before', 'n − 1', 'n & (n − 1)'], active: [0, position],
        dependencies: [[1, position]], marked: [[2, position]],
        stats: [['n before', String(previous)], ['n after', String(next)], ['count after', count + 1], ['Iteration', iteration + 1]]
      });
      n = next; count++; iteration++;
    } else {
      const bit = Number(n & 1n);
      add(`Inspect n & 1 = ${bit}; add ${bit} to count, then shift n right by one.`);
      count += bit; n >>= 1n; iteration++;
      add(`After the shift, n = ${n} and count = ${count}. The lowest original bit has been consumed.`);
    }
  }
  add(`n is 0, so the loop stops. Return ${count} set bits.`);
  return frames;
}

function countingTrace(input) {
  const frames = [], result = Array(input.n + 1).fill(0);
  let current = null, half = null;
  const add = message => save(frames, message, {
    result, current, half,
    stats: [['i', current ?? '—'], ['i >> 1', half ?? '—'], ['i & 1', current === null ? '—' : current & 1]]
  });
  add('Allocate res[0…n] filled with 0. In particular, res[0] = 0 because zero has no set bits.');
  for (let i = 1; i <= input.n; i++) {
    current = i; half = i >> 1;
    add(`For i = ${i}, remove the last binary digit to get i >> 1 = ${half}; that smaller result is already known.`);
    result[i] = result[half] + (i & 1);
    add(`res[${i}] = res[${half}] + (${i} & 1) = ${result[half]} + ${i & 1} = ${result[i]}.`);
  }
  current = null; half = null;
  add(`Return ${JSON.stringify(result)}: entry i counts the set bits in i.`);
  return frames;
}

function reverseTrace(input, reference = false) {
  const frames = [];
  let n = BigInt(input.n), result = 0n, d = 0;
  const add = (message, active = null, dependencies = []) => save(frames, message, {
    lanes: [bits(input.n), bits(n), bits(result)], labels: ['Original n', 'Remaining n', 'res'], active, dependencies,
    stats: [['Bits consumed', d], ['Remaining n', String(n)], ['res · unsigned decimal', String(result)]]
  });
  add(reference ? 'Initialize res = 0. The reference consumes exactly 32 low bits, shifting the output left before inserting each bit.' : 'Initialize res = 0 and d = 0. Consume low bits until n becomes 0; a set bit at original position d contributes 2^(31 − d).');
  while (reference ? d < 32 : n !== 0n) {
    const bit = n & 1n;
    add(`Read original bit ${d}: n & 1 = ${bit}. ${reference ? 'Next shift res left and append this bit on the right.' : `Its reversed destination is bit ${31 - d}.`}`, [1, 31], [[0, 31 - d]]);
    n >>= 1n;
    if (reference) result = (result << 1n) | bit;
    else if (bit) result += 1n << BigInt(31 - d);
    const outputColumn = reference ? 31 : d;
    d++;
    add(`${reference ? 'res = (res << 1) | bit' : bit ? `Add 2^${32 - d} to res` : 'The consumed bit is 0, so res stays unchanged'}. res = ${result}; n = ${n}.`, [2, outputColumn], [[0, 32 - d]]);
  }
  add(`Return unsigned integer ${result}. ${reference ? 'All 32 positions have been consumed.' : `The remaining ${32 - d} high input bits are zero, so their reversed positions remain zero.`}`);
  return frames;
}

function sumTrace(input) {
  const frames = [];
  let a = BigInt(input.a), b = BigInt(input.b), iteration = 0;
  const add = message => save(frames, message, {
    lanes: [bits(a), bits(b)], labels: ['a · low 32 bits', 'b · low 32 bits'],
    stats: [['a', String(a)], ['b · pending carry', String(b)], ['Iterations', iteration]]
  });
  add('Use mask = 0xFFFFFFFF. XOR computes a sum without carries; AND followed by a left shift locates carries. Each assignment keeps only the low 32 bits.');
  while (b !== 0n) {
    const carry = (a & b) << 1n, nextA = (a ^ b) & MASK, nextB = carry & MASK;
    const marked = bits(nextB).flatMap((bit, index) => bit === '1' ? [[3, index]] : []);
    const dependencies = bits(a & b).flatMap((bit, index) => bit === '1' ? [[0, index], [1, index]] : []);
    iteration++;
    save(frames, `Iteration ${iteration}: carry = (a & b) << 1 = ${carry}; a = (a ^ b) & mask = ${nextA}; b = carry & mask = ${nextB}.`, {
      lanes: [bits(a), bits(b), bits(nextA), bits(nextB)], labels: ['a before', 'b before', 'XOR → new a', 'Carry → new b'], marked, dependencies,
      stats: [['Iteration', iteration], ['New a · unsigned', String(nextA)], ['New b · unsigned', String(nextB)], ['Unmasked carry', String(carry)]]
    });
    a = nextA; b = nextB;
  }
  const result = a <= MAX_SIGNED ? a : ~(a ^ MASK);
  add(`b is 0, so no carry remains. ${a <= MAX_SIGNED ? `a <= 0x7FFFFFFF; return ${result}.` : `a exceeds 0x7FFFFFFF. Convert from 32-bit two’s complement using ~(a ^ mask) = ${result}.`}`);
  frames.at(-1).stats.push(['Signed result', String(result)]);
  return frames;
}

function renderBits(frame) {
  return `<div class="study-bits">${grid('32-bit representation · bit positions', frame.lanes, {
    rowLabels: frame.labels, colLabels: bitColumns, active: frame.active ?? null,
    dependencies: frame.dependencies ?? [], marked: frame.marked ?? []
  })}</div>`;
}

export function mountNumberOf1Bits(root) {
  return mountSequencePlayback(root, {
    id: 'number-of-1-bits', description: 'Compare scanning every significant bit with clearing one set bit per iteration. Both follow the saved Python implementations.',
    inputs: [{key: 'n', label: 'Unsigned 32-bit integer n', value: '11'}], hint: 'Enter an integer from 0 to 4294967295. Negative Python integers are outside this problem’s input.',
    legend: 'Binary positions run from 31 to 0. Orange: inspected bit. Underline: the corresponding n − 1 bit. Green: the position cleared by AND.', parse: unsigned,
    modes: [{label: 'Right shifts and n & 1', trace: input => weightTrace(input)}, {label: 'Clear lowest set bit with n & (n − 1)', trace: input => weightTrace(input, true)}], render: renderBits
  });
}

export function mountCountingBits(root) {
  return mountSequencePlayback(root, {
    id: 'counting-bits', description: 'Reuse the count for i >> 1, then add the final binary digit. The smaller dependency has already been computed.',
    inputs: [{key: 'n', label: 'Last integer n', value: '10'}], hint: 'Use n from 0 to 32 so every result remains easy to inspect. The output includes both 0 and n.',
    legend: 'Orange: res[i] being computed. Underline: res[i >> 1]. The two binary rows show how a right shift removes the final bit.',
    parse: fields => ({n: integer(fields.n, 0, 32, 'n')}), modes: [{label: 'DP: res[i >> 1] + (i & 1)', trace: countingTrace}],
    render: frame => grid('res · set-bit counts indexed by integer', [frame.result], {rowLabels: ['res'], colLabels: frame.result.map((_, i) => i), active: frame.current === null ? null : [0, frame.current], dependencies: frame.half === null ? [] : [[0, frame.half]]})
      + (frame.current === null ? '' : grid('Current integer and its smaller dependency', [bits(frame.current).slice(-6), bits(frame.half).slice(-6)], {rowLabels: [`i = ${frame.current}`, `i >> 1 = ${frame.half}`], colLabels: [5, 4, 3, 2, 1, 0], active: [0, 5]}))
  });
}

export function mountReverseBits(root) {
  return mountSequencePlayback(root, {
    id: 'reverse-bits', description: 'Follow both saved ways to reverse the positions in a 32-bit unsigned integer. Leading zeros are part of the fixed width.',
    inputs: [{key: 'n', label: 'Unsigned 32-bit integer n', value: '43261596'}], hint: 'Enter an integer from 0 to 4294967295. For example, 1 becomes 2147483648, and 0 remains 0.',
    legend: 'Orange: current input or output bit. Underline: the original bit being consumed. Each row always shows all 32 positions.', parse: unsigned,
    modes: [{label: 'Place set bits at 31 − d', trace: input => reverseTrace(input)}, {label: 'Reference: 32 shifts and appends', trace: input => reverseTrace(input, true)}], render: renderBits
  });
}

export function mountSumOfTwoIntegers(root) {
  return mountSequencePlayback(root, {
    id: 'sum-of-two-integers', description: 'Separate each addition round into XOR and carry propagation, then interpret the final 32-bit word as a signed integer.',
    inputs: [{key: 'a', label: 'Signed 32-bit integer a', value: '-3'}, {key: 'b', label: 'Signed 32-bit integer b', value: '5'}],
    hint: 'Each input must be from −2147483648 to 2147483647. The saved mask implements 32-bit wraparound if the mathematical sum overflows this range.',
    legend: 'Underline: operand positions where both bits are 1. Green: the next carry destinations after shifting left. All binary rows show the low 32 bits.',
    parse: fields => ({a: integer(fields.a, -2147483648, 2147483647, 'a'), b: integer(fields.b, -2147483648, 2147483647, 'b')}), modes: [{label: 'XOR, shifted AND, and 32-bit masking', trace: sumTrace}], render: renderBits
  });
}
