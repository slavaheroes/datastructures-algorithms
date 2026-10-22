import {integer, mountSequencePlayback} from './sequence-playback.mjs';
import {grid, sequence, entries} from './study-views.mjs';

function save(frames, message, state) {
  frames.push({message, ...structuredClone(state)});
}
function array(text, label, {min = 0, max = 99, length = 16, nonempty = true, unique = false} = {}) {
  if (text.length > 1000) throw Error(`${label} is too long. Use at most ${length} values.`);
  let values;
  try { values = JSON.parse(text); } catch { throw Error(`${label} must be a JSON array.`); }
  if (!Array.isArray(values) || values.length > length || (nonempty && !values.length) || values.some(value => !Number.isInteger(value) || value < min || value > max)) throw Error(`${label} needs ${nonempty ? '1' : '0'}–${length} integers from ${min} to ${max}.`);
  if (unique && new Set(values).size !== values.length) throw Error(`${label} must contain distinct denominations.`);
  return values;
}
const shown = value => value === Infinity ? '∞' : value;
const indices = values => values.map((_, i) => i);
const cellMarks = indices => indices.map(i => [0, i]);
const legend = 'Orange outline: current state. Underline: dependency read by this step. Green fill: completed state. Input indices and table labels are zero based.';

function decodeTrace({text}) {
  const n = text.length, dp = Array(n + 1).fill(0), frames = [], done = [n];
  dp[n] = 1;
  let current = null, dependencies = [], result = '—';
  const add = message => save(frames, message, {dp, current, dependencies, done, stats: [['Ways for the whole string', result]]});
  add('dp[i] counts decodings of the suffix starting at i. Set dp[n] = 1: reaching the empty suffix completes one decoding. Other cells start at 0.');
  for (let i = n - 1; i >= 0; i--) {
    current = i; dependencies = [];
    if (text[i] === '0') {
      dp[i] = 0;
      add(`s[${i}] is 0. No letter starts with 0, so dp[${i}] = 0.`);
    } else {
      dependencies = [i + 1]; dp[i] = dp[i + 1];
      add(`Decode ${text[i]} as one letter. Copy dp[${i + 1}] = ${dp[i]} ways for the remaining suffix.`);
      if (i + 1 < n) {
        const pair = text.slice(i, i + 2);
        if (Number(pair) <= 26) {
          dependencies = [i + 1, i + 2]; dp[i] = dp[i + 1] + dp[i + 2];
          add(`${pair} is also a letter (10–26). Add the two-digit branch: dp[${i}] = ${dp[i + 1]} + ${dp[i + 2]} = ${dp[i]}.`);
        } else { dependencies = [i + 1]; add(`${pair} exceeds 26. Keep only the one-digit branch, so dp[${i}] remains ${dp[i]}.`); }
      }
    }
    done.push(i);
  }
  current = null; dependencies = []; result = dp[0];
  add(`Return dp[0] = ${result}. Every valid decoding chooses a one-digit or valid two-digit prefix at each suffix.`);
  return frames;
}
function decodeRender(frame, {text}) {
  return sequence('Digits · ∅ marks the empty suffix', [...text, '∅'], {active: frame.current, marked: frame.dependencies, notes: [...text].map((_, i) => `suffix ${i}`).concat('base case')}) + grid('dp[i] · ways to decode suffix s[i:]', [frame.dp], {rowLabels: ['ways'], colLabels: Array.from({length: text.length + 1}, (_, i) => i), active: frame.current === null ? null : [0, frame.current], dependencies: cellMarks(frame.dependencies), marked: cellMarks(frame.done)});
}

