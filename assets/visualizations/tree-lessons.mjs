import {escape, integer, mountSequencePlayback} from './sequence-playback.mjs';
import {buildTree} from '../data-structures/trees/model.mjs';

const LIMIT = 16;
const format = value => value === -Infinity ? '−∞' : String(value);
const valueOf = (nodes, id) => id === null || id === undefined ? 'null' : nodes[id].value;
const edgeKey = (parent, child) => `${parent}:${child}`;
const copyNodes = nodes => nodes.map(node => ({...node}));

function immutable(value) {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.values(value).forEach(immutable);
    Object.freeze(value);
  }
  return value;
}

function jsonArray(text, label, nullable = false) {
  let values;
  try { values = JSON.parse(text); }
  catch { throw Error(`${label} must be a JSON array, such as ${nullable ? '[3,9,20,null,null,15,7]' : '[3,9,20,15,7]'}.`); }
  if (!Array.isArray(values) || values.some(value => !(nullable && value === null) && (!Number.isInteger(value) || value < -999 || value > 999))) {
    throw Error(`${label} must contain integers from −999 to 999${nullable ? ' or null' : ''}.`);
  }
  if (values.filter(value => value !== null).length > LIMIT) throw Error(`Use at most ${LIMIT} nodes. Null placeholders do not count.`);
  return values;
}

function parseTree(fields, nonempty = false) {
  const values = jsonArray(fields.tree, 'Tree', true);
  const nodes = buildTree(values);
  if (nonempty && !nodes.length) throw Error('Use a tree with at least one node for this problem.');
  return {nodes, values};
}

function treeSnapshot(nodes, state) {
  return immutable({nodes: copyNodes(nodes), ...state});
}

function positions(nodes) {
  const locations = new Map();
  let order = 0, maxDepth = 0;
  function visit(id, depth) {
    if (id === null || id === undefined) return;
    visit(nodes[id].left, depth + 1);
    locations.set(id, {x: 48 + order++ * 72, y: 48 + depth * 88});
    maxDepth = Math.max(maxDepth, depth);
    visit(nodes[id].right, depth + 1);
  }
  if (nodes.length) visit(0, 0);
  return {locations, width: Math.max(480, nodes.length * 72 + 24), height: Math.max(140, maxDepth * 88 + 112)};
}

function pathEdges(nodes, path) {
  const edges = new Set();
  for (let i = 1; i < path.length; i++) {
    const a = path[i - 1], b = path[i];
    const parent = nodes[a].left === b || nodes[a].right === b ? a : b;
    edges.add(edgeKey(parent, parent === a ? b : a));
  }
  return edges;
}

