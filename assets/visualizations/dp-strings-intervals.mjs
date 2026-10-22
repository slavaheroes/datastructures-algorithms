import {mountSequencePlayback} from './sequence-playback.mjs';
import {grid, sequence, entries} from './study-views.mjs';

const save = (frames, message, state) => frames.push(Object.freeze({message, ...structuredClone(state)}));
const matrix = (rows, columns, value = 0) => Array.from({length: rows}, () => Array(columns).fill(value));
const prefixes = text => ['∅', ...[...text].map((character, i) => `${i + 1} · ${character}`)];
function text(value, label, maxLength = 12) {
  if (!new RegExp(`^[a-z]{0,${maxLength}}$`).test(value)) throw Error(`${label} needs at most ${maxLength} lowercase letters a–z; empty is allowed.`);
  return value;
}
function tableRender(frame, input) {
  if (!frame.dp) return sequence('Source string', [...input.s]) + sequence('Target string', [...input.t]);
  return grid(frame.caption, frame.dp, {rowLabels: prefixes(input.s), colLabels: prefixes(input.t), active: frame.active, dependencies: frame.dependencies, marked: frame.marked || []});
}

function distinctTrace({s, t}) {
  const frames = [];
  if (t.length > s.length) {
    save(frames, 'The target is longer than the source. The saved solution returns 0 before allocating a table.', {dp: null, stats: [['Source length', s.length], ['Target length', t.length], ['Result', 0]]});
    return frames;
  }
  const dp = matrix(s.length + 1, t.length + 1);
  let active = null, dependencies = [];
  const add = message => save(frames, message, {dp, active, dependencies, caption: 'dp[i][j] · ways to form t[:j] from s[:i]', stats: [['Source prefix length i', active?.[0] ?? '—'], ['Target prefix length j', active?.[1] ?? '—']]});
  add('Allocate a zero table. Rows are source prefixes; columns are target prefixes. ∅ denotes an empty prefix.');
  for (let i = 0; i <= s.length; i++) { active = [i, 0]; dp[i][0] = 1; add(`dp[${i}][0] = 1: there is exactly one way to select the empty target, by selecting no characters.`); }
  for (let i = 1; i <= s.length; i++) {
    for (let j = 1; j <= t.length; j++) {
      active = [i, j]; dependencies = [];
      if (i < j) { add(`Skip dp[${i}][${j}]: a source prefix of length ${i} cannot form a target of length ${j}. It stays 0.`); continue; }
      dependencies = [[i - 1, j]];
      if (s[i - 1] === t[j - 1]) {
        dependencies.push([i - 1, j - 1]); dp[i][j] = dp[i - 1][j] + dp[i - 1][j - 1];
        add(`Both characters are ${s[i - 1]}. Skip this source character (${dp[i - 1][j]} ways) or use it (${dp[i - 1][j - 1]} ways): dp[${i}][${j}] = ${dp[i][j]}.`);
      } else {
        dp[i][j] = dp[i - 1][j];
        add(`${s[i - 1]} ≠ ${t[j - 1]}. Skip the source character: copy dp[${i - 1}][${j}] = ${dp[i][j]}.`);
      }
    }
  }
  active = [s.length, t.length]; dependencies = [];
  add(`Return dp[${s.length}][${t.length}] = ${dp[s.length][t.length]}. Each counted subsequence uses a distinct set of source positions.`);
  return frames;
}

