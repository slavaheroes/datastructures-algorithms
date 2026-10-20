import {escape, integer, mountSequencePlayback} from './sequence-playback.mjs';

const MAX_FRAMES = 2400;
const compare = (a, b) => a < b ? -1 : a > b ? 1 : 0;
const tupleCompare = (a, b) => {
  for (let i = 0; i < Math.min(a.length, b.length); i++) {
    const order = compare(a[i], b[i]);
    if (order) return order;
  }
  return compare(a.length, b.length);
};
const show = value => value === Infinity ? '∞' : String(value);
const section = (title, columns, rows) => ({title, columns, rows});

function json(text, label) {
  if (text.length > 4096) throw Error(`${label} must be at most 4,096 characters.`);
  try { return JSON.parse(text); }
  catch { throw Error(`${label} must be valid JSON.`); }
}

function recorder() {
  const frames = [];
  return {frames, save(frame) {
    if (frames.length >= MAX_FRAMES) throw Error(`This input exceeds ${MAX_FRAMES.toLocaleString('en-US')} playback steps. Use fewer edges, tickets, or stops to see the complete trace in every version.`);
    frames.push(structuredClone(frame));
  }};
}

function renderGraph(frame, input, prefix) {
  const width = 590, height = 490, positions = new Map(), spatial = Boolean(input.points);
  if (spatial) {
    const xs = input.points.map(p => p[0]), ys = input.points.map(p => p[1]);
    const minX = Math.min(...xs) - 1, maxX = Math.max(...xs) + 1, minY = Math.min(...ys) - 1, maxY = Math.max(...ys) + 1;
    input.points.forEach(([x, y], id) => positions.set(id, {x: 65 + (x - minX) / (maxX - minX) * 460, y: 410 - (y - minY) / (maxY - minY) * 340}));
  } else {
    frame.nodes.forEach((node, i) => {
      const angle = -Math.PI / 2 + i / Math.max(1, frame.nodes.length) * 2 * Math.PI;
      positions.set(node.id, frame.nodes.length === 1 ? {x: 295, y: 245} : {x: 295 + Math.cos(angle) * 212, y: 265 + Math.sin(angle) * 165});
    });
  }
  const marker = `${prefix}-arrow`, active = new Set(frame.activeEdges || []), chosen = new Set(frame.chosenEdges || []), done = new Set(frame.doneNodes || []), frontier = new Set(frame.frontierNodes || []);
  let drawing = spatial ? '<path class="ag-axis" d="M35 30V440H565"/><text class="ag-axis-label" x="552" y="460">x →</text><text class="ag-axis-label" x="25" y="25">y ↑</text>' : '';
  const drawnEdges = frame.edges || input.edges || [];
  drawnEdges.forEach((edge, index) => {
    const from = positions.get(edge.from), to = positions.get(edge.to);
    if (!from || !to) return;
    const dx = to.x - from.x, dy = to.y - from.y, length = Math.hypot(dx, dy) || 1;
    const x1 = from.x + dx / length * 25, y1 = from.y + dy / length * 25, x2 = to.x - dx / length * 29, y2 = to.y - dy / length * 29;
    const similar = drawnEdges.filter(e => e.from === edge.from && e.to === edge.to), offset = similar.findIndex(e => e.id === edge.id);
    const reverse = drawnEdges.some(e => e.from === edge.to && e.to === edge.from);
    const bend = spatial ? 0 : (reverse ? 26 : 0) + (offset - (similar.length - 1) / 2) * 30;
    const cx = (x1 + x2) / 2 - dy / length * bend, cy = (y1 + y2) / 2 + dx / length * bend;
    const edgeClass = `ag-edge ${active.has(edge.id) ? 'current' : ''} ${chosen.has(edge.id) ? 'chosen' : ''} ${edge.used ? 'consumed' : ''}`;
    const path = edge.from === edge.to ? `M${from.x - 12} ${from.y - 20} C${from.x - 70} ${from.y - 95},${from.x + 70} ${from.y - 95},${from.x + 15} ${from.y - 20}` : `M${x1} ${y1}Q${cx} ${cy} ${x2} ${y2}`;
    drawing += `<path class="${edgeClass}" d="${path}" ${spatial ? '' : `marker-end="url(#${marker})"`}/>`;
    if (edge.label !== undefined) {
      const lx = edge.from === edge.to ? from.x : (x1 + 2 * cx + x2) / 4, ly = edge.from === edge.to ? from.y - 74 : (y1 + 2 * cy + y2) / 4 - 6;
      drawing += `<text class="ag-edge-label ${active.has(edge.id) ? 'current' : ''}" x="${lx}" y="${ly}">${escape(edge.label)}</text>`;
    }
  });
  for (const node of frame.nodes) {
    const {x, y} = positions.get(node.id), current = node.id === frame.current;
    drawing += `<g class="ag-node ${done.has(node.id) ? 'done' : ''} ${frontier.has(node.id) ? 'frontier' : ''} ${current ? 'current' : ''}" transform="translate(${x} ${y})" ${current ? 'data-follow' : ''}><circle r="24"/><text y="4">${escape(node.label ?? node.id)}</text>${node.meta !== undefined ? `<text class="ag-node-meta" y="42">${escape(node.meta)}</text>` : ''}<title>${escape(`${node.label ?? node.id}${done.has(node.id) ? ', finished or in tree' : ''}${current ? ', current' : ''}`)}</title></g>`;
  }
  return `<div class="svg-scroll ag-canvas"><svg class="ag-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="${escape(frame.graphLabel || 'Graph with current algorithm state')}"><defs><marker id="${marker}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z"/></marker></defs>${drawing}</svg></div>`;
}

