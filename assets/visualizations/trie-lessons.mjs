import {escape, mountSequencePlayback} from './sequence-playback.mjs';

const MAX_FRAMES = 1200;
const DIRECTIONS = [[-1, 0, 'up'], [1, 0, 'down'], [0, -1, 'left'], [0, 1, 'right']];
const coordinate = (row, column) => `(${row}, ${column})`;

function parseBoard(text) {
  if (text.length > 2048) throw Error('Keep the Board field under 2,048 characters; the grid supports at most 16 cells.');
  let rows;
  try { rows = JSON.parse(text); }
  catch { throw Error('Board must be a JSON array of rows, such as ["ab","cd"] or [["a","b"],["c","d"]].'); }
  if (!Array.isArray(rows) || !rows.length || rows.length > 4) throw Error('Use a board with 1 to 4 rows and 1 to 4 columns.');
  const board = rows.map(row => typeof row === 'string' ? [...row] : row);
  const width = board[0]?.length;
  if (!Number.isInteger(width) || width < 1 || width > 4 || board.some(row => !Array.isArray(row) || row.length !== width || row.some(letter => typeof letter !== 'string' || !/^[a-z]$/.test(letter)))) {
    throw Error('Use a rectangular board of lowercase letters a–z, with 1 to 4 rows and 1 to 4 columns.');
  }
  return board.map(row => [...row]);
}

function parseInput(fields) {
  const board = parseBoard(fields.board);
  if (fields.words.length > 1024) throw Error('Keep the Words field under 1,024 characters and use at most 8 short words.');
  let words;
  try { words = JSON.parse(fields.words); }
  catch { throw Error('Words must be a JSON array, such as ["oath","eat"].'); }
  if (!Array.isArray(words) || words.length > 8 || words.some(word => typeof word !== 'string' || !/^[a-z]{1,6}$/.test(word))) {
    throw Error('Use at most 8 candidate words, each with 1 to 6 lowercase letters a–z. [] searches for no words.');
  }
  return {board, words: [...words]};
}

function buildTrie(words) {
  const nodes = [{id: 0, letter: 'root', prefix: '', parent: null, children: {}, terminalIndex: null}];
  words.forEach((word, index) => {
    let id = 0;
    for (const letter of word) {
      if (!Object.hasOwn(nodes[id].children, letter)) {
        const next = nodes.length;
        nodes[id].children[letter] = next;
        nodes.push({id: next, letter, prefix: nodes[id].prefix + letter, parent: id, children: {}, terminalIndex: null});
      }
      id = nodes[id].children[letter];
    }
    nodes[id].terminalIndex = index;
  });
  nodes.forEach(node => { Object.freeze(node.children); Object.freeze(node); });
  return Object.freeze(nodes);
}