function editTrace({s, t}) {
  const frames = [], dp = matrix(s.length + 1, t.length + 1);
  let active = null, dependencies = [];
  const add = message => save(frames, message, {dp, active, dependencies, caption: 'dp[i][j] · edits from word1[:i] to word2[:j]', stats: [['Source prefix length i', active?.[0] ?? '—'], ['Target prefix length j', active?.[1] ?? '—']]});
  add('Allocate a zero table. Each cell compares prefixes, including ∅ for the empty prefix.');
  for (let i = 1; i <= s.length; i++) { active = [i, 0]; dp[i][0] = i; add(`dp[${i}][0] = ${i}: delete all ${i} source characters to obtain the empty target.`); }
  for (let j = 1; j <= t.length; j++) { active = [0, j]; dp[0][j] = j; add(`dp[0][${j}] = ${j}: insert all ${j} target characters into an empty source.`); }
  for (let i = 1; i <= s.length; i++) {
    for (let j = 1; j <= t.length; j++) {
      active = [i, j]; dependencies = [[i - 1, j - 1]];
      if (s[i - 1] === t[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1]; add(`${s[i - 1]} matches ${t[j - 1]}. Keep both characters at no cost; copy diagonal ${dp[i][j]}.`);
      } else {
        dependencies.push([i, j - 1], [i - 1, j]); dp[i][j] = 1 + Math.min(dp[i][j - 1], dp[i - 1][j], dp[i - 1][j - 1]);
        add(`${s[i - 1]} ≠ ${t[j - 1]}. Insert: ${dp[i][j - 1]} + 1; delete: ${dp[i - 1][j]} + 1; replace: ${dp[i - 1][j - 1]} + 1. Store minimum ${dp[i][j]}.`);
      }
    }
  }
  active = [s.length, t.length]; dependencies = [];
  add(`Return dp[${s.length}][${t.length}] = ${dp[s.length][t.length]}, the minimum number of edits.`);
  return frames;
}

function regexTrace({s, t}) {
  const frames = [], dp = matrix(s.length + 1, t.length + 1, false);
  let active = [0, 0], dependencies = [];
  dp[0][0] = true;
  const add = message => save(frames, message, {dp: dp.map(row => row.map(value => value ? 'True' : 'False')), active, dependencies, caption: 'dp[i][j] · does s[:i] fully match p[:j]?', stats: [['Text prefix length i', active?.[0] ?? '—'], ['Pattern prefix length j', active?.[1] ?? '—']]});
  add('dp[0][0] = True: the empty pattern matches the empty string. All other cells begin False.');
  for (let j = 1; j <= t.length; j++) {
    active = [0, j]; dependencies = [];
    if (t[j - 1] === '*') { dependencies = [[0, j - 2]]; dp[0][j] = dp[0][j - 2]; add(`Pattern prefix ${t.slice(0, j)} ends in *. Use zero copies of ${t[j - 2]}: copy dp[0][${j - 2}] = ${dp[0][j] ? 'True' : 'False'}.`); }
    else add(`A pattern ending with unstarred ${t[j - 1]} cannot match an empty string. dp[0][${j}] stays False.`);
  }
  for (let i = 1; i <= s.length; i++) {
    for (let j = 1; j <= t.length; j++) {
      active = [i, j]; dependencies = [];
      if (s[i - 1] === t[j - 1] || t[j - 1] === '.') {
        dependencies = [[i - 1, j - 1]]; dp[i][j] = dp[i - 1][j - 1];
        add(`${t[j - 1]} matches text character ${s[i - 1]}. Consume both; copy dp[${i - 1}][${j - 1}] = ${dp[i][j] ? 'True' : 'False'}.`);
      } else if (t[j - 1] === '*') {
        const matches = t[j - 2] === s[i - 1] || t[j - 2] === '.', reuse = matches && dp[i - 1][j];
        dependencies = [[i, j - 2]]; if (matches) dependencies.push([i - 1, j]);
        dp[i][j] = dp[i][j - 2] || reuse;
        add(`For ${t[j - 2]}*: zero copies reads dp[${i}][${j - 2}] (${dp[i][j - 2] ? 'True' : 'False'}). ${matches ? `The atom matches ${s[i - 1]}, so another copy reads dp[${i - 1}][${j}] (${reuse ? 'True' : 'False'}).` : `The atom does not match ${s[i - 1]}, so another copy is unavailable.`} Store ${dp[i][j] ? 'True' : 'False'}.`);
      } else add(`${t[j - 1]} does not match ${s[i - 1]}, and is neither . nor *. This cell stays False.`);
    }
  }
  active = [s.length, t.length]; dependencies = [];
  add(`Return ${dp[s.length][t.length] ? 'True' : 'False'} from the bottom-right cell. Matching must cover the entire string and pattern.`);
  return frames;
}

