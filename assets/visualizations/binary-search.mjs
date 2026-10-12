import {escape, mountSequencePlayback, numbers} from './sequence-playback.mjs';

const display = value => value === Infinity ? '+∞' : value === -Infinity ? '−∞' : String(value);

function parseMinimum(fields) {
  const values = numbers(fields.values);
  if (!values.length) throw Error('Enter at least one value.');
  if (new Set(values).size !== values.length) throw Error('Use distinct values for this rotated-array algorithm.');
  const descents = values.filter((value, i) => value > values[(i + 1) % values.length]).length;
  if (values.length > 1 && descents !== 1) throw Error('Enter a rotation of a strictly increasing array, such as [4,5,6,1,2,3].');
  return {values};
}

export function traceMinimum({values}) {
  let left = 0, right = values.length - 1;
  const frames = [];
  function record(message, current = null, answer = null) {
    frames.push({
      left, right, current, answer, message,
      stats: [['Search range', `[${left}, ${right}]`], ['Candidate at L', values[left]], ['mid', current ?? '—'], ['Answer', answer ?? '—']]
    });
  }
  record('The minimum is somewhere in the inclusive range [L, R]. Compare the middle value with the right endpoint to shrink this range.');
  while (right > left) {
    const mid = Math.floor((left + right) / 2);
    const goesRight = values[mid] > values[right];
    record(`mid = (${left} + ${right}) // 2 = ${mid}. Compare nums[${mid}] = ${values[mid]} with nums[${right}] = ${values[right]}: ${values[mid]} > ${values[right]} is ${goesRight ? 'true' : 'false'}.`, mid);
    if (goesRight) {
      left = mid + 1;
      record(`The middle is above the right endpoint, so the minimum is strictly after mid. Set L = ${left}.`);
    } else {
      right = mid;
      record(`The middle is at or below the right endpoint. Keep mid as a possible minimum and set R = ${right}.`);
    }
  }
  record(`L and R meet at index ${left}. Return nums[${left}] = ${values[left]}.`, left, values[left]);
  return frames;
}

function renderMinimum(frame, {values}) {
  return `<h4>nums · inclusive search range</h4><div class="svg-scroll"><ol class="binary-range-cells" aria-label="Array values, indices, and surviving search range">${values.map((value, i) => {
    const inside = i >= frame.left && i <= frame.right;
    const labels = [i === frame.left ? 'L' : '', i === frame.current ? 'mid' : '', i === frame.right ? 'R' : ''].filter(Boolean);
    const current = i === frame.current;
    return `<li ${current ? 'data-follow' : ''} class="binary-cell ${inside ? 'in-range' : 'outside-range'} ${current ? 'comparison-highlight' : ''} ${i === frame.left ? 'candidate' : ''} ${frame.answer !== null && i === frame.left ? 'binary-answer' : ''}"><span class="sequence-index">${i}</span><strong>${escape(value)}</strong><span class="sequence-pointer">${labels.join(' / ') || '·'}</span><span class="binary-cell-state">${frame.answer !== null && i === frame.left ? 'Minimum' : i === frame.left ? 'Candidate' : inside ? 'In range' : 'Excluded'}</span></li>`;
  }).join('')}</ol></div>${frame.current !== null && frame.answer === null ? `<p class="sequence-detail">Compared values: nums[mid] = ${escape(values[frame.current])} and nums[R] = ${escape(values[frame.right])}.</p>` : ''}`;
}

function parseMedian(fields) {
  const first = numbers(fields.first), second = numbers(fields.second);
  if (!first.length && !second.length) throw Error('At least one array must contain a value.');
  for (const [name, values] of [['nums1', first], ['nums2', second]]) {
    if (values.some((value, i) => i > 0 && values[i - 1] > value)) throw Error(`${name} must be sorted in nondecreasing order.`);
  }
  return {first, second};
}

