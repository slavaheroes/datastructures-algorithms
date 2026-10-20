import {escape, mountSequencePlayback} from './sequence-playback.mjs';

function save(frames, message, state) {
  frames.push(Object.freeze({message, ...JSON.parse(JSON.stringify(state))}));
}
function arrayInput(text, label, maxLength = 24) {
  if (text.length > 1000) throw Error(`${label} is too long. Use at most ${maxLength} values.`);
  let values;
  try { values = JSON.parse(text); } catch { throw Error(`${label} must be a JSON array such as [2,3,1,1,4].`); }
  if (!Array.isArray(values) || !values.length || values.length > maxLength || values.some(value => !Number.isInteger(value) || value < 0 || value > 12)) throw Error(`${label} needs 1–${maxLength} integers from 0 to 12.`);
  return values;
}
function jumpInput(fields) {
  const values = arrayInput(fields.values, 'Jump lengths');
  let reach = 0;
  for (let i = 0; i < values.length && i <= reach; i++) reach = Math.max(reach, i + values[i]);
  if (reach < values.length - 1) throw Error('The saved Jump Game II solutions assume the last index is reachable. Edit the jumps to make a path to it; the reference loop has no unreachable-case exit.');
  return {values};
}
function jumpFrontier(input) {
  const frames = [], values = input.values;
  let left = 0, right = 0, farthest = 0, jumps = 0, current = null, reach = null;
  const add = message => save(frames, message, {left, right, current, reach, farthest, completed: [], stats: [['Jumps', jumps], ['Frontier l…r', `${left}…${right}`], ['Farthest', farthest]]});
  add('Start with frontier [0,0]: index 0 is reachable with zero jumps.');
  while (right < values.length - 1) {
    farthest = 0; add(`Scan every index in [${left},${right}] to find the next frontier’s farthest end.`);
    for (let i = left; i <= right; i++) { current = i; reach = i + values[i]; farthest = Math.max(farthest, reach); add(`Index ${i} reaches ${reach}. farthest = max(previous farthest, ${reach}) = ${farthest}.`); }
    left = right + 1; right = farthest; jumps++; current = null; reach = null;
    add(`One more jump reaches the whole new frontier [${left},${right}]. Set jumps = ${jumps}.`);
  }
  add(`The frontier includes the final index ${values.length - 1}. Return ${jumps}, the minimum number of jumps.`);
  return frames;
}
function jumpDictionary(input) {
  const frames = [], values = input.values, visited = {0: 0};
  let current = null, reach = null;
  const add = message => save(frames, message, {current, reach, counts: visited, stats: [['Stored final distance', visited[values.length - 1] ?? 'not recorded'], ['Stored indices', Object.keys(visited).length]]});
  add('Initialize visited = {0: 0}. This first stored version records farthest landing positions; it can overcount intermediate distances.');
  for (let i = 0; i < values.length; i++) {
    current = i; reach = null;
    if (!Object.hasOwn(visited, i)) { visited[i] = visited[i - 1] + 1; add(`Index ${i} is missing. Assign visited[${i}] = visited[${i - 1}] + 1 = ${visited[i]}. This fallback can overestimate a minimum distance.`); }
    reach = Math.min(i + values[i], values.length - 1);
    visited[reach] = Object.hasOwn(visited, reach) ? Math.min(visited[i] + 1, visited[reach]) : visited[i] + 1;
    add(`Farthest capped landing = ${reach}. Update its stored count to ${visited[reach]} using visited[${i}] + 1.`);
  }
  current = null; reach = null; add(`The first version returns ${visited[values.length - 1]}. Compare with the reference frontier mode: for [4,0,4,0,0,0,0], this version returns 3 although 0 → 2 → 6 uses 2 jumps.`);
  return frames;
}