function renderFrame(frame, input, prefix) {
  return renderGraph(frame, input, prefix) + (frame.sections || []).map(table => `<div class="height-table svg-scroll ag-state"><table><caption>${escape(table.title)}</caption><thead><tr>${table.columns.map(c => `<th scope="col">${escape(c)}</th>`).join('')}</tr></thead><tbody>${table.rows.length ? table.rows.map(row => `<tr>${row.map(value => `<td>${escape(show(value))}</td>`).join('')}</tr>`).join('') : `<tr><td colspan="${table.columns.length}">Empty</td></tr>`}</tbody></table></div>`).join('');
}

function mount(root, config) {
  return mountSequencePlayback(root, {...config, render: (frame, input) => renderFrame(frame, input, config.id)});
}

function parseTickets(fields) {
  const tickets = json(fields.tickets, 'Tickets');
  if (!Array.isArray(tickets) || tickets.length > 12 || tickets.some(pair => !Array.isArray(pair) || pair.length !== 2 || pair.some(airport => typeof airport !== 'string' || !/^[A-Z]{3}$/.test(airport)))) throw Error('Use at most 12 ["FROM","TO"] tickets with three uppercase letters per airport.');
  const ids = [...new Set(['JFK', ...tickets.flat()])];
  if (ids.length > 16) throw Error('Use at most 16 distinct airports, including JFK.');
  const balance = new Map(ids.map(id => [id, 0])), adjacency = new Map(ids.map(id => [id, []]));
  for (const [from, to] of tickets) { balance.set(from, balance.get(from) + 1); balance.set(to, balance.get(to) - 1); adjacency.get(from).push(to); }
  const seen = new Set(), work = ['JFK'];
  while (work.length) { const node = work.pop(); if (seen.has(node)) continue; seen.add(node); work.push(...adjacency.get(node)); }
  const differences = [...balance].filter(([, value]) => value !== 0);
  const balanced = !differences.length || differences.length === 2 && balance.get('JFK') === 1 && differences.some(([, value]) => value === -1);
  if (!balanced || seen.size !== ids.length) throw Error('Tickets must allow a trip starting at JFK that uses every ticket exactly once. Check directed connectivity and airport arrival/departure counts.');
  const input = {nodes: ids.map(id => ({id, label: id})), edges: tickets.map(([from, to], id) => ({id, from, to, label: `#${id}`}))};
  return input;
}