function wordSearchTrace(input) {
  const {board, words} = input, trie = buildTrie(words), frames = [], path = [], stack = [], results = [];
  const visited = new Set(), remainingTerminals = new Set(trie.filter(node => node.terminalIndex !== null).map(node => node.id));
  let startingCell = null, checks = 0;
  function save(message, currentNode = 0, attempt = null, backtracked = null) {
    if (frames.length >= MAX_FRAMES) throw Error(`This input needs more than ${MAX_FRAMES.toLocaleString('en-US')} playback steps. Use a smaller board or shorter words to see a complete trace.`);
    frames.push(Object.freeze({
      message, trie, currentNode, attempt: attempt ? Object.freeze({...attempt}) : null,
      backtracked: backtracked ? Object.freeze([...backtracked]) : null,
      path: Object.freeze(path.map(cell => Object.freeze([...cell]))),
      stack: Object.freeze(stack.map(call => Object.freeze({...call}))),
      results: Object.freeze([...results]), remainingTerminals: Object.freeze([...remainingTerminals]),
      stats: Object.freeze([['Starting cell', startingCell ? coordinate(...startingCell) : '—'], ['Trie prefix', trie[currentNode].prefix || '(root)'], ['Visited cells', visited.size], ['DFS checks', checks], ['Words found', `${results.length} / ${new Set(words).size}`]].map(pair => Object.freeze(pair)))
    }));
  }
  save('Build the trie from the candidate words. Terminal nodes store is_end = True and the last input index for that word.');
  function dfs(nodeId, row, column, direction = 'start') {
    checks++;
    stack.push({row, column, prefix: trie[nodeId].prefix, direction});
    const key = `${row}:${column}`, attempt = {row, column};
    if (row < 0 || column < 0 || row >= board.length || column >= board[0].length) {
      save(`Try ${direction} at ${coordinate(row, column)}. It is outside the board, so return.`, nodeId, {...attempt, reason: 'Outside board'});
      stack.pop(); return;
    }
    if (visited.has(key)) {
      save(`Try ${direction} at ${coordinate(row, column)}. This cell is already visited in the current path; return without reusing it.`, nodeId, {...attempt, reason: 'Already visited'});
      stack.pop(); return;
    }
    const letter = board[row][column], nextId = trie[nodeId].children[letter];
    if (nextId === undefined) {
      save(`Try ${direction} at ${coordinate(row, column)}: ${letter} has no trie edge after ${trie[nodeId].prefix || 'root'}. This is not a candidate prefix, so return.`, nodeId, {...attempt, reason: 'No prefix edge'});
      stack.pop(); return;
    }
    visited.add(key); path.push([row, column]);
    save(`Follow trie edge ${letter} at ${coordinate(row, column)}. Prefix = ${trie[nextId].prefix}; add this cell to visited.`, nextId, {...attempt, reason: 'Follow edge'});
    if (remainingTerminals.has(nextId)) {
      remainingTerminals.delete(nextId);
      const word = words[trie[nextId].terminalIndex];
      results.push(word);
      save(`Found ${word} at a terminal node. Set is_end = False and append words[${trie[nextId].terminalIndex}], so another path cannot report it again.`, nextId);
    }
    for (const [dr, dc, nextDirection] of DIRECTIONS) dfs(nextId, row + dr, column + dc, nextDirection);
    visited.delete(key); path.pop();
    save(`All four neighbors of ${coordinate(row, column)} have returned. Discard this cell from visited and backtrack to ${trie[nodeId].prefix || 'root'}.`, nodeId, null, [row, column]);
    stack.pop();
  }
  for (let row = 0; row < board.length; row++) {
    for (let column = 0; column < board[0].length; column++) {
      startingCell = [row, column];
      save(`Start a new path from ${coordinate(row, column)} with an empty visited set and trie root.`);
      dfs(0, row, column);
    }
  }
  startingCell = null;
  save(`Every starting cell has been searched. Return ${JSON.stringify(results)}. visited is empty after all backtracking.`);
  return frames;
}

function triePositions(nodes) {
  const positions = new Map();
  let leaves = 0, maxDepth = 0;
  function place(id, depth) {
    maxDepth = Math.max(maxDepth, depth);
    const children = Object.values(nodes[id].children);
    children.forEach(child => place(child, depth + 1));
    const x = children.length ? children.reduce((sum, child) => sum + positions.get(child).x, 0) / children.length : 44 + leaves++ * 82;
    positions.set(id, {x, y: 44 + depth * 72});
  }
  place(0, 0);
  const naturalWidth = leaves * 82 + 6, width = Math.max(320, naturalWidth);
  for (const point of positions.values()) point.x += (width - naturalWidth) / 2;
  return {positions, width, height: maxDepth * 72 + 104};
}