function coinTrace({coins, amount}) {
  const dp = Array(amount + 1).fill(0), frames = [], done = [0];
  let current = null, dependency = null, coinIndex = null, best = null, candidate = null, result = '—';
  const add = message => save(frames, message, {dp: dp.map(shown), done, current, dependency, coinIndex, stats: [['Best candidate', best === null ? '—' : shown(best)], ['Candidate 1 + dp[i − coin]', candidate === null ? '—' : shown(candidate)], ['Result', result]]});
  add('Initialize dp to zeros. Only dp[0] is a completed base case: amount 0 needs 0 coins. Fill larger amounts in increasing order.');
  for (let i = 1; i <= amount; i++) {
    current = i; best = Infinity; dependency = null; candidate = null; coinIndex = null;
    add(`Find the fewest coins for amount ${i}. Start best at ∞; the initial 0 in this cell is not a computed answer.`);
    for (let j = 0; j < coins.length; j++) {
      const coin = coins[j]; coinIndex = j; dependency = null; candidate = null;
      if (i - coin >= 0) {
        dependency = i - coin; candidate = 1 + dp[dependency]; best = Math.min(best, candidate);
        add(`Try coin ${coin}: 1 + dp[${dependency}] = ${shown(candidate)}. best becomes ${shown(best)}.`);
      } else add(`Coin ${coin} exceeds amount ${i}. Skip it; no nonnegative remainder exists.`);
    }
    dp[i] = best; done.push(i); dependency = null; coinIndex = null;
    add(`Store dp[${i}] = ${shown(best)}.${best === Infinity ? ' No denomination leads to a reachable remainder.' : ''}`);
  }
  current = null; dependency = null; coinIndex = null; candidate = null; result = dp[amount] === Infinity ? -1 : dp[amount];
  add(`Return ${result}${result === -1 ? ': the final cell is ∞, so the amount cannot be formed' : `: amount ${amount} needs ${result} coins`}.`);
  return frames;
}
function coinRender(frame, {coins, amount}) {
  return sequence('Available coin denominations · each may be reused', coins, {active: frame.coinIndex}) + grid('dp[a] · minimum coins to form amount a', [frame.dp], {rowLabels: ['coins'], colLabels: Array.from({length: amount + 1}, (_, i) => i), active: frame.current === null ? null : [0, frame.current], dependencies: frame.dependency === null ? [] : [[0, frame.dependency]], marked: cellMarks(frame.done)});
}

function lisTrace({values}) {
  const dp = Array(values.length).fill(1), frames = [], done = [];
  let current = null, compared = null, dependencies = [], result = '—';
  const add = message => save(frames, message, {dp, done, current, compared, dependencies, stats: [['Best length found', Math.max(...dp)], ['Result', result]]});
  add('dp[i] is the longest strictly increasing subsequence that starts at i. Initialize every length to 1: each value can stand alone.');
  for (let i = values.length - 1; i >= 0; i--) {
    current = i;
    for (let j = i; j < values.length; j++) {
      compared = j; dependencies = [];
      if (values[i] < values[j]) {
        dependencies = [j]; const before = dp[i]; dp[i] = Math.max(1 + dp[j], dp[i]);
        add(`nums[${i}] = ${values[i]} < nums[${j}] = ${values[j]}. Extend through j: max(${before}, 1 + ${dp[j]}) = ${dp[i]}.`);
      } else add(`Compare i = ${i} and j = ${j}: ${values[i]} is not smaller than ${values[j]}. This pair cannot extend a strictly increasing subsequence.`);
    }
    compared = null; dependencies = []; done.push(i); add(`The suffix has been checked. dp[${i}] = ${dp[i]} is complete.`);
  }
  current = null; result = Math.max(...dp); add(`Return max(dp) = ${result}. The best subsequence may start at any index.`);
  return frames;
}
function lisRender(frame, {values}) {
  return sequence('Input · compare i with later j', values, {active: frame.current, marked: frame.compared === null ? [] : [frame.compared], notes: values.map((_, i) => i === frame.current && i === frame.compared ? 'i = j' : i === frame.current ? 'i' : i === frame.compared ? 'j' : '')}) + grid('dp[i] · longest increasing subsequence starting at i', [frame.dp], {rowLabels: ['length'], colLabels: indices(values), active: frame.current === null ? null : [0, frame.current], dependencies: cellMarks(frame.dependencies), marked: cellMarks(frame.done)});
}