function itineraryTrace(input, backtracking = false) {
  // Match Python's stable sort: identical tickets retain their original order.
  const {frames, save} = recorder(), sorted = [...input.edges].sort((a, b) => tupleCompare([a.from, a.to], [b.from, b.to]) * (backtracking ? 1 : -1));
  const adjacency = new Map(input.nodes.map(node => [node.id, []]));
  for (const edge of sorted) adjacency.get(edge.from).push(edge);
  const used = new Set(), route = ['JFK'], result = [], stackEdges = [];
  function state(message, current = route.at(-1), active = []) {
    save({message, nodes: input.nodes, edges: input.edges.map(edge => ({...edge, used: used.has(edge.id)})), current, activeEdges: active, stats: [['Tickets consumed', `${used.size} / ${input.edges.length}`], [backtracking ? 'Route airports' : 'Stack size', route.length], ['Version', backtracking ? 'Ticket DFS' : 'Hierholzer']], sections: [section(backtracking ? 'Current route · may backtrack' : 'Traversal stack · bottom to top', ['Position', 'Airport'], route.map((airport, index) => [index, airport])), section(backtracking ? 'Ticket flags · distinct duplicate tickets stay separate' : 'Tickets · adjacency pops consume edges', ['Ticket', 'Flight', 'Used'], input.edges.map(edge => [`#${edge.id}`, `${edge.from} → ${edge.to}`, used.has(edge.id) ? 'True' : 'False'])), section(backtracking ? 'Completed answer' : 'Finishing order · reverse at the end', ['Position', 'Airport'], result.map((airport, index) => [index, airport]))]});
  }
  state(backtracking ? 'Sort tickets forward. Start the route at JFK and try unused tickets in lexical order.' : 'Reverse-sort tickets. Start the traversal stack at JFK; its adjacency list will pop the smallest destination.');
  if (backtracking) {
    function dfs(node) {
      if (route.length === input.edges.length + 1) { result.push(...route); state('The route contains E + 1 airports. Every ticket is used; return True through all active calls.', node); return true; }
      for (const edge of adjacency.get(node)) {
        if (used.has(edge.id)) continue;
        used.add(edge.id); route.push(edge.to);
        state(`Choose ticket #${edge.id}: ${edge.from} → ${edge.to}. Mark it used and recurse.`, edge.to, [edge.id]);
        if (dfs(edge.to)) return true;
        used.delete(edge.id); route.pop();
        state(`That branch cannot use every ticket. Clear flag #${edge.id}, remove ${edge.to}, and try the next outgoing ticket.`, node, [edge.id]);
      }
      state(`No unused outgoing choice at ${node} completes the trip; return to the preceding call.`, node);
      return false;
    }
    dfs('JFK');
    state(`Return ${JSON.stringify(result)}. The first complete DFS route is lexicographically smallest.`);
  } else {
    while (route.length) {
      const node = route.at(-1), next = adjacency.get(node).pop();
      if (next) {
        used.add(next.id); route.push(next.to); stackEdges.push(next.id);
        state(`Pop the smallest destination from ${node}: consume ticket #${next.id} and push ${next.to}.`, next.to, [next.id]);
      } else {
        result.push(route.pop());
        const edgeId = stackEdges.pop();
        state(`${node} has no outgoing tickets left. Pop it from the stack and append it to finishing order.`, node, edgeId === undefined ? [] : [edgeId]);
      }
    }
    state(`Reverse finishing order and return ${JSON.stringify([...result].reverse())}.`, null);
    frames.at(-1).sections.push(section('Returned itinerary', ['Position', 'Airport'], [...result].reverse().map((airport, index) => [index, airport])));
  }
  return frames;
}

