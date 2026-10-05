import {mountSequencePlayback, numbers, characters, integer} from './sequence-playback.mjs';

const counts = values => { const map = new Map(); values.forEach(c => change(map, c, 1)); return map; };
const change = (map, c, amount) => map.set(c, (map.get(c) || 0) + amount);
const countRows = map => [...map].filter(([, n]) => n > 0).sort(([a], [b]) => a.localeCompare(b)).map(([c, n]) => [c === ' ' ? 'space' : c, n]);
const targetRows = (need, have) => [...new Set([...need.keys(), ...have.keys()])].sort().map(c => [c === ' ' ? 'space' : c, need.get(c) || 0, have.get(c) || 0]);
const field = (key, label, value, type) => ({key, label, value, type});

export function mountWindow(root, kind) {
  const configs = {
    stock: {
      inputs: [field('values', 'Daily prices', '[7,1,5,3,6,4]')],
      hint: 'JSON array of up to 32 prices from 0 to 999. Indices are zero-based days.',
      description: 'Follow the buy candidate and candidate sale. The best profit is saved even when the buy pointer moves.',
      parse: raw => ({values: numbers(raw.values, 0)}),
      modes: [{label: 'Buy and sell pointers', trace: stockTrace}]
    },
    unique: {
      inputs: [field('s', 'String s', 'abcabcbb')],
      hint: 'Up to 32 printable ASCII characters, including spaces. Case matters.',
      description: 'Watch the left boundary remove a repeat or jump past its last occurrence. Switch versions to compare the two Python solutions.',
      parse: raw => ({values: characters(raw.s)}),
      modes: [{label: 'Frequency array (first solution)', trace: input => uniqueTrace(input, false)}, {label: 'Last-seen indices (second solution)', trace: input => uniqueTrace(input, true)}]
    },
    replacement: {
      inputs: [field('s', 'String s', 'AABABBA'), field('k', 'Replacement budget k', '1', 'number')],
      hint: 'Up to 32 uppercase English letters (A–Z); k from 0 to 32.',
      description: 'Compare the historical maxFreq bound with the exact cost of the current window. A retained window can be infeasible when maxFreq is stale.',
      parse: raw => ({values: characters(raw.s, /^[A-Z]*$/), k: integer(raw.k, 0, 32, 'k')}),
      modes: [{label: 'Historical maximum frequency', trace: replacementTrace}]
    },
    permutation: {
      inputs: [field('target', 'Pattern s1', 'ab'), field('s', 'Search string s2', 'eidbaooo')],
      hint: 'Up to 32 lowercase English letters (a–z) per string.',
      description: 'Keep exactly the pattern’s width and compare character counts. Playback stops at the first matching permutation.',
      parse: raw => ({values: characters(raw.s, /^[a-z]*$/), target: characters(raw.target, /^[a-z]*$/)}),
      modes: [{label: 'Fixed-width count arrays', trace: permutationTrace}]
    },
    minimum: {
      inputs: [field('s', 'Search string s', 'ADOBECODEBANC'), field('target', 'Required characters t', 'ABC')],
      hint: 'Up to 32 printable ASCII characters per string. Counts and case both matter.',
      description: 'Expand until all target counts are covered, then remove left characters one at a time to find the shortest valid window.',
      parse: raw => ({values: characters(raw.s), target: characters(raw.target)}),
      modes: [{label: 'Expand and shrink', trace: minimumTrace}]
    },
    maximum: {
      inputs: [field('values', 'Numbers', '[1,3,-1,-3,5,3,6,7]'), field('k', 'Window size k', '3', 'number')],
      hint: 'JSON array of 1–32 integers from −999 to 999; 1 ≤ k ≤ array length.',
      description: 'Compare the deque’s candidate indices with the heap’s lazy removal of expired entries. The heap table is sorted by priority, not drawn as its internal array.',
      parse: raw => { const values = numbers(raw.values); if (!values.length) throw Error('Enter at least one number.'); return {values, k: integer(raw.k, 1, values.length, 'k')}; },
      modes: [{label: 'Monotonic deque (efficient solution)', trace: dequeTrace}, {label: 'Max-heap (first solution)', trace: heapTrace}]
    }
  };
  return mountSequencePlayback(root, {
    id: `window-${kind}`,
    legend: 'Shaded cells lie between L and R. L/R label the current boundaries (buy/sell candidates for stock); i marks the item being processed. Indices appear above values.',
    ...configs[kind]
  });
}

function stockTrace({values}) {
  const frames = []; let left = 0, best = 0, trade = 'No trade';
  const save = (message, right) => frames.push({left, right, message, stats: [['Buy day', values.length ? left : '—'], ['Sell day', right >= 0 ? right : '—'], ['Best profit', best], ['Best trade', trade]]});
  save('Start with the first day as the buy candidate. No profit has been recorded.', -1);
  for (let right = 1; right < values.length; right++) {
    if (values[right] > values[left]) {
      const profit = values[right] - values[left];
      if (profit > best) { best = profit; trade = `Day ${left} → day ${right}`; }
      save(`Compare sell price ${values[right]} with buy price ${values[left]}. Profit = ${profit}; best = ${best}.`, right);
    } else {
      save(`Price ${values[right]} is no greater than the buy price ${values[left]}. Move the buy candidate to day ${right}.`, right);
      left = right;
      save(`Buy candidate is now day ${left}; the next candidate sale must be later.`, right);
    }
  }
  save(`Finished. Maximum profit = ${best}. ${best ? trade + '.' : 'No profitable trade.'}`, values.length - 1);
  return frames;
}