function gasTrace(input) {
  const frames = [], rejected = [], tankHistory = [];
  let tank = 0, start = -1, current = null, sumGas = 0, sumCost = 0, result = null;
  const add = message => save(frames, message, {current, start, tank, tankHistory, rejected, result, stats: [['Candidate start', start], ['Tank', tank], ['Gas sum', sumGas], ['Cost sum', sumCost], ['Total surplus so far', sumGas - sumCost]]});
  add('Start tank and both sums at 0; start_pos = −1. Visit each station once in input order.');
  for (let i = 0; i < input.gas.length; i++) {
    current = i;
    if (tank === 0) { start = i; add(`tank is 0 before station ${i}, so this source sets start_pos = ${i}. This includes exact-zero ties.`); }
    tank += input.gas[i] - input.cost[i]; tankHistory[i] = tank;
    add(`Station ${i}: add gas − cost = ${input.gas[i]} − ${input.cost[i]} = ${input.gas[i] - input.cost[i]}. The tank becomes ${tank}.`);
    if (tank < 0) { for (let index = start; index <= i; index++) if (!rejected.includes(index)) rejected.push(index); tank = 0; add(`The candidate cannot pass station ${i}. Reset tank to 0; the next iteration chooses another start.`); }
    sumGas += input.gas[i]; sumCost += input.cost[i];
    add(`Add station ${i} to the global totals: gas ${sumGas}, cost ${sumCost}.`);
  }
  current = null; result = sumGas < sumCost ? -1 : start;
  add(result === -1 ? 'Total gas is less than total cost. Return −1: no station can complete the circuit.' : `Total gas covers total cost. Return candidate ${result}; the discarded deficits cannot be repaired by starting inside their failed segment.`);
  return frames;
}

function partitionTrace(input, reference = false) {
  const values = input.values, frames = [], letters = {}, partitions = [];
  let current = null, left = null, right = null, size = 0;
  const add = message => save(frames, message, {current, left, right, partitions, letters, reference, stats: [['Partition lengths', partitions.map(pair => pair[1] - pair[0] + 1).join(', ') || '[]'], ['Current start', left ?? '—'], ['Required end', right ?? '—']]});
  add(reference ? 'First pass: map every letter to its last index.' : 'First pass: map every letter to its first and last indices.');
  for (let i = 0; i < values.length; i++) {
    current = i;
    letters[values[i]] = reference ? [i] : [letters[values[i]]?.[0] ?? i, i];
    add(`Record ${values[i]}: ${reference ? `last = ${i}` : `first = ${letters[values[i]][0]}, last = ${i}`}.`);
  }
  if (reference) {
    left = 0; right = 0;
    for (let i = 0; i < values.length; i++) {
      current = i; right = Math.max(right, letters[values[i]][0]); size++;
      add(`Read ${values[i]} at ${i}. Extend end to ${right}; current size = ${size}.`);
      if (right === i) { partitions.push([i - size + 1, i]); size = 0; add(`Every letter in this range ends by ${i}. Append length ${i - left + 1} and close the partition.`); left = i + 1; }
    }
  } else {
    let i = 0;
    while (i < values.length) {
      [left, right] = letters[values[i]]; let j = left;
      add(`Begin with ${values[i]}’s first/last interval [${left},${right}]. Scan the growing range.`);
      while (j <= right) { current = j; right = Math.max(right, letters[values[j]][1]); add(`At ${j}, letter ${values[j]} last appears at ${letters[values[j]][1]}; the required end is now ${right}.`); j++; }
      partitions.push([left, right]); add(`The range is closed. Append length ${right - left + 1} and continue at ${right + 1}.`); i = right + 1;
    }
  }
  current = null; left = null; right = null; add(`Return partition lengths ${JSON.stringify(partitions.map(([a, b]) => b - a + 1))}. No letter crosses a marked boundary.`);
  return frames;
}