export function mountItinerary(root) {
  return mount(root, {id: 'reconstruct-itinerary', description: 'Edit flight tickets and watch both stored solutions consume individual directed edges from JFK. Ticket numbers distinguish duplicates.', inputs: [{key: 'tickets', label: 'Tickets · JSON airport pairs', value: '[["JFK","SFO"],["JFK","ATL"],["SFO","ATL"],["ATL","JFK"],["ATL","SFO"]]'}], hint: 'Up to 12 tickets and 16 airports including JFK. Airports use three uppercase letters. Inputs must admit a valid itinerary from JFK. Each trace is limited to 2,400 steps; use fewer tickets if the backtracking search exceeds the limit.', legend: 'Arrow: flight direction. # number: original ticket. Orange: current airport/edge. Dashed edge: consumed ticket; backtracking restores it. Tables distinguish stack, finishing order, and returned route.', parse: parseTickets, modes: [{label: 'Hierholzer · stack and reversed finish', trace: input => itineraryTrace(input)}, {label: 'Initial solution · ticket backtracking', trace: input => itineraryTrace(input, true)}]});
}

function parseWords(fields) {
  const words = json(fields.words, 'Words');
  if (!Array.isArray(words) || words.length > 12 || words.some(word => typeof word !== 'string' || !/^[a-z]{1,12}$/.test(word))) throw Error('Use at most 12 words of 1–12 lowercase letters. [] represents no words.');
  const ids = [...new Set(words.join(''))];
  if (ids.length > 16) throw Error('Use at most 16 distinct letters (graph nodes).');
  return {words, nodes: ids.map(id => ({id, label: id}))};
}

function alienTrace(input) {
  const {frames, save} = recorder(), edges = [], adjacency = new Map(input.nodes.map(node => [node.id, new Set()])), indegree = new Map(input.nodes.map(node => [node.id, 0])), queue = [], output = [];
  let comparing = null;
  function state(message, current = null, active = []) {
    save({message, nodes: input.nodes.map(node => ({...node, meta: `in ${indegree.get(node.id)}`})), edges, current, activeEdges: active, doneNodes: output, frontierNodes: queue, stats: [['Characters', input.nodes.length], ['Constraints', edges.length], ['Output', output.join('') || '(empty)']], sections: [section('Words · adjacent pair under comparison', ['Index', 'Word', 'Comparing'], input.words.map((word, i) => [i, word, comparing?.includes(i) ? 'yes' : ''])), section('Indegrees and emitted characters', ['Letter', 'Indegree', 'Emitted'], input.nodes.map(node => [node.id, indegree.get(node.id), output.includes(node.id) ? 'yes' : 'no'])), section('Queue · front first', ['Position', 'Letter'], queue.map((node, i) => [i, node]))]});
  }
  state('Create one graph node per observed character, each with indegree zero.');
  for (let i = 1; i < input.words.length; i++) {
    comparing = [i - 1, i];
    const previous = input.words[i - 1], word = input.words[i], common = Math.min(previous.length, word.length);
    if (previous.length > word.length && previous.slice(0, common) === word) {
      state(`Invalid prefix: ${previous} appears before its shorter prefix ${word}. Return "" immediately.`); return frames;
    }
    let mismatch = false;
    for (let j = 0; j < common; j++) {
      if (previous[j] === word[j]) continue;
      const from = previous[j], to = word[j]; mismatch = true;
      if (!adjacency.get(from).has(to)) {
        adjacency.get(from).add(to); indegree.set(to, indegree.get(to) + 1);
        const edge = {id: edges.length, from, to}; edges.push(edge);
        state(`First mismatch at index ${j}: ${from} must precede ${to}. Add this edge and increment indegree[${to}]. Ignore later positions.`, from, [edge.id]);
      } else state(`First mismatch again implies ${from} → ${to}. The edge already exists, so do not increment indegree again.`, from, edges.filter(edge => edge.from === from && edge.to === to).map(edge => edge.id));
      break;
    }
    if (!mismatch) state(`No mismatch between ${previous} and ${word}. Their prefix order is valid and creates no edge.`);
  }
  comparing = null;
  for (const node of input.nodes) if (indegree.get(node.id) === 0) queue.push(node.id);
  state('Build the initial queue from all zero-indegree characters, in first-seen order.');
  while (queue.length) {
    const node = queue.shift(); output.push(node);
    state(`Pop ${node} from the queue and append it to the output.`, node);
    for (const neighbor of adjacency.get(node)) {
      indegree.set(neighbor, indegree.get(neighbor) - 1);
      const ready = indegree.get(neighbor) === 0;
      if (ready) queue.push(neighbor);
      state(`Remove constraint ${node} → ${neighbor}: indegree[${neighbor}] becomes ${indegree.get(neighbor)}.${ready ? ' It is now zero, so queue this character.' : ''}`, node, edges.filter(edge => edge.from === node && edge.to === neighbor).map(edge => edge.id));
    }
  }
  state(output.length === input.nodes.length ? `All characters were emitted. Return ${JSON.stringify(output.join(''))}. Other topological orders may also be valid.` : `Queue is empty but only ${output.length} of ${input.nodes.length} characters were emitted. A cycle remains; return "".`);
  return frames;
}

