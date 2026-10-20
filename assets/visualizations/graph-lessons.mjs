import {escape, integer, mountSequencePlayback} from './sequence-playback.mjs';

const key = (a, b) => `${a}:${b}`;
const list = values => values.length ? values.join(', ') : '∅';
const sameLetters = (a, b) => [...a].reduce((n, letter, i) => n + Number(letter !== b[i]), 0);

function json(text, label) {
  if (text.length > 4096) throw Error(`${label} must be at most 4,096 characters.`);
  try { return JSON.parse(text); }
  catch { throw Error(`${label} must be valid JSON.`); }
}

function edges(text, label, limit = 64) {
  const value = json(text, label);
  if (!Array.isArray(value) || value.length > limit || value.some(edge => !Array.isArray(edge) || edge.length !== 2 || edge.some(n => !Number.isSafeInteger(n)))) {
    throw Error(`${label} must contain at most ${limit} integer pairs, such as [[1,0],[2,0]].`);
  }
  return value;
}

function recorder() {
  const frames = [];
  return {frames, save: frame => {
    if (frames.length >= 1200) throw Error('Use a smaller input; playback supports at most 1,200 steps.');
    frames.push(structuredClone(frame));
  }};
}

function stateTable(frame) {
  const queue = frame.queue || [];
  return `<div class="graph-lesson-state"><h4>Queue · front → back</h4><p class="graph-lesson-queue">${queue.length ? queue.map(item => `<span>${escape(item)}</span>`).join('') : '<span>empty</span>'}</p>${frame.output ? `<p class="graph-lesson-result">${escape(frame.output)}</p>` : ''}${frame.rows ? `<div class="svg-scroll"><table class="graph-lesson-table"><caption>${escape(frame.caption || 'Algorithm state')}</caption><thead><tr>${frame.columns.map(label => `<th scope="col">${escape(label)}</th>`).join('')}</tr></thead><tbody>${frame.rows.map(row => `<tr>${row.map(value => `<td>${escape(value)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>` : ''}</div>`;
}

function graphDrawing(frame, input) {
  const nodes = input.nodes, n = nodes.length, width = 640, height = 480;
  const positions = new Map(nodes.map((node, i) => [node, {x: n === 1 ? 320 : 320 + 205 * Math.cos(2 * Math.PI * i / n - Math.PI / 2), y: n === 1 ? 240 : 235 + 185 * Math.sin(2 * Math.PI * i / n - Math.PI / 2)}]));
  const done = new Set(frame.done || []), queued = new Set(frame.queued || []), removed = new Set(frame.removed || []), accepted = new Set(frame.accepted || []);
  let lines = '';
  input.graphEdges.forEach(([a, b], index) => {
    const from = positions.get(a), to = positions.get(b), inactive = removed.has(a) || removed.has(b), active = frame.edgeIndex === index, selected = frame.resultEdge === index;
    const dx = to.x - from.x, dy = to.y - from.y, length = Math.hypot(dx, dy) || 1, offset = input.directed ? 33 : 30;
    const lineClass = `graph-lesson-edge ${inactive ? 'removed' : ''} ${accepted.has(index) ? 'accepted' : ''} ${active ? 'current' : ''} ${selected ? 'result' : ''}`;
    if (a === b) {
      lines += `<path class="${lineClass}" d="M ${from.x + 25} ${from.y - 15} C ${from.x + 100} ${from.y - 75}, ${from.x + 100} ${from.y + 75}, ${from.x + 25} ${from.y + 15}" ${input.directed ? `marker-end="url(#${input.id}-arrow)"` : ''}/>`;
    } else {
      lines += `<line class="${lineClass}" x1="${from.x + dx / length * 30}" y1="${from.y + dy / length * 30}" x2="${to.x - dx / length * offset}" y2="${to.y - dy / length * offset}" ${input.directed ? `marker-end="url(#${input.id}-arrow)"` : ''}/>`;
    }
  });
  const circles = nodes.map(node => {
    const {x, y} = positions.get(node), current = frame.current === node;
    const status = removed.has(node) ? 'removed' : current ? 'current' : done.has(node) ? 'visited' : queued.has(node) ? 'queued' : 'waiting';
    return `<g class="graph-lesson-node ${status}" transform="translate(${x} ${y})"><title>${escape(`${node}: ${status}`)}</title><circle r="30"/><text y="5">${escape(node)}</text><text class="graph-lesson-node-status" y="45">${escape(frame.nodeLabels?.[node] ?? status)}</text></g>`;
  }).join('');
  return `<div class="svg-scroll graph-lesson-scroll"><svg class="graph-lesson-svg" viewBox="0 0 ${width} ${height}" style="min-width:640px" role="img" aria-label="${escape(`${input.directed ? 'Directed' : 'Undirected'} graph. ${frame.message}`)}"><defs><marker id="${input.id}-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z"/></marker></defs>${lines}${circles}</svg></div>`;
}

const renderGraph = (frame, input) => graphDrawing(frame, input) + stateTable(frame);

function parseOranges(fields) {
  const grid = json(fields.grid, 'Grid');
  if (!Array.isArray(grid) || !grid.length || grid.length > 4 || !Array.isArray(grid[0]) || !grid[0].length || grid[0].length > 4 || grid.some(row => !Array.isArray(row) || row.length !== grid[0].length || row.some(value => ![0, 1, 2].includes(value)))) {
    throw Error('Use a rectangular grid with 1–4 rows and 1–4 columns, containing only 0, 1, and 2 (at most 16 cells).');
  }
  return {grid};
}

function orangesTrace(input) {
  const grid = input.grid.map(row => [...row]), queue = [], times = {}, {frames, save} = recorder();
  let maxTime = 0, current = null, pops = 0;
  for (let r = 0; r < grid.length; r++) for (let c = 0; c < grid[0].length; c++) if (grid[r][c] === 2) queue.push([r, c, 0]);
  function snapshot(message, output = '') {
    save({message, grid, times, current, queue: queue.map(([r, c, t]) => `(${r},${c}; ${t}m)`), output,
      stats: [['maxTime', maxTime], ['Queue entries', queue.length], ['Fresh cells left', grid.flat().filter(value => value === 1).length], ['Dequeued entries', pops]]});
  }
  snapshot('Enqueue every initially rotten orange with minute 0. No orange has been processed yet.');
  while (queue.length) {
    const [r, c, minute] = queue.shift(); current = [r, c]; pops++;
    if (r < 0 || c < 0 || r === grid.length || c === grid[0].length) {
      snapshot(`Pop (${r}, ${c}, ${minute}). It is outside the grid; skip it.`); continue;
    }
    if (grid[r][c] <= 0) {
      snapshot(`Pop (${r}, ${c}, ${minute}). Its value is ${grid[r][c]} (empty or already processed); skip it.`); continue;
    }
    maxTime = Math.max(maxTime, minute); grid[r][c] = -1; times[key(r, c)] = minute;
    snapshot(`Pop (${r}, ${c}, ${minute}). Process this orange, set grid[${r}][${c}] = -1, and update maxTime = ${maxTime}.`);
    for (const [x, y] of [[r + 1, c], [r - 1, c], [r, c + 1], [r, c - 1]]) queue.push([x, y, minute + 1]);
    snapshot(`Enqueue down, up, right, and left at minute ${minute + 1}. Invalid and repeated coordinates will be skipped when popped.`);
  }
  current = null;
  const result = grid.flat().includes(1) ? -1 : maxTime;
  snapshot(result === -1 ? 'The queue is empty and fresh oranges remain. Return -1.' : `The queue is empty and every orange was reached. Return ${result}.`, `Result = ${result}`);
  return frames;
}

function renderOranges(frame) {
  const cells = frame.grid.map((row, r) => `<tr>${row.map((value, c) => {
    const current = frame.current?.[0] === r && frame.current?.[1] === c, state = value === -1 ? 'processed' : value === 2 ? 'rotten' : value === 1 ? 'fresh' : 'empty';
    const label = value === -1 ? `${frame.times[key(r, c)]} min` : state;
    return `<td class="${state} ${current ? 'current' : ''}"><strong>${value}</strong><span>${label}</span><small>(${r},${c})</small></td>`;
  }).join('')}</tr>`).join('');
  return `<div class="svg-scroll"><table class="graph-lesson-grid"><caption>Orange grid · -1 means processed by the saved source</caption><tbody>${cells}</tbody></table></div>${stateTable(frame)}`;
}

export function mountRottingOranges(root) {
  return mountSequencePlayback(root, {id: 'rotting-oranges', description: 'Edit the grid to move rotten oranges, fresh oranges, and empty cells. Follow the source’s exact dequeue checks and elapsed minutes.', inputs: [{key: 'grid', label: 'Grid · JSON rows', value: '[[2,1,1],[1,1,0],[0,1,1]]'}], hint: 'Use 1–4 rows and 1–4 columns, at most 16 cells. 0 = empty; 1 = fresh; 2 = initially rotten. Coordinates are zero-based.', legend: 'Orange cells: initially rotten. Green cells: processed, with earliest minute. Outline: most recently popped coordinate. Out-of-bounds queue entries are shown in the queue and message.', parse: parseOranges, modes: [{label: 'Multi-source BFS', trace: orangesTrace}], render: renderOranges});
}

function parseCourses(fields) {
  const n = integer(fields.courses, 1, 16, 'Number of courses'), pairs = edges(fields.pairs, 'Prerequisites');
  if (pairs.some(pair => pair.some(v => v < 0 || v >= n))) throw Error('Each course and prerequisite must be between 0 and the number of courses − 1.');
  const unique = [...new Map(pairs.map(([a, b]) => [key(a, b), [a, b]])).values()];
  return {n, pairs: unique, nodes: Array.from({length: n}, (_, i) => i), graphEdges: unique.map(([a, b]) => [b, a]), directed: true, id: 'course-schedule-ii'};
}

function courseTrace(input) {
  const preqs = Array.from({length: input.n}, () => new Set()), dependents = Array.from({length: input.n}, () => []), queue = [], result = [], {frames, save} = recorder();
  input.pairs.forEach(([a, b]) => { preqs[a].add(b); dependents[b].push(a); });
  preqs.forEach((values, course) => { if (!values.size) queue.push(course); });
  let current = null;
  function snapshot(message, edgeIndex = null, output = '') {
    save({message, edgeIndex, output: output || `res = [${result.join(', ')}]`, current, done: result, queued: queue, queue,
      nodeLabels: Object.fromEntries(preqs.map((values, course) => [course, `${values.size} left`])),
      columns: ['Course', 'Remaining prerequisites', 'Status'], caption: 'Prerequisite sets after completed courses are discarded',
      rows: preqs.map((values, course) => [course, list([...values]), result.includes(course) ? 'completed' : queue.includes(course) ? 'ready' : 'waiting']),
      stats: [['Courses completed', `${result.length} / ${input.n}`], ['Ready queue', queue.length]]});
  }
  snapshot('Build prerequisite sets and dependent edges. Enqueue courses whose prerequisite sets are empty.');
  while (queue.length) {
    current = queue.shift(); result.push(current);
    snapshot(`Pop ready course ${current} and append it to res.`);
    for (const next of dependents[current]) {
      preqs[next].delete(current);
      const ready = preqs[next].size === 0;
      if (ready) queue.push(next);
      const edgeIndex = input.graphEdges.findIndex(([a, b]) => a === current && b === next);
      snapshot(`Discard ${current} from course ${next}’s prerequisites. ${ready ? `Its set is empty, so enqueue ${next}.` : `It still needs ${list([...preqs[next]])}.`}`, edgeIndex);
    }
  }
  current = null;
  const valid = result.length === input.n;
  snapshot(valid ? 'Every course is in res. Return this valid course order.' : 'The ready queue is empty while some courses remain. A cycle prevents completion; return [].', null, `Return ${valid ? `[${result.join(', ')}]` : '[]'}`);
  return frames;
}

export function mountCourseSchedule(root) {
  return mountSequencePlayback(root, {id: 'course-schedule-ii', description: 'Edit prerequisites to explore a valid ordering or introduce a cycle. Arrows point from prerequisite to dependent course.', inputs: [{key: 'courses', label: 'Number of courses', type: 'number', value: '4'}, {key: 'pairs', label: 'Prerequisites · [course, prerequisite]', value: '[[1,0],[2,0],[3,1],[3,2]]'}], hint: 'Use 1–16 courses and up to 64 prerequisite pairs. Course labels are 0 through n − 1, including isolated courses. Duplicate pairs collapse into sets. Python set traversal may produce a different valid order.', legend: 'Orange outline: current course. Green: completed. Dashed outline: queued and ready. Node labels show remaining prerequisite counts. Orange edge: prerequisite just removed.', parse: parseCourses, modes: [{label: 'Prerequisite-set BFS', trace: courseTrace}], render: renderGraph});
}

function parseRedundant(fields) {
  const value = edges(fields.edges, 'Edges', 16), nodes = [...new Set(value.flat())].sort((a, b) => a - b), n = nodes.length;
  const unique = new Set(value.map(([a, b]) => a < b ? key(a, b) : key(b, a)));
  if (n < 3 || n > 16 || value.length !== n || nodes.some((node, i) => node !== i + 1) || unique.size !== value.length || value.some(([a, b]) => a === b)) {
    throw Error('Use a simple graph with 3–16 nodes labeled 1 through n and exactly n unique edges, with no self-loops.');
  }
  const reached = new Set([1]), pending = [1];
  while (pending.length) {
    const node = pending.pop();
    for (const [a, b] of value) {
      const next = a === node ? b : b === node ? a : null;
      if (next !== null && !reached.has(next)) { reached.add(next); pending.push(next); }
    }
  }
  if (reached.size !== n) throw Error('The graph must be connected: a tree with one additional edge.');
  return {nodes, graphEdges: value, directed: false, id: 'redundant-connection'};
}

function trimTrace(input) {
  const graph = new Map(input.nodes.map(node => [node, new Set()])), queue = [], removed = [], {frames, save} = recorder();
  input.graphEdges.forEach(([a, b]) => { graph.get(a).add(b); graph.get(b).add(a); });
  // Python's dict keys follow first endpoint appearance, rather than numeric order.
  const appearance = [...new Set(input.graphEdges.flat())];
  appearance.forEach(node => { if (graph.get(node).size === 1) queue.push(node); });
  let current = null;
  function snapshot(message, edgeIndex = null, resultEdge = null) {
    save({message, edgeIndex, resultEdge, current, queue, queued: queue, removed,
      nodeLabels: Object.fromEntries(input.nodes.map(node => [node, graph.has(node) ? `degree ${graph.get(node).size}` : 'trimmed'])),
      caption: 'Remaining adjacency sets', columns: ['Node', 'Neighbors'], rows: input.nodes.map(node => [node, graph.has(node) ? list([...graph.get(node)]) : 'deleted']),
      output: resultEdge === null ? '' : `Return [${input.graphEdges[resultEdge].join(', ')}]`, stats: [['Nodes remaining', graph.size], ['Leaves queued', queue.length]]});
  }
  snapshot('Build the graph and enqueue all degree-1 leaves. Only cycle nodes will survive repeated trimming.');
  while (queue.length) {
    current = queue.shift();
    snapshot(`Pop leaf ${current}. Remove it from each remaining neighbor’s adjacency set.`);
    for (const next of graph.get(current)) {
      graph.get(next).delete(current);
      if (graph.get(next).size === 1) queue.push(next);
      const edgeIndex = input.graphEdges.findIndex(([a, b]) => (a === current && b === next) || (a === next && b === current));
      snapshot(`Remove ${current} from node ${next}. Its new degree is ${graph.get(next).size}.${graph.get(next).size === 1 ? ` Enqueue ${next} as a new leaf.` : ''}`, edgeIndex);
    }
    graph.delete(current); removed.push(current);
    snapshot(`Delete node ${current} from the graph. It cannot lie on the unique cycle.`);
  }
  current = null;
  snapshot('All leaves have been trimmed. Scan the original edges backward to choose the last cycle edge.');
  for (let i = input.graphEdges.length - 1; i >= 0; i--) {
    const [a, b] = input.graphEdges[i], found = graph.has(a) && graph.has(b);
    snapshot(`Check input edge ${i}: [${a}, ${b}]. ${found ? 'Both endpoints remain in the cycle core; return this edge.' : 'At least one endpoint was trimmed; continue backward.'}`, i, found ? i : null);
    if (found) break;
  }
  return frames;
}

function unionTrace(input) {
  const parent = Array.from({length: input.nodes.length + 1}, (_, i) => i), size = parent.map(() => 1), accepted = [], {frames, save} = recorder();
  let current = null;
  function snapshot(message, edgeIndex = null, resultEdge = null) {
    save({message, current, edgeIndex, resultEdge, accepted, queue: [], caption: 'Union-find arrays · rank stores root component size', columns: ['Node', 'parent', 'rank'], rows: input.nodes.map(node => [node, parent[node], size[node]]),
      nodeLabels: Object.fromEntries(input.nodes.map(node => [node, `p=${parent[node]}`])), output: resultEdge === null ? '' : `Return [${input.graphEdges[resultEdge].join(', ')}]`, stats: [['Accepted edges', accepted.length], ['Components', input.nodes.length - accepted.length]]});
  }
  function find(node) {
    let cursor = parent[node];
    while (cursor !== parent[cursor]) { parent[cursor] = parent[parent[cursor]]; cursor = parent[cursor]; }
    return cursor;
  }
  snapshot('Initialize each node as its own parent, with rank (component size) 1. Process edges in input order.');
  for (let i = 0; i < input.graphEdges.length; i++) {
    const [a, b] = input.graphEdges[i]; current = a;
    let u = find(a), v = find(b);
    snapshot(`Edge ${i}: [${a}, ${b}]. find returns roots ${u} and ${v}, applying path halving while walking upward.`, i);
    if (u === v) { snapshot('The endpoints already have the same root. Adding this edge closes the cycle; return it.', i, i); break; }
    if (size[v] > size[u]) [u, v] = [v, u];
    parent[v] = u; size[u] += size[v]; accepted.push(i);
    snapshot(`Attach root ${v} below root ${u}. Update rank[${u}] = ${size[u]}; accept this edge.`, i);
  }
  return frames;
}

export function mountRedundantConnection(root) {
  return mountSequencePlayback(root, {id: 'redundant-connection', description: 'Edit the connected graph’s edge order. Compare trimming leaves to adding edges with union-find; both select the last removable cycle edge.', inputs: [{key: 'edges', label: 'Undirected edges · JSON pairs', value: '[[1,2],[2,3],[3,1],[3,4],[4,5]]'}], hint: 'Use 3–16 distinct nodes labeled 1 through n, exactly n unique edges, and a connected graph with no self-loops. This matches a tree plus one edge.', legend: 'Orange outline: current node. Orange edge: current check. Faded nodes/edges: trimmed. Green edges: accepted by union-find. Thick dashed edge: returned redundant edge. The state table shows exact stored values.', parse: parseRedundant, modes: [{label: 'Leaf trimming and reverse edge scan', trace: trimTrace}, {label: 'Union-find with path halving', trace: unionTrace}], render: renderGraph});
}

function parseWords(fields) {
  const begin = fields.begin.trim(), end = fields.end.trim(), words = json(fields.words, 'Word list');
  if (!/^[a-z]{1,6}$/.test(begin) || !/^[a-z]{1,6}$/.test(end) || begin.length !== end.length) throw Error('Begin and end must be lowercase a–z words of equal length, from 1 to 6 letters.');
  if (!Array.isArray(words) || words.length > 16 || words.some(word => typeof word !== 'string' || !/^[a-z]{1,6}$/.test(word) || word.length !== begin.length) || new Set(words).size !== words.length) throw Error('Use up to 16 unique lowercase words with the same length as begin and end.');
  const nodes = [...new Set([begin, ...words])];
  if (nodes.length > 16) throw Error('Use at most 16 distinct graph nodes, including beginWord and all dictionary words.');
  const graphEdges = [];
  nodes.forEach((a, i) => { for (let j = i + 1; j < nodes.length; j++) if (sameLetters(a, nodes[j]) === 1) graphEdges.push([a, nodes[j]]); });
  return {begin, end, words, nodes, graphEdges, directed: false, id: 'word-ladder'};
}

function ladderTrace(input, mutation) {
  const queue = [[input.begin, 1]], visited = new Set(), remaining = new Set(input.words), distances = new Map([[input.begin, 1]]), done = [], {frames, save} = recorder();
  let current = null, comparisons = 0;
  const edgeIndex = (a, b) => input.graphEdges.findIndex(([u, v]) => (a === u && b === v) || (a === v && b === u));
  function snapshot(message, edge = null, output = '') {
    save({message, edgeIndex: edge, current, done, queued: queue.map(([word]) => word), queue: queue.map(([word, distance]) => `${word}: ${distance}`), output,
      nodeLabels: Object.fromEntries(input.nodes.map(word => [word, distances.has(word) ? `dist ${distances.get(word)}` : 'unreached'])),
      caption: mutation ? 'Dictionary set · remove a word on enqueue' : 'Dictionary indices · mark visited on enqueue',
      columns: ['Index', 'Word', mutation ? 'In remaining set?' : 'Visited index?', 'First distance'],
      rows: input.words.map((word, index) => [index, word, mutation ? (remaining.has(word) ? 'yes' : 'no') : (visited.has(index) ? 'yes' : 'no'), distances.get(word) ?? '—']),
      stats: [['Queue entries', queue.length], [mutation ? 'Generated candidates' : 'Word comparisons', comparisons], ['Target', input.end]]});
  }
  if (mutation && !remaining.has(input.end)) { queue.length = 0; snapshot('The reference checks the dictionary first. endWord is absent, so return 0 without initializing the BFS queue.', null, 'Return 0'); return frames; }
  snapshot('Build the implicit graph: connect equal-length words that differ at exactly one letter. Enqueue beginWord with distance 1.');
  while (queue.length) {
    const [word, distance] = queue.shift(); current = word; done.push(word);
    snapshot(`Pop ${word} at distance ${distance}. Distance counts words, including beginWord.`);
    if (word === input.end) { snapshot('The popped word equals endWord. BFS guarantees this is the shortest sequence length.', null, `Return ${distance}`); return frames; }
    if (!mutation) {
      input.words.forEach((candidate, index) => {
        if (visited.has(index)) return;
        comparisons++;
        if (sameLetters(word, candidate) === 1) {
          visited.add(index); queue.push([candidate, distance + 1]);
          if (!distances.has(candidate)) distances.set(candidate, distance + 1);
          snapshot(`Compare ${word} with wordList[${index}] = ${candidate}: exactly one letter differs. Mark index ${index} visited and enqueue at ${distance + 1}.`, edgeIndex(word, candidate));
        } else snapshot(`Compare ${word} with wordList[${index}] = ${candidate}: ${sameLetters(word, candidate)} letters differ. Do not enqueue.`);
      });
    } else {
      let found = 0;
      for (let i = 0; i < word.length; i++) for (let code = 97; code < 123; code++) {
        const letter = String.fromCharCode(code);
        if (letter === word[i]) continue;
        comparisons++;
        const candidate = word.slice(0, i) + letter + word.slice(i + 1);
        if (remaining.has(candidate)) {
          remaining.delete(candidate); queue.push([candidate, distance + 1]); found++;
          if (!distances.has(candidate)) distances.set(candidate, distance + 1);
          snapshot(`Replace position ${i} in ${word} with ${letter}: ${candidate} is in the set. Remove it and enqueue at distance ${distance + 1}.`, edgeIndex(word, candidate));
        }
      }
      snapshot(`Finished all ${word.length * 25} one-letter replacements for ${word}. Enqueued ${found} matching dictionary words; other generated strings were absent.`);
    }
  }
  current = null; snapshot('The queue is empty without reaching endWord. Return 0.', null, 'Return 0');
  return frames;
}

export function mountWordLadder(root) {
  return mountSequencePlayback(root, {id: 'word-ladder', description: 'Edit the words and compare the two saved BFS versions. The diagram draws the implicit one-letter graph; the queue carries the number of words used so far.', inputs: [{key: 'begin', label: 'Begin word', value: 'hit'}, {key: 'end', label: 'End word', value: 'cog'}, {key: 'words', label: 'Word list · JSON strings', value: '["hot","dot","dog","lot","log","cog"]'}], hint: 'Use equal-length lowercase words of 1–6 letters. Playback accepts unique dictionary words and at most 16 distinct nodes including beginWord. [] is allowed. An absent endWord is shown as the target but is not a graph node.', legend: 'Orange outline: popped word. Green: previously popped word. Dashed outline: queued. Node labels show first discovered distance. Orange edge: current one-letter discovery. The table tracks index visitation or remaining set membership.', parse: parseWords, modes: [{label: 'Scan unvisited dictionary indices', trace: input => ladderTrace(input, false)}, {label: 'Generate replacements and remove from set', trace: input => ladderTrace(input, true)}], render: renderGraph});
}