function parenthesesStacks(input) {
  const frames = [], stack = [], stars = [], matches = [];
  let current = null, result = null;
  const add = message => save(frames, message, {current, stack, stars, matches, result, stats: [['Unmatched ( indices', stack.join(', ') || '[]'], ['Available * indices', stars.join(', ') || '[]'], ['Result', result ?? 'undecided']]});
  add('Track indices of unmatched opens and stars in separate stacks.');
  for (let i = 0; i < input.values.length; i++) {
    current = i; const ch = input.values[i];
    if (ch === '*') { stars.push(i); add(`Push star index ${i}; it can become (, ), or empty.`); }
    else if (ch === '(') { stack.push(i); add(`Push opening parenthesis index ${i}.`); }
    else if (stack.length) { const open = stack.pop(); matches.push([open, i]); add(`Match ) at ${i} with ( at ${open}. Prefer a real open before using a star.`); }
    else if (stars.length) { const star = stars.pop(); matches.push([star, i]); add(`Use star ${star} as ( to match ) at ${i}.`); }
    else { result = false; add(`No earlier open or star can match ) at ${i}. Return False.`); return frames; }
  }
  current = null; add('The scan is complete. Match remaining opens with stars to their right, using latest indices first.');
  while (stack.length) {
    if (!stars.length) { result = false; add('An opening parenthesis remains, but no star is available. Return False.'); return frames; }
    const open = stack.pop(), star = stars.pop(); current = star;
    if (open > star) { result = false; add(`Open ${open} comes after star ${star}. This star cannot act as its closing parenthesis. Return False.`); return frames; }
    matches.push([open, star]); add(`Use star ${star} as ) for open ${open}. Indices have the required left-to-right order.`);
  }
  current = null; result = true; add('Every open has a match. Any unused stars can be empty. Return True.'); return frames;
}
function parenthesesRange(input) {
  const frames = []; let upper = 0, lower = 0, current = null, result = null;
  const add = message => save(frames, message, {current, upper, lower, result, stats: [['count2 · minimum opens', lower], ['count1 · maximum opens', upper], ['Result', result ?? 'undecided']]});
  add('Initialize count1 = count2 = 0: the feasible unmatched-open range starts at [0,0].');
  for (let i = 0; i < input.values.length; i++) {
    current = i; const ch = input.values[i];
    if (ch === '(') { upper++; lower++; }
    else if (ch === ')') { upper--; lower--; }
    else { upper++; lower--; }
    lower = Math.max(0, lower);
    if (upper < 0) { result = false; add(`Read ${ch} at ${i}. count1 falls below 0, so even treating every star as ( cannot match this prefix. Return False.`); return frames; }
    add(`Read ${ch} at ${i}. Feasible unmatched opens are ${lower} through ${upper}; clamp count2 at 0 because an open count cannot be negative.`);
  }
  current = null; result = lower === 0;
  add(result ? 'count2 is 0, so zero unmatched opens is feasible. Return True.' : `count2 is ${lower}; every interpretation leaves unmatched opens. Return False.`); return frames;
}