export function mountAlienDictionary(root) {
  return mount(root, {id: 'alien-dictionary', description: 'Edit the sorted word list. Build the character precedence graph from first mismatches, then follow Kahn’s queue and indegrees.', inputs: [{key: 'words', label: 'Words · JSON strings in alien order', value: '["wrt","wrf","er","ett","rftt"]'}], hint: 'Up to 12 words, 1–12 lowercase letters per word, and 16 distinct letters. Cycles and invalid prefixes are accepted so their failure states can be inspected. [] is allowed.', legend: 'Arrow a → b: a must come before b. Node label “in” shows current indegree. Dashed ring: queued. Filled node: emitted. Orange outline/edge: current action. Neighbor insertion order makes this animation repeatable; Python set iteration may choose another valid order.', parse: parseWords, modes: [{label: 'Kahn · indegree queue', trace: alienTrace}]});
}

function parseFlights(fields) {
  const n = integer(fields.n, 1, 16, 'Cities'), src = integer(fields.src, 0, n - 1, 'Source'), dst = integer(fields.dst, 0, n - 1, 'Destination'), k = integer(fields.k, 0, 6, 'Stops');
  const flights = json(fields.flights, 'Flights');
  if (!Array.isArray(flights) || flights.length > 32 || flights.some(edge => !Array.isArray(edge) || edge.length !== 3 || !Number.isInteger(edge[0]) || edge[0] < 0 || edge[0] >= n || !Number.isInteger(edge[1]) || edge[1] < 0 || edge[1] >= n || edge[0] === edge[1] || !Number.isInteger(edge[2]) || edge[2] < 1 || edge[2] > 999)) throw Error(`Use at most 32 [from,to,price] flights; distinct endpoints are cities 0–${n - 1} and prices are 1–999.`);
  const pairs = flights.map(edge => `${edge[0]}:${edge[1]}`);
  if (new Set(pairs).size !== pairs.length) throw Error('Use at most one flight for each directed city pair, as in the original problem.');
  const input = {n, src, dst, k, nodes: Array.from({length: n}, (_, id) => ({id, label: id, meta: id === src && id === dst ? 'src/dst' : id === src ? 'src' : id === dst ? 'dst' : ''})), edges: flights.map(([from, to, price], id) => ({id, from, to, price, label: price}))};
  return input;
}