function renderTrie(frame) {
  const {trie} = frame, {positions, width, height} = triePositions(trie), remaining = new Set(frame.remainingTerminals);
  const active = new Set();
  let ancestor = frame.currentNode;
  while (ancestor !== null) { active.add(ancestor); ancestor = trie[ancestor].parent; }
  let drawing = '';
  for (const node of trie) {
    if (node.parent === null) continue;
    const from = positions.get(node.parent), to = positions.get(node.id);
    drawing += `<line class="trie-lesson-edge ${active.has(node.id) ? 'on-path' : ''}" x1="${from.x}" y1="${from.y}" x2="${to.x}" y2="${to.y}"/>`;
  }
  for (const node of trie) {
    const {x, y} = positions.get(node.id), terminal = node.terminalIndex !== null, found = terminal && !remaining.has(node.id), current = node.id === frame.currentNode;
    drawing += `<g ${current ? 'data-follow' : ''} class="trie-lesson-node ${active.has(node.id) ? 'on-path' : ''} ${current ? 'current' : ''} ${found ? 'found' : ''}" transform="translate(${x} ${y})"><circle r="20"/>${terminal ? '<circle class="terminal-ring" r="25"/>' : ''}<text y="4">${escape(node.letter)}</text>${terminal ? `<text class="trie-lesson-marker" y="39">${found ? 'found' : 'end'}</text>` : ''}</g>`;
  }
  const state = trie.filter(node => node.terminalIndex !== null).map(node => `${node.prefix}: is_end ${remaining.has(node.id) ? 'True' : 'False'}`).join('; ') || 'no word endings';
  return `<section class="trie-lesson-panel"><h4>Trie · current prefix ${escape(trie[frame.currentNode].prefix || '(root)')}</h4><div class="svg-scroll trie-lesson-scroll"><svg class="trie-lesson-svg" viewBox="0 0 ${width} ${height}" style="min-width:${width}px" role="img" aria-label="${escape(`Trie. Current prefix ${trie[frame.currentNode].prefix || 'root'}. ${state}.`)}">${drawing}</svg></div></section>`;
}

function renderBoard(frame, input) {
  const pathIndices = new Map(frame.path.map((cell, index) => [cell.join(':'), index + 1]));
  const rows = input.board.map((row, r) => `<tr>${row.map((letter, c) => {
    const order = pathIndices.get(`${r}:${c}`), attempted = frame.attempt?.row === r && frame.attempt?.column === c;
    const backtracked = frame.backtracked?.[0] === r && frame.backtracked?.[1] === c;
    return `<td class="${order ? 'visited' : ''} ${attempted ? 'attempted' : ''} ${backtracked ? 'backtracked' : ''}"><strong>${letter}</strong><span>${order ? `path ${order}` : coordinate(r, c)}</span><span class="sr-only">${order ? `visited, path position ${order}` : 'not visited'}${attempted ? `, ${escape(frame.attempt.reason)}` : ''}${backtracked ? ', just removed from visited' : ''}</span></td>`;
  }).join('')}</tr>`).join('');
  const attempted = frame.attempt ? `${coordinate(frame.attempt.row, frame.attempt.column)} · ${frame.attempt.reason}` : '—';
  return `<section class="trie-lesson-panel"><h4>Board · visited belongs to the current path</h4><div class="svg-scroll"><table class="trie-lesson-board"><caption class="sr-only">Letters, zero-based coordinates, and current path positions</caption><tbody>${rows}</tbody></table></div><p class="hint">Attempt: ${escape(attempted)}</p><p class="trie-lesson-path">${frame.path.length ? frame.path.map(cell => coordinate(...cell)).join(' → ') : 'Path is empty'}</p></section>`;
}

function renderWords(frame, input) {
  const found = new Set(frame.results), prefix = frame.trie[frame.currentNode].prefix;
  return `<section class="trie-lesson-panel"><h4>Candidate words · input order</h4>${input.words.length ? `<ol class="trie-lesson-words" aria-label="Candidate words and search state">${input.words.map((word, i) => `<li class="${found.has(word) ? 'found' : prefix && word.startsWith(prefix) ? 'matches-prefix' : ''}"><strong>${escape(word)}</strong><span>${found.has(word) ? 'found' : prefix && word.startsWith(prefix) ? 'matches prefix' : 'waiting'} · index ${i}</span></li>`).join('')}</ol>` : '<p class="hint">No candidate words</p>'}<p class="trie-lesson-path">results = ${escape(JSON.stringify(frame.results))}</p></section>`;
}