function cells(values, frame, notes = () => '') {
  const boundaries = new Set(frame.partitions?.map(pair => pair[1]) || []), matched = new Set(frame.matches?.flat() || []);
  return `<div class="svg-scroll"><ol class="sequence-cells ig-cells" aria-label="Input with zero-based indices and algorithm state">${values.map((value, i) => `<li ${i === frame.current ? 'data-follow' : ''} class="${i === frame.current ? 'ig-current' : ''} ${frame.left !== null && i >= frame.left && i <= frame.right ? 'ig-frontier' : ''} ${frame.rejected?.includes(i) ? 'ig-rejected' : ''} ${boundaries.has(i) ? 'ig-partition' : ''} ${matched.has(i) ? 'ig-matched' : ''} ${frame.stack?.includes(i) ? 'ig-open' : ''} ${frame.stars?.includes(i) ? 'ig-star' : ''}"><span class="sequence-index">${i}</span><strong>${escape(value)}</strong><span class="ig-cell-note">${escape(notes(i)) || '·'}</span>${i === frame.start ? '<span class="ig-cell-note">start</span>' : ''}${boundaries.has(i) ? '<span class="ig-cell-note">end part</span>' : ''}</li>`).join('')}</ol>${values.length ? '' : '<p class="hint">Empty string</p>'}</div>`;
}
function jumpRender(frame, input) {
  const reach = frame.current !== null && frame.reach !== null ? `<p class="sequence-detail">Index ${frame.current} → ${frame.reach}${frame.reach >= input.values.length ? ' (past the final index)' : ''}. Jump length ${input.values[frame.current]}.</p>` : '';
  return cells(input.values, frame, i => frame.counts ? `stored: ${frame.counts[i] ?? '—'}` : frame.left !== null && i >= frame.left && i <= frame.right ? 'frontier' : '') + reach;
}
function gasRender(frame, input) {
  const width = 720, height = 440, cx = 360, cy = 220, radius = 134;
  const points = input.gas.map((_, i) => ({x: cx + radius * Math.cos(i * 2 * Math.PI / input.gas.length - Math.PI / 2), y: cy + radius * Math.sin(i * 2 * Math.PI / input.gas.length - Math.PI / 2)}));
  const links = points.length > 1 ? points.map((point, i) => { const next = points[(i + 1) % points.length], distance = Math.hypot(next.x - point.x, next.y - point.y), dx = (next.x - point.x) / distance, dy = (next.y - point.y) / distance; return `<line x1="${point.x + dx * 24}" y1="${point.y + dy * 24}" x2="${next.x - dx * 26}" y2="${next.y - dy * 26}" stroke="var(--muted)" stroke-width="2" marker-end="url(#gas-route-arrow)"/>`; }).join('') : '';
  const nodes = points.map((point, i) => { const angle = i * 2 * Math.PI / input.gas.length - Math.PI / 2; return `<g transform="translate(${point.x} ${point.y})"><circle r="21" fill="${i === frame.current ? 'var(--orange)' : 'var(--accent-soft)'}" stroke="${i === frame.start ? 'var(--green)' : 'var(--muted)'}" stroke-width="${i === frame.start ? 4 : 1}"/><text y="4">${i}</text><text x="${Math.cos(angle) * 48}" y="${Math.sin(angle) * 48 + 4}">${input.gas[i]}−${input.cost[i]}=${input.gas[i] - input.cost[i]}</text></g>`; }).join('');
  return `<section class="ig-panel"><h4>Circuit · travel in increasing station order, then wrap to 0</h4><div class="svg-scroll"><svg class="ig-balance-svg" style="min-width:720px" viewBox="0 0 ${width} ${height}" role="img" aria-label="${escape(input.gas.map((gas, i) => `Station ${i}: gas ${gas}, cost to next ${input.cost[i]}`).join('; '))}"><defs><marker id="gas-route-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="var(--muted)"/></marker></defs>${links}${nodes}<text x="${cx}" y="${cy - 7}">tank = ${frame.tank}</text><text x="${cx}" y="${cy + 14}">start = ${frame.start}</text></svg></div></section>${cells(input.gas.map((gas, i) => `${gas}−${input.cost[i]}`), frame, i => frame.tankHistory[i] !== undefined ? `tank: ${frame.tankHistory[i]}` : 'unvisited')}`;
}
function partitionRender(frame, input) {
  return cells(input.values, frame, i => `last: ${frame.letters[input.values[i]]?.at(-1) ?? '—'}`) + `<section class="ig-panel"><h4>Letter ${frame.reference ? 'last positions' : 'first/last positions'}</h4><ol class="ig-chips">${Object.entries(frame.letters).map(([letter, indices]) => `<li><strong>${escape(letter)}</strong><span>${indices.join('…')}</span></li>`).join('')}</ol><p>Partitions: ${escape(JSON.stringify(frame.partitions.map(([a, b]) => b - a + 1)))}</p></section>`;
}
function parenthesesRender(frame, input) {
  let state;
  if (frame.upper !== undefined) {
    const minimum = Math.min(-1, frame.upper), maximum = Math.max(2, input.values.length), x = value => 44 + (value - minimum) / (maximum - minimum) * 600;
    const ticks = Array.from({length: maximum - minimum + 1}, (_, i) => minimum + i).map(value => `<line class="ig-balance-tick" x1="${x(value)}" y1="50" x2="${x(value)}" y2="60"/><text x="${x(value)}" y="78">${value}</text>`).join('');
    state = `<section class="ig-panel"><h4>Feasible unmatched-open count · count2 to count1</h4><div class="svg-scroll"><svg class="ig-balance-svg" style="min-width:690px" viewBox="0 0 690 94" role="img" aria-label="${frame.upper < 0 ? 'Empty feasible range: maximum open count is negative' : `Feasible open count from ${frame.lower} to ${frame.upper}`}"><line class="ig-balance-axis" x1="44" y1="54" x2="644" y2="54"/>${frame.upper >= 0 ? `<rect class="ig-balance-band" x="${x(frame.lower)}" y="25" width="${Math.max(2, x(frame.upper) - x(frame.lower))}" height="27"/>` : `<circle class="ig-balance-point" cx="${x(frame.upper)}" cy="40" r="6"/>`}${ticks}</svg></div></section>`;
  } else state = `<section class="ig-panel"><h4>Stacks · oldest to newest</h4><p>Unmatched (: ${escape(JSON.stringify(frame.stack))}</p><p>Available *: ${escape(JSON.stringify(frame.stars))}</p><p>Matched index pairs: ${escape(JSON.stringify(frame.matches))}</p></section>`;
  return cells(input.values, frame, i => frame.stack?.includes(i) ? 'open stack' : frame.stars?.includes(i) ? 'star stack' : '') + state;
}