export function traceMedian({first, second}) {
  const swapped = first.length > second.length;
  const a = swapped ? second : first, b = swapped ? first : second;
  const total = a.length + b.length, half = Math.floor(total / 2);
  let left = 0, right = a.length - 1;
  const frames = [];
  function record(message, boundaries = null, answer = null) {
    const stats = [['Total length', total], ['Left half size', half], ['Search range in A', `[${left}, ${right}]`]];
    if (boundaries) stats.push(['i · last left index in A', boundaries.i], ['j · last left index in B', boundaries.j]);
    if (answer !== null) stats.push(['Median', answer]);
    frames.push({left, right, swapped, total, half, boundaries, answer, message, stats});
  }
  record(`${swapped ? 'nums1 is longer, so swap the array roles: A is the original nums2 and B is the original nums1.' : 'A is nums1, the shorter or equal-length array; B is nums2.'} The two left portions must contain ${half} values in total. Binary search the last left index in A.`);
  while (true) {
    // Math.floor mirrors Python //, including the valid empty-left partition i = -1.
    const i = Math.floor((left + right) / 2), j = half - i - 2;
    const left1 = i > -1 ? a[i] : -Infinity;
    const right1 = i + 1 < a.length ? a[i + 1] : Infinity;
    const left2 = j > -1 ? b[j] : -Infinity;
    const right2 = j + 1 < b.length ? b[j + 1] : Infinity;
    const firstPass = left1 <= right2, secondPass = left2 <= right1;
    const boundaries = {i, j, left1, right1, left2, right2, firstPass, secondPass};
    record(`i = (${left} + ${right}) // 2 = ${i}; j = ${half} − ${i} − 2 = ${j}. A contributes ${i + 1} left values and B contributes ${j + 1}, totaling ${half}. Check the two crossed comparisons.`, boundaries);
    if (firstPass && secondPass) {
      const low = Math.max(left1, left2), high = Math.min(right1, right2);
      const answer = total % 2 ? high : (low + high) / 2;
      record(total % 2 ? `Both comparisons pass. The total is odd, so return the smallest right value: min(${display(right1)}, ${display(right2)}) = ${answer}.` : `Both comparisons pass. The total is even, so average the largest left value and the smallest right value: (max(${display(left1)}, ${display(left2)}) + min(${display(right1)}, ${display(right2)})) / 2 = (${low} + ${high}) / 2 = ${answer}.`, boundaries, answer);
      break;
    }
    if (left1 > right2) {
      right = i - 1;
      record(`A’s left boundary ${display(left1)} is larger than B’s right boundary ${display(right2)}. A contributes too many left values. Set R = i − 1 = ${right}; the next partition will move left in A and right in B.`, boundaries);
    } else {
      left = i + 1;
      record(`B’s left boundary ${display(left2)} is larger than A’s right boundary ${display(right1)}. A contributes too few left values. Set L = i + 1 = ${left}; the next partition will move right in A and left in B.`, boundaries);
    }
  }
  return frames;
}

function renderPartition(values, cut, name, original, searched) {
  const item = i => {
    const inLeft = cut !== null && i <= cut;
    const boundary = cut !== null && (i === cut || i === cut + 1);
    return `<li class="binary-cell ${inLeft ? 'partition-left' : ''} ${boundary ? 'comparison-highlight' : ''}"><span class="sequence-index">${i}</span><strong>${escape(values[i])}</strong><span class="sequence-pointer">${cut === null ? '·' : i === cut ? 'left boundary' : i === cut + 1 ? 'right boundary' : inLeft ? 'left half' : 'right half'}</span></li>`;
  };
  const marker = '<li class="partition-cut" data-follow><span aria-hidden="true">│</span><span>Partition</span></li>';
  let cells = '';
  for (let i = 0; i <= values.length; i++) {
    if (cut !== null && i === cut + 1) cells += marker;
    if (i < values.length) cells += item(i);
  }
  return `<section class="binary-partition-row"><h4>${name} = ${original} · ${searched ? 'searched array' : 'other array'} · ${values.length} values</h4><div class="svg-scroll"><ol class="binary-partition-cells" aria-label="${name} values and partition">${cells}${values.length ? '' : '<li class="binary-empty">Empty array</li>'}</ol></div></section>`;
}