function cheapestTrace(input, fifo = false) {
  const {frames, save} = recorder(), frontier = [[0, fifo ? 0 : -1, input.src]], best = new Map(), costs = Array(input.n).fill(Infinity), adjacency = new Map(input.nodes.map(node => [node.id, []]));
  for (const edge of input.edges) adjacency.get(edge.from).push(edge);
  costs[input.src] = 0;
  let popped = null, answer = null;
  const depthLabel = fifo ? 'Flights used' : 'Stops';
  function state(message, active = []) {
    const ordered = fifo ? frontier : [...frontier].sort(tupleCompare);
    save({message, nodes: input.nodes, edges: input.edges, current: popped?.[2] ?? null, activeEdges: active, frontierNodes: frontier.map(entry => entry[2]), stats: [['Maximum flights', input.k + 1], ['Frontier entries', frontier.length], ['Current cost', popped ? popped[0] : '—'], ['Answer', answer === null ? 'pending' : answer]], sections: [section(fifo ? 'FIFO queue · front first' : 'Min-heap entries · shown in pop order', ['Price', depthLabel, 'City'], ordered), section(fifo ? 'Global city costs · queued entries retain their own price' : 'best_prices · exact city/stop keys', fifo ? ['City', 'Best price'] : ['City', 'Stops', 'Best price'], fifo ? costs.map((cost, city) => [city, cost]) : [...best.entries()].sort((a, b) => tupleCompare(a[0].split(':').map(Number), b[0].split(':').map(Number))).map(([key, cost]) => [...key.split(':'), cost]))]});
  }
  state(fifo ? 'Start the FIFO queue at (0, 0 flights, src), with cost[src] = 0.' : 'Start the min-heap at (0, −1 stops, src). best_prices is initially empty, matching the saved source.');
  while (frontier.length) {
    if (!fifo) frontier.sort(tupleCompare);
    popped = frontier.shift();
    const [cost, depth, node] = popped;
    state(`Pop price ${cost}, ${depth} ${fifo ? 'flights' : 'stops'}, city ${node}.`);
    if (!fifo && node === input.dst) { answer = cost; state(`This is the cheapest destination entry popped. Return ${answer}.`); return frames; }
    if (fifo && depth > input.k) { state(`This entry already used ${depth} flights. Do not expand it: only ${input.k + 1} flights are permitted.`); continue; }
    for (const edge of adjacency.get(node)) {
      const nextDepth = depth + 1, nextCost = cost + edge.price, key = `${edge.to}:${nextDepth}`;
      if (!fifo && nextDepth > input.k) { state(`Flight ${node} → ${edge.to} would use ${nextDepth} stops, exceeding k = ${input.k}. Skip it.`, [edge.id]); continue; }
      const oldCost = fifo ? costs[edge.to] : best.get(key) ?? Infinity;
      if (nextCost < oldCost) {
        if (fifo) costs[edge.to] = nextCost; else best.set(key, nextCost);
        frontier.push([nextCost, nextDepth, edge.to]);
        state(`Relax ${node} → ${edge.to}: ${cost} + ${edge.price} = ${nextCost} improves ${show(oldCost)}. Save the price and ${fifo ? 'enqueue' : 'push'} this route state.`, [edge.id]);
      } else state(`Inspect ${node} → ${edge.to}: candidate ${nextCost} does not improve ${show(oldCost)}${fifo ? ' for this city' : ` at ${nextDepth} stops`}. Skip it.`, [edge.id]);
    }
  }
  answer = fifo && costs[input.dst] !== Infinity ? costs[input.dst] : -1;
  state(`The ${fifo ? 'queue' : 'heap'} is empty. Return ${answer}${answer === -1 ? ': no route satisfies the stop limit' : ' from the destination cost'}.`);
  return frames;
}