function drawTree(frame) {
  const nodes = frame.nodes;
  if (!nodes.length) return '<div class="tree-lesson-empty">Empty tree</div>';
  const {locations, width, height} = positions(nodes);
  const visible = new Set(frame.visibleIds || nodes.map(node => node.id));
  const visited = new Set(frame.visited || []), queued = new Set((frame.queue || []).map(item => item.id));
  const stack = new Set((frame.stack || []).map(call => call.id).filter(id => id !== null));
  const best = new Set(frame.bestPath || []), candidate = new Set(frame.candidatePath || []);
  const bestEdges = pathEdges(nodes, frame.bestPath || []), candidateEdges = pathEdges(nodes, frame.candidatePath || []);
  const attached = frame.attachedEdges ? new Set(frame.attachedEdges) : null;
  let drawing = '';
  for (const node of nodes) {
    if (!visible.has(node.id)) continue;
    for (const child of [node.left, node.right]) {
      if (child === null || !visible.has(child)) continue;
      const a = locations.get(node.id), b = locations.get(child), key = edgeKey(node.id, child);
      drawing += `<line class="tree-lesson-edge ${attached && !attached.has(key) ? 'pending' : ''} ${bestEdges.has(key) ? 'best' : ''} ${candidateEdges.has(key) ? 'candidate' : ''}" x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}"/>`;
    }
  }
  for (const node of nodes) {
    if (!visible.has(node.id)) continue;
    const {x, y} = locations.get(node.id);
    const target = (frame.targets || []).filter(item => item.id === node.id).map(item => item.label).join('/');
    const current = node.id === frame.current, result = node.id === frame.result;
    const classes = ['tree-lesson-node', visited.has(node.id) ? 'visited' : '', queued.has(node.id) ? 'queued' : '', stack.has(node.id) ? 'in-stack' : '', best.has(node.id) ? 'best' : '', current ? 'current' : '', result ? 'result' : ''].filter(Boolean).join(' ');
    drawing += `<g ${current ? 'data-follow' : ''} class="${classes}" transform="translate(${x} ${y})"><circle r="23"/>${target ? '<circle class="target-ring" r="28"/>' : ''}${candidate.has(node.id) ? '<circle class="candidate-ring" r="32"/>' : ''}<text class="tree-lesson-value" y="5">${escape(node.value)}</text>`;
    const label = [target, result ? 'LCA' : current ? 'current' : queued.has(node.id) ? 'queued' : ''].filter(Boolean).join(' · ');
    if (label) drawing += `<text class="tree-lesson-label" y="-34">${escape(label)}</text>`;
    if (frame.gains && Object.hasOwn(frame.gains, node.id)) drawing += `<text class="tree-lesson-gain" y="44">gain ${escape(format(frame.gains[node.id]))}</text>`;
    drawing += '</g>';
  }
  const describeChild = (node, child) => child === null || !visible.has(child) ? 'null' : attached && !attached.has(edgeKey(node.id, child)) ? `${valueOf(nodes, child)} awaiting subtree return` : valueOf(nodes, child);
  const structure = nodes.filter(node => visible.has(node.id)).map(node => `${node.value}: left ${describeChild(node, node.left)}, right ${describeChild(node, node.right)}`).join('; ');
  return `<div class="svg-scroll tree-lesson-scroll"><svg class="tree-lesson-svg" viewBox="0 0 ${width} ${height}" style="min-width:${width}px" role="img" aria-label="${escape(`Tree. ${structure}. ${frame.message}`)}">${drawing}</svg></div>`;
}

function statePanel(title, content) {
  return `<div class="tree-lesson-state"><h4>${escape(title)}</h4>${content}</div>`;
}

function chips(items, label) {
  return items.length ? `<ol class="tree-lesson-chips" aria-label="${escape(label)}">${items.map(item => `<li>${escape(item)}</li>`).join('')}</ol>` : '<p class="hint">Empty</p>';
}

function renderStack(frame) {
  if (!frame.stack) return '';
  return statePanel('Recursive calls · oldest to newest', chips(frame.stack.map(call => call.label), 'Recursive call stack, oldest call first'));
}