function uniqueTrace({values}, jump) {
  const frames = [], map = new Map(); let left = 0, best = 0;
  const save = (message, right, current = right) => frames.push({left, right, current, message,
    stats: [['Left index', left], ['Best length', best]], caption: jump ? 'Last-seen indices (including outside the window)' : 'Frequencies already inserted into the window',
    columns: ['Character', jump ? 'Last index' : 'Count'], rows: jump ? [...map] : countRows(map)});
  save('Start with an empty window and best length 0.', -1);
  for (let right = 0; right < values.length; right++) {
    const c = values[right];
    if (jump) {
      const previous = map.get(c), oldLeft = left;
      if (previous !== undefined) left = Math.max(left, previous + 1);
      map.set(c, right); best = Math.max(best, right - left + 1);
      save(previous === undefined ? `First occurrence of ${JSON.stringify(c)}. Record index ${right}.` : `Last ${JSON.stringify(c)} was at ${previous}. L = max(${oldLeft}, ${previous + 1}) = ${left}; record the new index.`, right);
    } else {
      while ((map.get(c) || 0) > 0) {
        const removed = left; change(map, values[left], -1); left++;
        save(`Incoming ${JSON.stringify(c)} repeats. Remove ${JSON.stringify(values[removed])} at ${removed} and advance L before inserting the incoming character.`, right - 1, right);
      }
      best = Math.max(best, right - left + 1); change(map, c, 1);
      save(`Insert ${JSON.stringify(c)}. The window is unique, with length ${right - left + 1}.`, right);
    }
  }
  save(`Finished. Longest unique substring length = ${best}.`, values.length - 1);
  return frames;
}

function replacementTrace({values, k}) {
  const frames = [], map = new Map(); let left = 0, historical = 0, best = 0;
  const save = (message, right) => {
    const width = Math.max(0, right - left + 1), actual = Math.max(0, ...map.values());
    frames.push({left, right, message, stats: [['Historical maxFreq', historical], ['Length − maxFreq', width - historical], ['Exact replacements needed', width - actual], ['Budget k', k], ['Current window feasible', width - actual <= k ? 'Yes' : 'No'], ['Best length', best]], columns: ['Character', 'Current count'], rows: countRows(map), caption: 'Current frequencies; historical maxFreq never decreases'});
  };
  save('Initialize counts, maxFreq, and best length to zero.', -1);
  for (let right = 0; right < values.length; right++) {
    change(map, values[right], 1); historical = Math.max(historical, map.get(values[right]));
    save(`Add ${values[right]} at index ${right}. Raise maxFreq only if this count is a new record.`, right);
    if (right - left + 1 - historical > k) {
      const removed = left; change(map, values[left], -1); left++;
      save(`Length − maxFreq exceeds ${k}. Remove ${values[removed]} at ${removed} once. Keep historical maxFreq = ${historical}.`, right);
    }
    best = Math.max(best, right - left + 1);
    save(`Record best length ${best}. A stale bound can retain an infeasible window, but does not create an unattainable new length record.`, right);
  }
  save(`Finished. Longest achievable repeated-character substring length = ${best}.`, values.length - 1);
  return frames;
}

function permutationTrace({values, target}) {
  const frames = [], need = counts(target), have = new Map(); let left = 0;
  const save = (message, right, result = 'Searching') => frames.push({left, right, message, stats: [['Target width', target.length], ['Current width', Math.max(0, right - left + 1)], ['Result', result]], columns: ['Character', 'Required', 'Window'], rows: targetRows(need, have), caption: 'Count comparison (omitted letters have count zero)'});
  save('Count the pattern, then build a window of the same length.', -1);
  if (target.length > values.length) { save('Pattern is longer than the search string. Return false.', -1, 'false'); return frames; }
  for (let right = 0; right < values.length; right++) {
    change(have, values[right], 1);
    save(`Add ${values[right]} at ${right}.`, right);
    if (right - left + 1 > target.length) {
      const removed = left; change(have, values[left], -1); left++;
      save(`Remove ${values[removed]} at ${removed} to restore width ${target.length}.`, right);
    }
    const equal = [...new Set([...need.keys(), ...have.keys()])].every(c => (need.get(c) || 0) === (have.get(c) || 0));
    if (right - left + 1 === target.length && equal) { save(`Exact count match: ${JSON.stringify(values.slice(left, right + 1).join(''))} is a permutation. Return true.`, right, 'true'); return frames; }
    save(right - left + 1 < target.length ? 'The window is still shorter than the pattern.' : 'The width is correct, but the counts differ. Continue.', right);
  }
  save(target.length ? 'No matching window. Return false.' : 'The empty pattern matches. Return true.', values.length - 1, target.length ? 'false' : 'true');
  return frames;
}