export function mountCheapestFlights(root) {
  return mount(root, {id: 'cheapest-flights', description: 'Edit the directed price graph and stop budget. Compare the saved heap search with the saved FIFO reference, including their different depth counters.', inputs: [{key: 'n', label: 'Cities · includes isolated nodes', value: '4', type: 'number'}, {key: 'flights', label: 'Flights · JSON [from,to,price]', value: '[[0,1,100],[1,2,100],[2,0,100],[1,3,600],[2,3,200]]'}, {key: 'src', label: 'Source city', value: '0', type: 'number'}, {key: 'dst', label: 'Destination city', value: '3', type: 'number'}, {key: 'k', label: 'Maximum intermediate stops', value: '1', type: 'number'}], hint: '1–16 cities numbered 0 through n−1, up to 32 flights with prices 1–999, no duplicate directed pairs or self flights, and 0–6 stops. Isolated cities count toward 16. Each trace is limited to 2,400 steps.', legend: 'Arrow labels: flight prices. Orange: popped city/current flight. Dashed ring: a city has frontier entries. The heap table is displayed in tuple pop order, not internal heap-array order. Repeated city entries represent different route states.', parse: parseFlights, modes: [{label: 'Heap · price by city and stops', trace: input => cheapestTrace(input)}, {label: 'Reference · bounded FIFO relaxation', trace: input => cheapestTrace(input, true)}]});
}

function parsePoints(fields) {
  const points = json(fields.points, 'Points');
  if (!Array.isArray(points) || points.length < 1 || points.length > 16 || points.some(point => !Array.isArray(point) || point.length !== 2 || point.some(value => !Number.isInteger(value) || value < -99 || value > 99))) throw Error('Use 1–16 [x,y] points with integer coordinates from −99 to 99.');
  if (new Set(points.map(point => point.join(':'))).size !== points.length) throw Error('Use distinct coordinates so every point remains visible in the spatial diagram.');
  return {points, nodes: points.map(([x, y], id) => ({id, label: id, meta: `(${x},${y})`}))};
}