function stockTrace({prices}) {
  const n = prices.length, dp = [Array(n + 2).fill(0), Array(n + 2).fill(0)], frames = [], done = [[0, n], [0, n + 1], [1, n], [1, n + 1]];
  let current = null, active = null, dependencies = [], choiceRows = [], result = '—';
  const add = message => save(frames, message, {dp, done, current, active, dependencies, choiceRows, stats: [['Profit from day 0, can buy', result]]});
  add('dp[0][i] is future profit when allowed to buy; dp[1][i] is future cash flow while holding a share. Days n and n+1 have no transactions and value 0.');
  for (let i = n - 1; i >= 0; i--) {
    current = i; active = [0, i]; dependencies = [[0, i + 1], [1, i + 1]];
    const skipBuy = dp[0][i + 1], buy = dp[1][i + 1] - prices[i];
    dp[0][i] = Math.max(skipBuy, buy); done.push([0, i]);
    choiceRows = [['Skip', `dp[0][${i + 1}]`, skipBuy], ['Buy', `dp[1][${i + 1}] − ${prices[i]}`, buy]];
    add(`Day ${i}, can buy: max(skip ${skipBuy}, buy ${buy}) = ${dp[0][i]}. Buying pays today’s price and moves to holding tomorrow.`);
    active = [1, i]; dependencies = [[1, i + 1], [0, i + 2]];
    const skipSell = dp[1][i + 1], sell = dp[0][i + 2] + prices[i];
    dp[1][i] = Math.max(skipSell, sell); done.push([1, i]);
    choiceRows = [['Hold', `dp[1][${i + 1}]`, skipSell], ['Sell', `${prices[i]} + dp[0][${i + 2}]`, sell]];
    add(`Day ${i}, holding: max(hold ${skipSell}, sell ${sell}) = ${dp[1][i]}. Selling skips day ${i + 1} for cooldown; buying is allowed again on day ${i + 2}.`);
  }
  current = null; active = null; dependencies = []; choiceRows = []; result = dp[0][0];
  add(`Return dp[0][0] = ${result}: begin on day 0 with no share and permission to buy.`);
  return frames;
}
function stockRender(frame, {prices}) {
  return sequence('Daily prices', prices, {active: frame.current}) + grid('Future profit by day and ownership state', frame.dp, {rowLabels: ['0 · can buy', '1 · holding'], colLabels: Array.from({length: prices.length + 2}, (_, i) => i < prices.length ? `day ${i}` : `${i} · base`), active: frame.active, dependencies: frame.dependencies, marked: frame.done}) + entries('Current alternatives', ['Action', 'Expression', 'Value'], frame.choiceRows);
}

function coin2Trace({coins, amount}) {
  const dp = Array.from({length: coins.length + 1}, () => Array(amount + 1).fill(0)), frames = [], done = Array.from({length: amount}, (_, i) => [0, i + 1]);
  let active = null, dependencies = [], coinIndex = null, result = '—';
  const add = message => save(frames, message, {dp, done, active, dependencies, coinIndex, stats: [['Combinations', result]]});
  add('dp[i][a] counts combinations forming amount a with the first i coin types. Start all cells at 0; row 0 has no coin types.');
  for (let i = 0; i <= coins.length; i++) {
    active = [i, 0]; dp[i][0] = 1; done.push([i, 0]);
    add(`Set dp[${i}][0] = 1. Choosing no coins is one combination for amount 0, regardless of which types are available.`);
  }
  for (let i = 1; i <= coins.length; i++) {
    coinIndex = i - 1;
    for (let a = 1; a <= amount; a++) {
      active = [i, a]; dependencies = [[i - 1, a]];
      const coin = coins[i - 1], addWays = a < coin ? 0 : dp[i][a - coin];
      if (a >= coin) dependencies.push([i, a - coin]);
      dp[i][a] = dp[i - 1][a] + addWays; done.push([i, a]);
      add(`Coin ${coin}, amount ${a}: ${dp[i - 1][a]} combinations without this type + ${addWays} with at least one = ${dp[i][a]}.${a >= coin ? ` The reuse term comes from this same row at amount ${a - coin}.` : ' This coin exceeds the amount, so its reuse term is 0.'}`);
    }
  }
  active = null; dependencies = []; coinIndex = null; result = dp[coins.length][amount];
  add(`Return dp[${coins.length}][${amount}] = ${result}. Coin-type rows count combinations, so different orders are not counted again.`);
  return frames;
}
function coin2Render(frame, {coins, amount}) {
  return sequence('Coin types · row i permits the first i types', coins, {active: frame.coinIndex}) + grid('dp[i][a] · number of combinations', frame.dp, {rowLabels: ['0 · no coins', ...coins.map((coin, i) => `${i + 1} · include ${coin}`)], colLabels: Array.from({length: amount + 1}, (_, i) => i), active: frame.active, dependencies: frame.dependencies, marked: frame.done});
}