function balloonInput(fields) {
  if (fields.values.length > 200) throw Error('Keep the JSON array under 200 characters and use at most 5 balloons.');
  let values;
  try { values = JSON.parse(fields.values); } catch { throw Error('Enter a JSON array such as [3,1,5,8].'); }
  if (!Array.isArray(values) || values.length > 5 || values.some(value => !Number.isInteger(value) || value < 0 || value > 9)) throw Error('Use 0–5 balloon values, each an integer from 0 to 9. The small bound keeps the first recursive version readable.');
  return {values};
}
function balloonDP({values}) {
  const frames = [], nums = [1, ...values, 1], n = values.length, dp = matrix(n + 2, n + 2);
  let active = null, dependencies = [], left = null, right = null, k = null, best = 0, candidate = null;
  const add = message => save(frames, message, {dp, active, dependencies, nums, left, right, k, best, candidate, stats: [['Interval [left,right]', left === null ? '—' : `[${left},${right}]`], ['Last balloon k', k ?? '—'], ['Candidate coins', candidate ?? '—'], ['Best in this interval', best]]});
  add('Pad nums with virtual boundary balloons of value 1. dp[left][right] is the best total for bursting that closed interval; empty intervals are 0.');
  for (left = n; left >= 1; left--) {
    for (right = left; right <= n; right++) {
      best = 0; candidate = null; active = [left, right]; dependencies = []; k = null;
      add(`Compute interval [${left},${right}]. Try every contained balloon as the last one to burst.`);
      for (k = left; k <= right; k++) {
        dependencies = [[left, k - 1], [k + 1, right]];
        const gain = nums[left - 1] * nums[k] * nums[right + 1];
        candidate = dp[left][k - 1] + gain + dp[k + 1][right]; best = Math.max(best, candidate);
        add(`Burst ${k} last: dp[${left}][${k - 1}] (${dp[left][k - 1]}) + ${nums[left - 1]}×${nums[k]}×${nums[right + 1]} (${gain}) + dp[${k + 1}][${right}] (${dp[k + 1][right]}) = ${candidate}. Running best = ${best}.`);
      }
      k = null; dp[left][right] = best; dependencies = [];
      add(`All last-balloon choices are checked. Store dp[${left}][${right}] = ${best}.`);
    }
  }
  active = [1, n]; left = null; right = null; k = null; dependencies = []; best = dp[1][n]; candidate = null;
  add(`Return dp[1][${n}] = ${dp[1][n]}. The two boundary balloons are never burst.`);
  return frames;
}
function balloonRecursive({values}) {
  const frames = [], stack = [];
  let currentValues = [1, ...values, 1], currentIDs = ['left boundary', ...values.map((_, i) => `balloon ${i + 1}`), 'right boundary'], active = null, result = null;
  const add = message => save(frames, message, {nums: currentValues, ids: currentIDs, active, stack, recursive: true, stats: [['Call depth', stack.length], ['Result', result ?? 'pending']]});
  function visit(nums, ids) {
    const call = {values: nums.join(', '), choice: '—', best: 0}; stack.push(call); currentValues = nums; currentIDs = ids; active = null;
    add(nums.length === 2 ? 'Only the two virtual boundaries remain. Return 0 from this call.' : `Enter foo([${nums.join(', ')}]). Try each remaining real balloon as the next burst.`);
    if (nums.length === 2) { stack.pop(); return 0; }
    let best = 0;
    for (let i = 1; i < nums.length - 1; i++) {
      currentValues = nums; currentIDs = ids; active = i; call.choice = ids[i];
      const gain = nums[i - 1] * nums[i] * nums[i + 1];
      add(`Burst ${ids[i]} next: its current neighbors give ${nums[i - 1]}×${nums[i]}×${nums[i + 1]} = ${gain}. Recurse on a fresh list with it removed.`);
      const future = visit([...nums.slice(0, i), ...nums.slice(i + 1)], [...ids.slice(0, i), ...ids.slice(i + 1)]);
      currentValues = nums; currentIDs = ids; active = i; best = Math.max(best, gain + future); call.best = best;
      add(`The smaller call returns ${future}. This choice earns ${gain + future}; best for this call is ${best}.`);
    }
    active = null; add(`Every next-balloon choice is checked. Return ${best} to the caller.`); stack.pop(); return best;
  }
  add('First saved version: recursively enumerate burst orders. Each call uses the neighbors still present in its own copied list.');
  result = visit(currentValues, currentIDs); currentValues = [1, ...values, 1]; currentIDs = ['left boundary', ...values.map((_, i) => `balloon ${i + 1}`), 'right boundary']; active = null;
  add(`Return ${result}. The interval version avoids repeatedly evaluating equivalent remaining subproblems.`);
  return frames;
}
function balloonRender(frame) {
  if (frame.recursive) return sequence('Remaining balloons in the current call', frame.nums, {active: frame.active, notes: frame.ids}) + entries('Recursion stack · outermost call first', ['Remaining values (including boundaries)', 'Next burst choice', 'Best total'], frame.stack.map(call => [call.values, call.choice, call.best]));
  return sequence('Padded balloons · indices match DP boundaries', frame.nums, {active: frame.k, marked: frame.left === null ? [] : [frame.left - 1, frame.right + 1], notes: frame.nums.map((_, i) => i === 0 || i === frame.nums.length - 1 ? 'virtual boundary' : 'real balloon')}) + grid('dp[left][right] · maximum coins inside the closed interval', frame.dp, {active: frame.active, dependencies: frame.dependencies});
}