function pointTrace(input, optimized = false) {
  const {frames, save} = recorder(), n = input.points.length, visited = new Set(), chosen = [], distances = Array(n).fill(100000000), parents = Array(n).fill(null);
  const distance = (a, b) => Math.abs(input.points[a][0] - input.points[b][0]) + Math.abs(input.points[a][1] - input.points[b][1]);
  const heap = [{cost: 0, node: 0, from: null}], allEdges = [], adjacency = Array.from({length: n}, () => []);
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
    const cost = distance(i, j); allEdges.push({from: i, to: j, cost});
    adjacency[i].push({cost, node: j, from: i}); adjacency[j].push({cost, node: i, from: j});
  }
  let current = null, total = 0;
  function state(message, active = null) {
    const edges = [...chosen.map((edge, i) => ({...edge, id: `chosen-${i}`, label: edge.cost})), ...(active ? [{...active, id: 'candidate', label: active.cost}] : [])];
    save({message, graphLabel: 'Point positions and Manhattan-weighted spanning-tree edges. Straight segments connect points; edge labels give Manhattan costs.', nodes: input.nodes, edges, current, activeEdges: active ? ['candidate'] : [], chosenEdges: chosen.map((edge, i) => `chosen-${i}`), doneNodes: [...visited], frontierNodes: optimized ? [] : heap.map(entry => entry.node), stats: [['Total cost', total], ['Chosen edges', `${chosen.length} / ${n - 1}`], ['Version', optimized ? 'Linear-scan Prim' : 'Heap Prim']], sections: [section('Points and current tree state', optimized ? ['Point', 'Coordinates', 'Visited', 'dist', 'Best from'] : ['Point', 'Coordinates', 'Visited'], input.points.map((point, id) => optimized ? [id, `[${point.join(',')}]`, visited.has(id) ? 'True' : 'False', distances[id] === 100000000 ? 'sentinel' : distances[id], parents[id] ?? '—'] : [id, `[${point.join(',')}]`, visited.has(id) ? 'True' : 'False'])), ...(optimized ? [] : [section('Heap · displayed in (edge cost, destination) pop order', ['Edge cost', 'Destination', 'Connecting from'], [...heap].sort((a, b) => tupleCompare([a.cost, a.node], [b.cost, b.node])).map(entry => [entry.cost, entry.node, entry.from ?? 'start']))]), section('Chosen connections · total cost is their sum', ['From', 'To', 'Manhattan cost'], chosen.map(edge => [edge.from, edge.to, edge.cost]))]});
  }
  state(optimized ? 'Initialize dist to 100000000, choose point 0 as the current point, and start with zero edges.' : `Build all ${allEdges.length} undirected pair edges. Put the artificial (0, 0) entry into the heap to start at point 0 for free.`);
  if (optimized) {
    let node = 0;
    for (let count = 0; count < n - 1; count++) {
      current = node; visited.add(node);
      state(`Mark point ${node} visited. Scan every unvisited point to update its cheapest connection to the tree.`);
      let next = -1;
      for (let i = 0; i < n; i++) {
        if (visited.has(i)) continue;
        const cost = distance(node, i), previous = distances[i];
        if (cost < distances[i]) { distances[i] = cost; parents[i] = node; }
        if (next === -1 || distances[i] < distances[next]) next = i;
        state(`Inspect ${node} ↔ ${i}: Manhattan cost ${cost}. dist[${i}] ${cost < previous ? `improves to ${cost}` : `stays ${distances[i]}`}. Current cheapest next point is ${next}.`, {from: node, to: i, cost});
      }
      chosen.push({from: parents[next], to: next, cost: distances[next]}); total += distances[next]; node = next; current = node;
      state(`Add the cheapest connection to point ${next}, costing ${distances[next]}. The total becomes ${total}; make it the current point.`);
    }
    state(`After ${n - 1} edges, return ${total}. The source finishes before marking its final current point visited${n === 1 ? '; a single point needs no edges' : ''}.`);
  } else {
    while (visited.size < n) {
      heap.sort((a, b) => tupleCompare([a.cost, a.node], [b.cost, b.node]));
      const entry = heap.shift(); current = entry.node;
      if (visited.has(entry.node)) { state(`Pop cost ${entry.cost} for point ${entry.node}, which is already visited. Skip this stale edge.`, entry.from === null ? null : {from: entry.from, to: entry.node, cost: entry.cost}); continue; }
      visited.add(entry.node); total += entry.cost;
      if (entry.from !== null) chosen.push({from: entry.from, to: entry.node, cost: entry.cost});
      state(entry.from === null ? 'Pop the artificial cost-zero entry. Add point 0 to the tree for free.' : `Pop the cheapest connection to unvisited point ${entry.node}. Add cost ${entry.cost}; total = ${total}.`);
      for (const next of adjacency[entry.node]) {
        if (visited.has(next.node)) continue;
        heap.push({...next});
        state(`Push edge ${entry.node} ↔ ${next.node} with Manhattan cost ${next.cost}; its destination is still unvisited.`, {from: entry.node, to: next.node, cost: next.cost});
      }
    }
    state(`All ${n} points are visited. Return total cost ${total}; remaining heap entries are not needed.`);
  }
  return frames;
}

export function mountMinCostPoints(root) {
  return mount(root, {id: 'min-cost-points', description: 'Edit point coordinates and watch Prim grow a minimum spanning tree. Compare the stored complete-graph heap solution with the reference linear scan.', inputs: [{key: 'points', label: 'Points · JSON [x,y] coordinates', value: '[[0,0],[2,2],[3,10],[5,2],[7,0]]'}], hint: '1–16 points with distinct integer coordinates from −99 to 99. The picture preserves coordinate order; x and y axes are scaled independently to fit. Labels give original coordinates.', legend: 'Filled node: visited. Green edge: chosen tree connection. Orange edge: current candidate. Only chosen edges and the current candidate are drawn; every point pair exists in the complete graph. Segment labels are Manhattan costs, not drawn lengths. Heap parent labels explain the selected edge; the Python heap stores just (cost, destination).', parse: parsePoints, modes: [{label: 'Prim · complete graph and min-heap', trace: input => pointTrace(input)}, {label: 'Reference · dist array and linear scan', trace: input => pointTrace(input, true)}]});
}