function targetTrace({values, target}) {
  const frames = []; let memo = new Map([[0, 1]]), temp = new Map(), current = null, sourceSum = null, destination = null, branch = '—', result = '—';
  const add = message => save(frames, message, {memo: [...memo], temp: [...temp], current, sourceSum, destination, stats: [['Target', target], ['Branch', branch], ['Result', result]]});
  add('Start memo = {0: 1}. Before any numbers, the empty expression has sum 0 in one way. Each input number creates a fresh next layer.');
  for (let i = 0; i < values.length; i++) {
    current = i; temp = new Map(); sourceSum = null; destination = null; branch = '—';
    add(`Process nums[${i}] = ${values[i]}. Clear temp; read only the previous memo layer so each number is used exactly once.`);
    for (const [sum, count] of memo) {
      sourceSum = sum;
      for (const [label, signed] of [['+', values[i]], ['−', -values[i]]]) {
        branch = `${label}${values[i]}`; destination = sum + signed; const previous = temp.get(destination) || 0;
        temp.set(destination, previous + count);
        add(`From sum ${sum} (${count} ways), choose ${branch}: reach ${destination}. temp[${destination}] = ${previous} + ${count} = ${previous + count}.${values[i] === 0 ? ' +0 and −0 are different sign assignments, so both branches count.' : ''}`);
      }
    }
    memo = temp; temp = new Map(); sourceSum = null; destination = null; branch = '—';
    add(`Replace memo with the completed layer after ${i + 1} numbers: ${memo.size} distinct sums. Counts retain all sign assignments that merge into the same sum.`);
  }
  current = null; result = memo.get(target) || 0;
  add(`Return memo[${target}] if present, otherwise 0. There are ${result} sign assignments with target sum ${target}.`);
  return frames;
}
function targetRender(frame, {values}) {
  const row = (title, pairs, selected) => {
    const sums = pairs.map(pair => pair[0]);
    return grid(title, [pairs.map(pair => pair[1])], {rowLabels: ['ways'], colLabels: sums, active: selected === null || !sums.includes(selected) ? null : [0, sums.indexOf(selected)]});
  };
  return sequence('Numbers · assign one + or − to each index', values, {active: frame.current}) + row('memo · completed previous layer (columns are reachable sums)', frame.memo, frame.sourceSum) + row('temp · next layer being accumulated', frame.temp, frame.destination);
}