const tableLegend = 'Orange: current cell. Underlined cells: dependencies read by this step. Prefix labels show prefix length and final character; ∅ is the empty prefix. Unvisited cells retain their initial value.';
export function mountDistinctSubsequences(root) {
  return mountSequencePlayback(root, {id: 'distinct-subsequences', description: 'Build the saved prefix-count table. Matching characters create two disjoint choices: use or skip the current source position.', inputs: [{key: 's', label: 'Source s', value: 'rabbbit'}, {key: 't', label: 'Target t', value: 'rabbit'}], hint: 'Each string may contain 0–12 lowercase letters a–z. Empty targets have one subsequence; targets longer than the source return 0 immediately.', legend: tableLegend, parse: fields => ({s: text(fields.s, 'Source s'), t: text(fields.t, 'Target t')}), modes: [{label: 'Source: prefix-count table', trace: distinctTrace}], render: tableRender});
}
export function mountEditDistance(root) {
  return mountSequencePlayback(root, {id: 'edit-distance', description: 'Compare word prefixes and inspect insertion, deletion, and replacement dependencies in the saved DP table.', inputs: [{key: 's', label: 'word1', value: 'horse'}, {key: 't', label: 'word2', value: 'ros'}], hint: 'Each word may contain 0–12 lowercase letters a–z. Empty words are allowed.', legend: tableLegend, parse: fields => ({s: text(fields.s, 'word1'), t: text(fields.t, 'word2')}), modes: [{label: 'Source: prefix edit-distance table', trace: editTrace}], render: tableRender});
}
export function mountBurstBalloons(root) {
  return mountSequencePlayback(root, {id: 'burst-balloons', description: 'Compare the first saved recursive enumeration of the next burst with the final interval DP, which chooses the last burst.', inputs: [{key: 'values', label: 'Balloon values · JSON array', value: '[3,1,5,8]'}], hint: 'Use 0–5 integers from 0 to 9, including duplicate values. The bound keeps the factorial recursive version small enough for playback. Boundary 1s are virtual.', legend: 'Interval mode: orange balloon is chosen last; green balloons are its fixed outside neighbors. Orange table cell is the interval being computed, and underlined cells are its two subintervals. Recursive mode: orange is the next burst in the current call; labels preserve original balloon identities.', parse: balloonInput, modes: [{label: 'Final source version: interval DP', trace: balloonDP}, {label: 'First source version: recursive burst orders', trace: balloonRecursive}], render: balloonRender});
}
export function mountRegularExpressionMatching(root) {
  return mountSequencePlayback(root, {id: 'regular-expression-matching', description: 'Follow full-string matching with literal letters, . for one character, and * for zero or more copies of its preceding atom.', inputs: [{key: 's', label: 'Text s', value: 'aab'}, {key: 't', label: 'Pattern p', value: 'c*a*b'}], hint: 'Text: 0–12 lowercase letters a–z. Pattern: at most 12 characters using a–z, . and *. Every * must follow a letter or dot; consecutive stars are invalid. Empty inputs are allowed.', legend: tableLegend, parse: fields => { const s = text(fields.s, 'Text s'); if (fields.t.length > 12 || !/^(?:[a-z.]\*?)*$/.test(fields.t)) throw Error('Pattern needs at most 12 characters: letters a–z or ., each optionally followed by one *.'); return {s, t: fields.t}; }, modes: [{label: 'Source: prefix matching table', trace: regexTrace}], render: tableRender});
}