function renderTreeFrame(frame) {
  let panels = '';
  if (frame.queue) panels += statePanel('Queue · front to back', chips(frame.queue.map((item, i) => `${i === 0 ? 'front · ' : ''}${valueOf(frame.nodes, item.id)} (level ${item.level})`), 'Queue, front first'));
  if (frame.currentValues) panels += statePanel(`Values for level ${frame.level}`, `<p class="tree-lesson-mono">${escape(JSON.stringify(frame.currentValues))}</p>`);
  if (frame.answer) panels += statePanel('Completed levels', `<p class="tree-lesson-mono">${escape(JSON.stringify(frame.answer))}</p>`);
  panels += renderStack(frame);
  if (frame.rows) panels += `<div class="height-table svg-scroll"><table><caption>${escape(frame.caption)}</caption><thead><tr>${frame.columns.map(column => `<th scope="col">${escape(column)}</th>`).join('')}</tr></thead><tbody>${frame.rows.map(row => `<tr>${row.map(cell => `<td>${escape(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  if (frame.bestPath?.length) panels += statePanel('Best path so far', `<p class="tree-lesson-mono">${escape(frame.bestPath.map(id => valueOf(frame.nodes, id)).join(' → '))}</p>`);
  return `${drawTree(frame)}<div class="tree-lesson-panels">${panels}</div>`;
}

function lcaInput(fields) {
  const input = parseTree(fields, true);
  const values = input.nodes.map(node => node.value);
  if (new Set(values).size !== values.length) throw Error('A BST needs unique node values in this visualization.');
  function valid(id, low, high) {
    if (id === null) return true;
    const node = input.nodes[id];
    return node.value > low && node.value < high && valid(node.left, low, node.value) && valid(node.right, node.value, high);
  }
  if (!valid(0, -Infinity, Infinity)) throw Error('The tree must be a BST: every left subtree value is smaller and every right subtree value is larger.');
  const p = integer(fields.p, -999, 999, 'p'), q = integer(fields.q, -999, 999, 'q');
  if (!values.includes(p) || !values.includes(q)) throw Error('Both p and q must be values present in the BST.');
  return {...input, p, q};
}

function lcaTrace(input) {
  const {nodes} = input, frames = [], visited = [], stack = [];
  let p = input.p, q = input.q;
  const targets = [{id: nodes.find(node => node.value === p).id, label: 'p'}, {id: nodes.find(node => node.value === q).id, label: 'q'}];
  const add = (message, current = null, result = null) => frames.push(treeSnapshot(nodes, {message, current, result, targets: targets.map(item => ({...item})), visited: [...visited], stack: stack.map(call => ({...call})), stats: [['p / q', `${p} / ${q}`], ['Current node', valueOf(nodes, current)], ['Active recursive calls', stack.length], ['Result', result === null ? '—' : valueOf(nodes, result)]]}));
  add('Find the first node where the targets split, or where the node itself is a target.');
  if (p > q) {
    [p, q] = [q, p];
    targets[0].label = 'q'; targets[1].label = 'p';
    add(`p is larger than q. Swap the references so p = ${p} and q = ${q}.`);
  }
  let id = 0, resultId = null;
  while (id !== null) {
    const node = nodes[id];
    stack.push({id, label: `lowestCommonAncestor(${node.value}, ${p}, ${q})`});
    visited.push(id);
    add(`Compare p = ${p} and q = ${q} with node ${node.value}.`, id);
    if (p < node.value && node.value < q) { resultId = id; add(`${p} < ${node.value} < ${q}. The targets are on opposite sides, so return ${node.value}.`, id, id); break; }
    if (node.value > p && node.value > q) { add(`Both targets are smaller than ${node.value}. Recursively search the left subtree.`, id); id = node.left; }
    else if (node.value < p && node.value < q) { add(`Both targets are larger than ${node.value}. Recursively search the right subtree.`, id); id = node.right; }
    else { resultId = id; add(`Node ${node.value} is a target. It is an ancestor of the other target, so return ${node.value}.`, id, id); break; }
  }
  while (stack.length) {
    stack.pop();
    if (stack.length) add(`The recursive call returns ${valueOf(nodes, resultId)}. Return the same ancestor through the call at ${valueOf(nodes, stack.at(-1).id)}.`, stack.at(-1).id, resultId);
  }
  add(`The search is complete. Return lowest common ancestor ${valueOf(nodes, resultId)}.`, resultId, resultId);
  return frames;
}

export function mountLca(root) {
  return mountSequencePlayback(root, {
    id: 'bst-lca', description: 'Follow the recursive BST comparisons in the Python solution.',
    inputs: [{key: 'tree', label: 'BST · compact level order', value: '[6,2,8,0,4,7,9,null,null,3,5]'}, {key: 'p', label: 'Target p', value: '2', type: 'number'}, {key: 'q', label: 'Target q', value: '8', type: 'number'}],
    hint: 'Use up to 16 unique integers from −999 to 999; null marks a missing child. Both targets must be in the BST.',
    legend: 'Current label and thick outline: current node. Double ring and p/q label: targets. Filled node and LCA label: lowest common ancestor. The call stack shows the search route.',
    parse: lcaInput, modes: [{label: 'Recursive BST search', trace: lcaTrace}], render: renderTreeFrame
  });
}

function levelOrderTrace(input) {
  const {nodes} = input, frames = [], queue = [], visited = [], answer = [];
  let level = 0, current = null, currentValues = [];
  const add = message => frames.push(treeSnapshot(nodes, {message, current, queue: queue.map(item => ({...item})), visited: [...visited], level, currentValues: [...currentValues], answer: answer.map(values => [...values]), stats: [['curr_level', level], ['Queue length', queue.length], ['Visited nodes', visited.length], ['Completed levels', answer.length]]}));
  add('Start with an empty answer. The queue stores each node together with its level.');
  if (!nodes.length) { add('The root is missing. Return the empty answer [].'); return frames; }
  queue.push({id: 0, level: 0});
  add(`Enqueue root ${nodes[0].value} at level 0.`);
  while (queue.length) {
    currentValues = [];
    add(`Start curr_level = ${level}. Read nodes while the front of the queue has this level.`);
    while (queue.length && queue[0].level === level) {
      const item = queue.shift(); current = item.id;
      const node = nodes[current]; visited.push(current);
      add(`Pop (${node.value}, ${item.level}) from the front of the queue.`);
      currentValues.push(node.value);
      add(`Append ${node.value} to curr_level_values.`);
      for (const side of ['left', 'right']) {
        if (node[side] !== null) {
          queue.push({id: node[side], level: item.level + 1});
          add(`Enqueue ${side} child ${valueOf(nodes, node[side])} at level ${item.level + 1}.`);
        }
      }
    }
    answer.push([...currentValues]);
    add(`The current level is complete. Append ${JSON.stringify(currentValues)} to answer.`);
    level++;
    current = null;
  }
  currentValues = [];
  add(`The queue is empty. Return ${JSON.stringify(answer)}.`);
  return frames;
}

export function mountLevelOrder(root) {
  return mountSequencePlayback(root, {
    id: 'tree-level-order', description: 'Watch the queue of (node, level) pairs process one level at a time.',
    inputs: [{key: 'tree', label: 'Tree · compact level order', value: '[3,9,20,null,null,15,7]'}],
    hint: 'Use up to 16 integers from −999 to 999; null marks a missing child. [] is an empty tree.',
    legend: 'Thick outline and current label: node just popped. Dashed outline and queued label: node waiting in the queue. Completed levels appear below the diagram.',
    parse: fields => parseTree(fields), modes: [{label: 'Queue with level numbers', trace: levelOrderTrace}], render: renderTreeFrame
  });
}

function traversalInput(fields) {
  const preorder = jsonArray(fields.preorder, 'Preorder'), inorder = jsonArray(fields.inorder, 'Inorder');
  if (preorder.length !== inorder.length) throw Error('Preorder and inorder must have the same number of values.');
  if (new Set(preorder).size !== preorder.length || new Set(inorder).size !== inorder.length) throw Error('Traversal values must be unique so the inorder index map identifies one position per value.');
  const indices = new Map(inorder.map((value, index) => [value, index]));
  if (preorder.some(value => !indices.has(value))) throw Error('Preorder and inorder must contain exactly the same values.');
  const nodes = [];
  let pi = 0;
  function construct(left, right) {
    if (left > right) return null;
    const value = preorder[pi], index = indices.get(value);
    if (index === undefined || index < left || index > right) throw Error('These traversals cannot describe the same binary tree. The next preorder root must lie inside its current inorder range.');
    const id = pi++;
    nodes.push({id, value, left: null, right: null});
    nodes[id].left = construct(left, index - 1);
    nodes[id].right = construct(index + 1, right);
    return id;
  }
  construct(0, inorder.length - 1);
  return {nodes, preorder, inorder, indices};
}

function buildTrace(input) {
  const {nodes, preorder, inorder, indices} = input, frames = [], visibleIds = [], attachedEdges = [], stack = [];
  let pi = 0;
  const add = (message, current = null, bounds = null, index = null) => frames.push(treeSnapshot(nodes, {message, current, visibleIds: [...visibleIds], attachedEdges: [...attachedEdges], stack: stack.map(call => ({...call})), preorderIndex: pi, inorderLeft: bounds?.[0], inorderRight: bounds?.[1], inorderIndex: index, stats: [['Next preorder index · pi', pi], ['Inorder range · l…r', bounds ? `${bounds[0]}…${bounds[1]}` : '—'], ['Root inorder index · idx', index ?? '—'], ['Created nodes', visibleIds.length]]}));
  add('Build the inorder index map. Start pi at 0; preorder supplies each new subtree root.');
  function visit(left, right) {
    const call = {id: null, label: `buildTree_(l=${left}, r=${right})`};
    stack.push(call);
    if (left > right) {
      add(`l = ${left} is greater than r = ${right}. Return None for this empty subtree.`, null, [left, right]);
      stack.pop(); return null;
    }
    const id = pi, node = nodes[id], index = indices.get(node.value);
    pi++; visibleIds.push(id); call.id = id; call.label += ` · root ${node.value}`;
    add(`Create root ${node.value} from preorder[${pi - 1}], then increment pi to ${pi}.`, id, [left, right], index);
    add(`indices[${node.value}] = ${index}. Build the left range ${left}…${index - 1} before the right range ${index + 1}…${right}.`, id, [left, right], index);
    const leftId = visit(left, index - 1);
    if (leftId !== null) attachedEdges.push(edgeKey(id, leftId));
    add(`The left call returns ${valueOf(nodes, leftId)}. Assign it to ${node.value}.left.`, id, [left, right], index);
    const rightId = visit(index + 1, right);
    if (rightId !== null) attachedEdges.push(edgeKey(id, rightId));
    add(`The right call returns ${valueOf(nodes, rightId)}. Assign it to ${node.value}.right.`, id, [left, right], index);
    add(`Both children are assigned. Return subtree root ${node.value}.`, id, [left, right], index);
    stack.pop(); return id;
  }
  const result = visit(0, inorder.length - 1);
  add(result === null ? 'The traversals are empty. Return None.' : `Construction is complete. Return tree root ${valueOf(nodes, result)}.`);
  return frames;
}

function traversalRow(values, title, index, left = null, right = null, consumed = false) {
  return statePanel(title, `<div class="svg-scroll"><ol class="tree-traversal-values" aria-label="${escape(title)}">${values.map((value, i) => `<li class="${i === index ? 'at-pointer' : ''} ${left !== null && i >= left && i <= right ? 'in-range' : ''} ${consumed && i < index ? 'consumed' : ''}"><span>${i}</span><strong>${value}</strong><span>${i === index ? consumed ? 'pi' : 'idx' : '·'}</span></li>`).join('')}</ol>${values.length ? '' : '<p class="hint">Empty traversal</p>'}</div>`);
}

function renderBuild(frame, input) {
  return `${drawTree(frame)}<div class="tree-lesson-panels">${traversalRow(input.preorder, 'Preorder · pi points to the next root', frame.preorderIndex, null, null, true)}${traversalRow(input.inorder, 'Inorder · highlighted range belongs to the current call', frame.inorderIndex, frame.inorderLeft ?? null, frame.inorderRight ?? null)}${renderStack(frame)}</div>`;
}

export function mountBuildTree(root) {
  return mountSequencePlayback(root, {
    id: 'tree-from-traversals', description: 'Build the tree in preorder using the inorder index map and inclusive subtree ranges.',
    inputs: [{key: 'preorder', label: 'Preorder', value: '[3,9,20,15,7]'}, {key: 'inorder', label: 'Inorder', value: '[9,3,15,20,7]'}],
    hint: 'Use up to 16 unique integers from −999 to 999 in each traversal. Both arrays must describe the same tree; [] and [] build an empty tree.',
    legend: 'Current label and thick outline: current root. Highlighted inorder cells: current l…r range. Dashed edge: the child subtree call has not returned for assignment. The completed tree stays visible.',
    parse: traversalInput, modes: [{label: 'Inorder map and shared preorder index', trace: buildTrace}], render: renderBuild
  });
}

function maxPathTrace(input) {
  const {nodes} = input, frames = [], stack = [], visited = [], gains = {};
  let maxsum = -Infinity, bestPath = [];
  const add = (message, current = null, calculation = {}) => frames.push(treeSnapshot(nodes, {message, current, visited: [...visited], gains: {...gains}, stack: stack.map(call => ({...call})), bestPath: [...bestPath], candidatePath: [...(calculation.path || [])], rows: calculation.rows?.map(row => [...row]), caption: 'Candidates evaluated at the current node', columns: ['Path choice', 'Expression', 'Sum'], stats: [['Current node', valueOf(nodes, current)], ['Left return', calculation.left === undefined ? '—' : format(calculation.left)], ['Right return', calculation.right === undefined ? '—' : format(calculation.right)], ['Return to parent · ret_val', calculation.ret === undefined ? '—' : format(calculation.ret)], ['Best path sum · maxsum', format(maxsum)]]}));
  add('Start maxsum at −∞. A missing child also returns −∞ in this Python implementation.');
  function dfs(id, parent = null, side = '') {
    if (id === null) {
      stack.push({id: null, label: `dfs(None) · ${side} of ${valueOf(nodes, parent)}`});
      add(`The ${side} child of ${valueOf(nodes, parent)} is missing. Return −∞.`);
      stack.pop(); return {gain: -Infinity, path: []};
    }
    const node = nodes[id]; stack.push({id, label: `dfs(${node.value})`});
    add(`Enter dfs(${node.value}). Compute the left return, then the right return.`, id);
    const left = dfs(node.left, id, 'left');
    add(`The left call returns ${format(left.gain)} to node ${node.value}.`, id, {left: left.gain});
    const right = dfs(node.right, id, 'right');
    add(`The right call returns ${format(right.gain)} to node ${node.value}.`, id, {left: left.gain, right: right.gain});
    const returns = [node.value, node.value + left.gain, node.value + right.gain];
    const ret = Math.max(...returns), returnChoice = returns.indexOf(ret);
    const returnPath = returnChoice === 0 ? [id] : [id, ...(returnChoice === 1 ? left.path : right.path)];
    const candidates = [node.value + left.gain + right.gain, ...returns];
    const currMax = Math.max(...candidates), choice = candidates.indexOf(currMax);
    const path = choice === 0 ? [...left.path].reverse().concat(id, right.path) : choice === 1 ? [id] : [id, ...(choice === 2 ? left.path : right.path)];
    const rows = [
      ['Left + node + right', `${node.value} + ${format(left.gain)} + ${format(right.gain)}`, format(candidates[0])],
      ['Node only', String(node.value), format(candidates[1])],
      ['Node + left', `${node.value} + ${format(left.gain)}`, format(candidates[2])],
      ['Node + right', `${node.value} + ${format(right.gain)}`, format(candidates[3])]
    ];
    add(`ret_val = max(node, node + left, node + right) = ${ret}. A return to the parent can use at most one child.`, id, {left: left.gain, right: right.gain, ret, rows, path: returnPath});
    const improves = currMax > maxsum;
    if (improves) { maxsum = currMax; bestPath = [...path]; }
    gains[id] = ret; visited.push(id);
    add(`curr_max = ${currMax}. ${improves ? `Update maxsum to ${maxsum}.` : `Keep maxsum = ${maxsum}.`} Return ${ret} to the parent.`, id, {left: left.gain, right: right.gain, ret, rows, path});
    stack.pop(); return {gain: ret, path: returnPath};
  }
  dfs(0);
  add(`All recursive calls have returned. The maximum path sum is ${maxsum}.`);
  return frames;
}

export function mountMaxPath(root) {
  return mountSequencePlayback(root, {
    id: 'tree-max-path', description: 'Follow the postorder returns and compare the four path choices at every node.',
    inputs: [{key: 'tree', label: 'Tree · compact level order', value: '[-10,9,20,null,null,15,7]'}],
    hint: 'Use 1 to 16 integers from −999 to 999; null marks a missing child. Negative values are allowed, including a tree with all negative values.',
    legend: 'Current label and thick outline: current node. Gain below a node: value returned to its parent. Dashed rings and edges: current candidate path. Thick solid path: best path found so far. Missing children return −∞.',
    parse: fields => parseTree(fields, true), modes: [{label: 'Postorder with explicit path candidates', trace: maxPathTrace}], render: renderTreeFrame
  });
}