function renderFrame(frame, input) {
  return `<div class="trie-lesson-layout">${renderBoard(frame, input)}${renderTrie(frame)}</div>${renderWords(frame, input)}<section class="trie-lesson-panel"><h4>DFS calls · oldest to newest</h4>${frame.stack.length ? `<ol class="trie-lesson-calls">${frame.stack.map(call => `<li>dfs(${escape(call.prefix || 'root')}, ${call.row}, ${call.column}) · ${escape(call.direction)}</li>`).join('')}</ol>` : '<p class="hint">No active calls</p>'}</section>`;
}

export function mountWordSearch(root) {
  const disposePlayback = mountSequencePlayback(root, {
    id: 'word-search-ii',
    description: 'Edit the board and candidate words, then load the input. Follow the saved Python solution’s trie edges, visited cells, and up/down/left/right backtracking.',
    inputs: [{key: 'board', label: 'Board · JSON rows', value: '["oaan","etae","ihkr","iflv"]'}, {key: 'words', label: 'Candidate words · JSON array', value: '["oath","pea","eat","rain"]'}],
    hint: 'Use 1–4 rows and 1–4 columns; each cell is a lowercase letter. Rows can be strings or letter arrays. Use up to 8 words of 1–6 letters. Load input applies cell edits. Traces are limited to 1,200 steps.',
    legend: 'Board path numbers and filled cells: visited. Orange outline: attempted cell. Dashed outline: cell just removed on backtracking. Trie thick edges: current prefix. Double ring and end label: word ending; found means is_end was cleared.',
    parse: parseInput, modes: [{label: 'Trie DFS with terminal flags', trace: wordSearchTrace}], render: renderFrame
  });
  const boardInput = root.querySelector('input[name="board"]'), form = root.querySelector('form');
  const editor = document.createElement('fieldset');
  editor.className = 'trie-lesson-editor';
  editor.innerHTML = '<legend>Edit board cells</legend><p class="hint">These cells edit the Board field. Press Load input to start a new search.</p><div data-grid-editor></div>';
  form.insertBefore(editor, form.querySelector('button[type="submit"]'));
  const grid = editor.querySelector('[data-grid-editor]');
  function refreshEditor() {
    let board;
    try { board = parseBoard(boardInput.value); }
    catch { grid.innerHTML = '<p class="hint">Enter a valid rectangular Board field to edit its cells here.</p>'; return; }
    grid.innerHTML = `<div class="trie-lesson-edit-grid" style="grid-template-columns:repeat(${board[0].length}, minmax(44px, 64px))">${board.flatMap((row, r) => row.map((letter, c) => `<label><span>${coordinate(r, c)}</span><input type="text" maxlength="1" value="${escape(letter)}" data-row="${r}" data-column="${c}" aria-label="Board row ${r}, column ${c}" autocomplete="off" autocapitalize="none" spellcheck="false"></label>`)).join('')}</div>`;
  }
  const onCellInput = event => {
    const cell = event.target.closest('input[data-row]');
    if (!cell) return;
    // Reconstruct every cell, including an invalid/blank edit, so the main form reports it.
    const cells = [...grid.querySelectorAll('input[data-row]')], board = [];
    for (const item of cells) {
      const row = Number(item.dataset.row), column = Number(item.dataset.column);
      if (!board[row]) board[row] = [];
      board[row][column] = item.value;
    }
    boardInput.value = JSON.stringify(board);
  };
  const onLoad = () => {
    // Keep a blank or invalid cell editable after the common loader reports it.
    try { parseBoard(boardInput.value); }
    catch { return; }
    refreshEditor();
  };
  grid.addEventListener('input', onCellInput);
  boardInput.addEventListener('input', refreshEditor);
  form.addEventListener('submit', onLoad);
  refreshEditor();
  return () => {
    disposePlayback();
    grid.removeEventListener('input', onCellInput);
    boardInput.removeEventListener('input', refreshEditor);
    form.removeEventListener('submit', onLoad);
  };
}