function renderBoundaries(boundaries) {
  const {left1, right1, left2, right2, firstPass, secondPass} = boundaries;
  function box(x, y, label, value) {
    return `<rect class="partition-boundary-box" x="${x}" y="${y}" width="180" height="65" rx="5"/><text x="${x + 90}" y="${y + 22}" class="partition-boundary-label">${label}</text><text x="${x + 90}" y="${y + 48}" class="partition-boundary-value">${escape(display(value))}</text>`;
  }
  return `<div class="binary-boundary-region"><svg class="partition-boundaries" viewBox="0 0 500 190" role="img" aria-label="Crossed boundary comparisons: A left with B right, and B left with A right"><title>Crossed partition boundaries</title><line class="partition-comparison ${firstPass ? 'passes' : 'fails'}" x1="210" y1="45" x2="290" y2="145"/><line class="partition-comparison ${secondPass ? 'passes' : 'fails'}" x1="210" y1="145" x2="290" y2="45"/>${box(30, 12, 'A left', left1)}${box(290, 12, 'A right', right1)}${box(30, 112, 'B left', left2)}${box(290, 112, 'B right', right2)}</svg><ul class="partition-checks"><li class="${firstPass ? 'passes' : 'fails'}"><strong>A left ≤ B right:</strong> ${escape(display(left1))} ≤ ${escape(display(right2))} · ${firstPass ? 'Pass' : 'Fail'}</li><li class="${secondPass ? 'passes' : 'fails'}"><strong>B left ≤ A right:</strong> ${escape(display(left2))} ≤ ${escape(display(right1))} · ${secondPass ? 'Pass' : 'Fail'}</li></ul></div>`;
}

function renderMedian(frame, {first, second}) {
  const a = frame.swapped ? second : first, b = frame.swapped ? first : second;
  const boundaries = frame.boundaries;
  return `${renderPartition(a, boundaries?.i ?? null, 'A', frame.swapped ? 'nums2' : 'nums1', true)}${renderPartition(b, boundaries?.j ?? null, 'B', frame.swapped ? 'nums1' : 'nums2', false)}${boundaries ? renderBoundaries(boundaries) : '<p class="hint">Step forward to place the first partition in both arrays.</p>'}${frame.answer !== null ? `<p class="binary-median-answer">Median: <strong>${escape(frame.answer)}</strong></p>` : ''}`;
}

const configs = {
  minimum: {
    id: 'rotated-minimum',
    description: 'Follow the exact nums[mid] versus nums[R] comparisons in the Python solution. Edit the array, then load it to create a new trace.',
    inputs: [{key: 'values', label: 'Rotated sorted array', value: '[4,5,6,7,0,1,2]'}],
    hint: 'Use a nonempty rotation of a strictly increasing array: at most 32 distinct integers from −999 to 999.',
    legend: 'The highlighted range contains every remaining candidate. L marks its first candidate; mid and R mark the compared positions. Excluded cells are labeled.',
    modes: [{label: 'Compare middle with right endpoint', trace: traceMinimum}],
    parse: parseMinimum,
    render: renderMinimum
  },
  median: {
    id: 'two-array-median',
    description: 'Move the two partitions without merging the arrays. Binary search A, the shorter array, until both crossed boundary comparisons pass.',
    inputs: [{key: 'first', label: 'nums1 · sorted array', value: '[1,3,8,9,15]'}, {key: 'second', label: 'nums2 · sorted array', value: '[7,11,18,19,21]'}],
    hint: 'Use up to 32 integers from −999 to 999 in each array, sorted in nondecreasing order. Duplicates and one empty array are allowed; both arrays cannot be empty.',
    legend: 'Shading marks the left half. The divider marks each partition; outlined cells are boundary values. −∞ or +∞ replaces a missing boundary. Crossed comparisons have explicit Pass or Fail labels.',
    modes: [{label: 'Partition the shorter array', trace: traceMedian}],
    parse: parseMedian,
    render: renderMedian
  }
};

export const mountBinarySearch = (root, kind) => mountSequencePlayback(root, configs[kind]);