function minimumTrace({values, target}) {
  const frames = [], need = counts(target), have = new Map(); let left = 0, matches = 0, best = null;
  const answer = () => best ? values.slice(best[0], best[1] + 1).join('') : '';
  const save = (message, right) => frames.push({left, right, message, stats: [['Satisfied character requirements', `${matches} / ${need.size}`], ['Best substring', JSON.stringify(answer())], ['Best indices', best ? `${best[0]}…${best[1]}` : '—']], columns: ['Character', 'Required', 'Window'], rows: targetRows(need, have), caption: 'Only target characters contribute to coverage'});
  save('Build target counts. Start with no satisfied requirements.', -1);
  if (!target.length || target.length > values.length) { save('Target is empty or longer than the search string. Return an empty string.', -1); return frames; }
  for (let right = 0; right < values.length; right++) {
    const c = values[right];
    if (need.has(c)) { change(have, c, 1); if (have.get(c) === need.get(c)) matches++; }
    save(`Expand R to ${right}: ${JSON.stringify(c)}. ${matches === need.size ? 'All target counts are covered; start shrinking.' : 'Keep expanding until all target counts are covered.'}`, right);
    while (matches === need.size) {
      if (!best || right - left < best[1] - best[0]) { best = [left, right]; save(`Save a shorter valid window: ${JSON.stringify(answer())}.`, right); }
      else save('This window is valid but does not improve the best. Try removing its left character.', right);
      const removed = left, ch = values[left];
      if (need.has(ch)) { change(have, ch, -1); if (have.get(ch) < need.get(ch)) matches--; }
      left++;
      save(`Remove ${JSON.stringify(ch)} at ${removed}. ${matches === need.size ? 'Coverage remains complete; shrink again.' : 'Coverage broke; resume expanding.'}`, right);
    }
  }
  save(`Finished. Return ${JSON.stringify(answer())}${best ? ` from indices ${best[0]}…${best[1]}` : '; no covering window exists'}.`, values.length - 1);
  return frames;
}

function dequeTrace({values, k}) {
  const frames = [], queue = [], output = []; let left = 0;
  const save = (message, right) => frames.push({left, right, message, stats: [['Window size', k], ['Output', `[${output.join(', ')}]`]], caption: 'Deque from front to back; front gives the maximum', columns: ['Index', 'Value', 'State'], rows: queue.map((i, rank) => [i, values[i], i < left ? 'Expired — remove before output' : rank === 0 ? 'Front / maximum' : 'Candidate'])});
  save('Start with an empty deque of indices.', -1);
  for (let right = 0; right < values.length; right++) {
    while (queue.length && values[queue.at(-1)] < values[right]) {
      const removed = queue.pop(); save(`Remove index ${removed} from the back: newer value ${values[right]} is larger than ${values[removed]} and expires later.`, right);
    }
    queue.push(right); save(`Append index ${right}. Equal values stay in the deque.`, right);
    if (left > queue[0]) { const removed = queue.shift(); save(`Remove expired front index ${removed}; the window starts at ${left}.`, right); }
    if (right + 1 >= k) { output.push(values[queue[0]]); save(`Output ${values[queue[0]]} for window ${left}…${right}. Then advance L for the next iteration.`, right); left++; }
  }
  left = values.length - k;
  save(`Finished. Window maxima = [${output.join(', ')}].`, values.length - 1);
  return frames;
}

function heapTrace({values, k}) {
  // Priority order exposes exactly the live/stale entries and root decisions.
  // Rendering does not pretend this sorted list is Python's internal heap array.
  const frames = [], heap = [], output = []; let left = 0;
  const push = index => { heap.push(index); heap.sort((a, b) => values[b] - values[a] || b - a); };
  const save = (message, right) => frames.push({left, right, message, stats: [['Window size', k], ['Heap entries', heap.length], ['Output', `[${output.join(', ')}]`]], caption: 'Heap entries in descending (value, index) priority; first row is the root', columns: ['Index', 'Value', 'State'], rows: heap.map((i, rank) => [i, values[i], i < left ? 'Expired / lazy deletion' : rank === 0 ? 'Root / maximum' : 'In window'])});
  save('Build the heap from the first k values.', -1);
  for (let i = 0; i < k; i++) { push(i); save(`Push (${values[i]}, ${i}) into the initial heap.`, i); }
  for (let right = k; right < values.length; right++) {
    output.push(values[heap[0]]); save(`Output root value ${values[heap[0]]} for the completed window.`, right - 1);
    push(right); left++;
    save(`Push (${values[right]}, ${right}) and advance L to ${left}. Expired roots must be removed before the next output.`, right);
    while (heap.length && left > heap[0]) { const removed = heap.shift(); save(`Pop expired root index ${removed}. Expired entries below the root may remain.`, right); }
  }
  output.push(values[heap[0]]); save(`Output the final root. Finished: [${output.join(', ')}].`, values.length - 1);
  return frames;
}