export function mountJumpGameII(root) {
  return mountSequencePlayback(root, {id: 'jump-game-ii', description: 'Compare the source’s stored-count version with its greedy reference, which expands one reachable frontier per jump.', inputs: [{key: 'values', label: 'Jump lengths · JSON array', value: '[2,3,1,1,4]'}], hint: '1–24 integers from 0 to 12. The final index must be reachable, as required by the source. [4,0,4,0,0,0,0] shows why the first version can overcount.', legend: 'Orange: current index. Green range: current greedy frontier. Stored counts belong to the first version and are not guaranteed minimum distances.', parse: jumpInput, modes: [{label: 'Reference: greedy frontiers', trace: jumpFrontier}, {label: 'First stored version: visited dictionary (can overcount)', trace: jumpDictionary}], render: jumpRender});
}
export function mountGasStation(root) {
  return mountSequencePlayback(root, {id: 'gas-station', description: 'Follow tank resets and global feasibility in the saved source. At station i, collect gas[i], then pay cost[i] to reach the next station.', inputs: [{key: 'gas', label: 'Gas · JSON array', value: '[1,2,3,4,5]'}, {key: 'cost', label: 'Cost to next station · JSON array', value: '[3,4,5,1,2]'}], hint: 'Equal lengths of 1–16 integers from 0 to 12. Station numbers are zero based; travel wraps from the last station to 0.', legend: 'Orange circle: current station. Thick green circle: candidate start. Cell values are gas−cost; tank records the value just after that station, before any reset. Orange bottom border: discarded failed segment.', parse: fields => { const gas = arrayInput(fields.gas, 'Gas', 16), cost = arrayInput(fields.cost, 'Cost', 16); if (gas.length !== cost.length) throw Error('Gas and Cost need the same number of stations.'); return {gas, cost}; }, modes: [{label: 'Single pass with tank resets', trace: gasTrace}], render: gasRender});
}
export function mountPartitionLabels(root) {
  return mountSequencePlayback(root, {id: 'partition-labels', description: 'A partition can close only after the last occurrence of every letter inside it. Compare the two stored ways to extend that endpoint.', inputs: [{key: 'text', label: 'Lowercase string', value: 'ababcbacadefegdehijhklij'}], hint: 'Use at most 24 lowercase letters a–z. The empty string returns [].', legend: 'Orange: current character. Green range: partition being extended. Thick right border and “end part”: committed partition boundary. Cell notes show each letter’s last index.', parse: fields => { if (!/^[a-z]{0,24}$/.test(fields.text)) throw Error('Use at most 24 lowercase letters a–z.'); return {values: [...fields.text]}; }, modes: [{label: 'First/last intervals with an expanding scan', trace: input => partitionTrace(input)}, {label: 'Reference: last positions and one scan', trace: input => partitionTrace(input, true)}], render: partitionRender});
}
export function mountValidParenthesisString(root) {
  return mountSequencePlayback(root, {id: 'valid-parenthesis-string', description: 'A star can be (, ), or empty. Compare index stacks with the reference’s feasible open-count range.', inputs: [{key: 'text', label: 'Parentheses and stars', value: '(*))'}], hint: 'Use at most 24 characters: (, ), and *. The empty string is valid.', legend: 'Orange: current character. Green bottom: unmatched (. Dashed orange bottom: available *. Green fill: matched indices. Reference mode displays the complete range of feasible unmatched-open counts.', parse: fields => { if (!/^[()*]{0,24}$/.test(fields.text)) throw Error('Use at most 24 characters containing only (, ), and *.'); return {values: [...fields.text]}; }, modes: [{label: 'Index stacks', trace: parenthesesStacks}, {label: 'Reference: minimum/maximum open count', trace: parenthesesRange}], render: parenthesesRender});
}