export function mountDecodeWays(root) {
  return mountSequencePlayback(root, {id: 'decode-ways', description: 'Fill suffix counts from right to left, choosing valid one-digit and two-digit letters.', inputs: [{key: 'text', label: 'Digit string', value: '226'}], hint: 'Use 1–18 digits. Try 06, 10, 101, or 11106 to inspect zeros and two-digit branches.', legend, parse: fields => { if (!/^[0-9]{1,18}$/.test(fields.text)) throw Error('Use a string of 1–18 digits.'); return {text: fields.text}; }, modes: [{label: 'Suffix dynamic programming', trace: decodeTrace}], render: decodeRender});
}
export function mountCoinChange(root) {
  return mountSequencePlayback(root, {id: 'coin-change', description: 'For each amount, try each denomination as the last coin and retain the smallest reachable count.', inputs: [{key: 'coins', label: 'Coin denominations · JSON array', value: '[1,2,5]'}, {key: 'amount', label: 'Amount', value: '11', type: 'number'}], hint: 'Use 1–6 distinct denominations from 1 to 24 and an amount from 0 to 24. ∞ means unreachable; uncompleted cells still show their source initialization of 0.', legend, parse: fields => ({coins: array(fields.coins, 'Coins', {min: 1, max: 24, length: 6, unique: true}), amount: integer(fields.amount, 0, 24, 'Amount')}), modes: [{label: 'Minimum coins by increasing amount', trace: coinTrace}], render: coinRender});
}
export function mountLongestIncreasingSubsequence(root) {
  return mountSequencePlayback(root, {id: 'longest-increasing-subsequence', description: 'For each starting index, compare later values and extend through already computed suffix lengths.', inputs: [{key: 'values', label: 'Numbers · JSON array', value: '[10,9,2,5,3,7,101,18]'}], hint: 'Use 1–16 integers from −999 to 999. Equal values cannot extend a strictly increasing subsequence. The saved implementation requires nonempty input.', legend, parse: fields => ({values: array(fields.values, 'Numbers', {min: -999, max: 999})}), modes: [{label: 'Quadratic suffix dynamic programming', trace: lisTrace}], render: lisRender});
}
export function mountStockCooldown(root) {
  return mountSequencePlayback(root, {id: 'stock-with-cooldown', description: 'Compute future profit for the can-buy and holding states. A sell reads two days ahead because the next day is a cooldown.', inputs: [{key: 'prices', label: 'Daily prices · JSON array', value: '[1,2,3,0,2]'}], hint: 'Use 1–16 daily prices from 0 to 99. Base columns n and n+1 are both 0. A tie leaves either action optimal.', legend, parse: fields => ({prices: array(fields.prices, 'Prices')}), modes: [{label: 'Two ownership states with a cooldown jump', trace: stockTrace}], render: stockRender});
}
export function mountCoinChange2(root) {
  return mountSequencePlayback(root, {id: 'coin-change-2', description: 'Count combinations by coin type. Read the previous row to omit a coin type and the same row to reuse it.', inputs: [{key: 'coins', label: 'Coin denominations · JSON array', value: '[1,2,5]'}, {key: 'amount', label: 'Amount', value: '5', type: 'number'}], hint: 'Use 1–6 distinct denominations from 1 to 20 and an amount from 0 to 20. Rows follow input order; changing the order leaves the final count unchanged.', legend, parse: fields => ({coins: array(fields.coins, 'Coins', {min: 1, max: 20, length: 6, unique: true}), amount: integer(fields.amount, 0, 20, 'Amount')}), modes: [{label: 'Coin-type and amount table', trace: coin2Trace}], render: coin2Render});
}
export function mountTargetSum(root) {
  return mountSequencePlayback(root, {id: 'target-sum', description: 'Build a map of reachable sums and their counts after each number. Every + and − branch contributes its previous count.', inputs: [{key: 'values', label: 'Numbers · JSON array', value: '[1,1,1,1,1]'}, {key: 'target', label: 'Target sum', value: '3', type: 'number'}], hint: 'Use 1–8 integers from 0 to 8, and a target from −64 to 64. Columns are only the sums stored in each map, in insertion order. Try [0,0,1] with target 1.', legend: 'Orange input: number being assigned a sign. Orange memo cell: previous sum being expanded. Orange temp cell: destination receiving more ways. An empty next layer has no stored sums yet.', parse: fields => ({values: array(fields.values, 'Numbers', {min: 0, max: 8, length: 8}), target: integer(fields.target, -64, 64, 'Target')}), modes: [{label: 'Rolling dictionary of sum counts', trace: targetTrace}], render: targetRender});
}
