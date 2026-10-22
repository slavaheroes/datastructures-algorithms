import {escape} from '../shared/dom.mjs';
import {cloneGrid, editGrid, gridPresets, parseSettings, randomGrid} from './model.mjs';

const algorithms = ['dijkstra', 'bellman-ford', 'astar'];
const labels = {dijkstra: 'Dijkstra', 'bellman-ford': 'Bellman–Ford', astar: 'A*'};
const descriptions = {
  dijkstra: 'Expand the smallest known distance. Stop when the goal is popped.',
  'bellman-ford': 'Scan directed grid edges in row order. Repeat until a full pass makes no changes.',
  astar: 'Expand the smallest g + w × h, where h is Manhattan distance. Stop when the goal is popped.'
};
let instance = 0;

const time = value => value < 0.001 ? '<0.001' : value.toFixed(3);
const coordinate = (node, grid) => `(${Math.floor(node / grid.cols)}, ${node % grid.cols})`;

function template(id) {
  return `<p class="pf-intro">All three searches use the same map: move up, right, down, or left, with a cost of 1 per move. Dark cells are blocked. Generate a repeatable random map, or choose an example.</p>
  <form class="panel pf-settings">
    <div><label for="${id}-rows">Rows · 5–40</label><input id="${id}-rows" name="rows" type="number" min="5" max="40" step="1" value="16" required></div>
    <div><label for="${id}-cols">Columns · 5–40</label><input id="${id}-cols" name="cols" type="number" min="5" max="40" step="1" value="24" required></div>
    <div><label for="${id}-density">Blocked cells · % probability</label><input id="${id}-density" name="density" type="number" min="0" max="45" step="1" value="20" required></div>
    <div><label for="${id}-seed">Random seed</label><input id="${id}-seed" name="seed" type="number" min="0" max="4294967295" step="1" value="42" required></div>
    <button type="submit">Generate grid</button><button type="button" data-action="randomize">New random seed</button>
    <p class="hint pf-full">The same seed and settings reproduce the same walls. Random maps can be unreachable; no path is secretly carved through them.</p>
  </form>
  <div class="panel pf-options">
    <div><label for="${id}-preset">Example</label><select id="${id}-preset" data-role="preset"><option value="random">Random obstacles</option>${gridPresets.map(preset => `<option value="${escape(preset.id)}">${escape(preset.label)}</option>`).join('')}</select></div>
    <button type="button" data-action="preset">Load example</button>
    <div><label for="${id}-heuristic">A* heuristic</label><select id="${id}-heuristic" data-role="heuristic"><option value="1">Manhattan · weight 1 · shortest path</option><option value="5">5 × Manhattan · can miss shortest path</option><option value="0">Zero · behaves like Dijkstra</option></select></div>
    <div><label for="${id}-tool">Click / keyboard edit</label><select id="${id}-tool" data-role="tool"><option value="wall">Toggle wall</option><option value="start">Move start</option><option value="goal">Move goal</option></select></div>
  </div>
  <p class="pf-map-note" data-role="map-note"></p><p class="hint" data-role="map-stats"></p>
  <p class="error" role="alert" data-role="error"></p>
  <div class="pf-run-controls"><button type="button" class="primary" data-action="run">Run comparison</button><button type="button" data-action="cancel" hidden>Cancel measurement</button><span data-role="status" role="status">Ready. Run comparison to measure these searches in your browser.</span></div>
  <section class="panel pf-results" aria-label="Measured search results"><h2>Measured results</h2><p class="hint">Search time is measured before playback, in a browser worker. It includes graph setup and path reconstruction, and excludes tracing, drawing, and animation delays. Work counts are useful when small timing differences are noisy.</p><div class="svg-scroll" data-role="results"><p>Run comparison to see measured times and path lengths.</p></div><p class="hint" data-role="method"></p><p class="pf-outcome" data-role="outcome"></p></section>
  <div class="panel pf-playback"><button type="button" data-action="play">Play</button><button type="button" data-action="back">← Back</button><button type="button" data-action="step">Step →</button><button type="button" data-action="reset">Reset</button><button type="button" data-action="finish">Show paths</button>
    <label for="${id}-speed">Operations per tick <select id="${id}-speed" data-role="speed"><option value="1">1</option><option value="20">20</option><option value="100" selected>100</option><option value="500">500</option></select></label><span data-role="progress">No playback yet</span>
    <label for="${id}-seek" class="pf-seek">Playback step <input id="${id}-seek" type="range" min="0" max="0" value="0" step="1" data-role="seek" disabled></label>
    <p class="hint pf-full">Each step advances one recorded operation per search. Playback is a teaching view, not a stopwatch or a claim that different operations cost the same time.</p>
  </div>
  <ul class="pf-legend" aria-label="Grid legend"><li><span class="pf-key start">S</span>Start</li><li><span class="pf-key goal">G</span>Goal</li><li><span class="pf-key wall">×</span>Blocked</li><li><span class="pf-key discovered"></span>Discovered</li><li><span class="pf-key visited"></span>Expanded</li><li><span class="pf-key current"></span>Current operation</li><li><span class="pf-key path">·</span>Returned path</li></ul>
  <p class="hint">Edit any of the three grids; the map changes for all three. Tab into a grid, use arrow keys to choose a cell, and press Enter or Space to apply the selected edit tool. Coordinates start at zero.</p>
  <div class="pf-boards">${algorithms.map(algorithm => `<section class="panel pf-board" data-algorithm="${algorithm}"><h2>${labels[algorithm]}</h2><p class="pf-description">${descriptions[algorithm]}</p><div class="pf-grid-scroll"><div class="pf-grid" role="grid" aria-label="${labels[algorithm]} grid. Use arrow keys to move, Enter or Space to edit."></div></div><p class="pf-operation" data-board-role="operation">Ready</p><p class="hint" data-board-role="work"></p></section>`).join('')}</div>
  <section class="panel pf-explanation"><h2>What this comparison shows</h2><div class="pf-explanation-columns"><div><h3>Dijkstra and Bellman–Ford</h3><p>Dijkstra uses a binary min heap and stops once the goal has its shortest distance. Bellman–Ford performs full relaxation passes and can stop after a pass changes nothing. Its repeated scans can do much more work; row order also affects how quickly in-place updates spread.</p><p>These grids have only positive unit costs, so Bellman–Ford’s ability to handle negative edges is not needed. For this particular grid problem, ordinary BFS would also find a shortest path.</p><p>Heap Dijkstra takes O((V + E) log V) time on this bounded-degree grid. Bellman–Ford takes O(VE) time in the worst case. Both use O(V + E) storage here.</p></div>
    <div><h3>A* and its heuristic</h3><p>A* uses f = g + w × h. The known distance is g; h is the number of horizontal and vertical moves to the goal if walls are ignored. At weight 1, Manhattan distance never overestimates the remaining cost on this grid, so A* finds a shortest path. Equal priorities prefer the node closer to the goal.</p><p>At weight 5 this becomes Weighted A*. It may examine fewer cells, but the overestimate loses the shortest-path guarantee. Improved nodes can reopen in this implementation; stopping at the first popped goal can still give a longer route.</p><p>With the consistent weight-1 heuristic, this implementation has the same worst-case O((V + E) log V) time and O(V + E) storage as grid Dijkstra. The heuristic often reduces actual work; it does not guarantee a lower measured runtime. Weighted mode can reopen nodes and do extra work.</p></div></div>
    <h3>A* failure examples</h3><p><strong>Unreachable goal:</strong> all four neighbors of the goal are walls. A* correctly returns no route, as do the other two searches. This is an impossible map, rather than a failure of A*’s correctness.</p><p><strong>Overestimating heuristic:</strong> the preset has a 12-step upper corridor and a 14-step lower corridor. At weight 5, the first upper step has priority 46, while all steps along the lower corridor have priorities at most 42. A* reaches the longer route’s goal before exploring the shorter branch. Set the weight to 1 and run again on the same map.</p><p class="hint">The counterexample’s 12/14 lengths describe its original map; editing cells can change them. See <a href="https://inst.eecs.berkeley.edu/~cs188/textbook/search/informed.html" target="_blank" rel="noopener noreferrer">UC Berkeley’s explanation of A* and admissible heuristics</a>.</p>
  </section><p class="sr-only" data-role="announcement" aria-live="polite"></p>`;
}

export function mountPathfinding(root) {
  const id = `pathfinding-${++instance}`;
  root.innerHTML = template(id);
  const $ = role => root.querySelector(`[data-role="${role}"]`);
  const button = action => root.querySelector(`[data-action="${action}"]`);
  const form = root.querySelector('form');
  const boards = new Map(algorithms.map(algorithm => [algorithm, root.querySelector(`[data-algorithm="${algorithm}"]`)]));
  let grid, walls, results = [], states, position = 0, length = 0, timer = null, worker = null, request = 0;

  function pause() { clearTimeout(timer); timer = null; button('play').textContent = 'Play'; }
  function cancel(message = '') {
    if (worker) {
      worker.terminate(); worker = null; request++;
      if (!results.length) $('results').innerHTML = '<p>No completed measurement. Run comparison to measure this map.</p>';
    }
    button('run').disabled = false;
    button('cancel').hidden = true;
    if (message) $('status').textContent = message;
  }
  function emptyStates() {
    states = new Map(algorithms.map(algorithm => [algorithm, {visited: new Set(), discovered: new Set([grid.start]), path: new Set(), current: null, from: null, to: null, complete: false, operation: 'Ready', count: 0}]));
  }
  function controls() {
    const ready = results.length > 0;
    for (const action of ['play', 'back', 'step', 'reset', 'finish']) button(action).disabled = !ready;
    if (ready) {
      button('back').disabled = position === 0;
      button('step').disabled = button('play').disabled = button('finish').disabled = position === length;
    }
    $('seek').disabled = !ready;
    $('seek').max = length;
    $('seek').value = position;
    $('progress').textContent = ready ? `Operation ${position.toLocaleString()} / ${length.toLocaleString()}` : 'Run comparison for playback';
  }
  function buildBoards() {
    for (const [algorithm, board] of boards) {
      const region = board.querySelector('.pf-grid');
      if (region.dataset.shape === `${grid.rows}:${grid.cols}`) continue;
      region.dataset.shape = `${grid.rows}:${grid.cols}`;
      region.style.setProperty('--pf-cols', grid.cols);
      region.setAttribute('aria-rowcount', grid.rows);
      region.setAttribute('aria-colcount', grid.cols);
      region.innerHTML = Array.from({length: grid.rows}, (_, row) => `<div role="row" class="pf-grid-row">${Array.from({length: grid.cols}, (_, col) => {
        const node = row * grid.cols + col;
        return `<button type="button" role="gridcell" class="pf-cell" data-cell="${node}" tabindex="${node === grid.start ? 0 : -1}" aria-rowindex="${row + 1}" aria-colindex="${col + 1}"></button>`;
      }).join('')}</div>`).join('');
      board.dataset.algorithm = algorithm;
    }
  }
  function render() {
    for (const [algorithm, board] of boards) {
      const state = states.get(algorithm);
      for (const cell of board.querySelectorAll('[data-cell]')) {
        const node = Number(cell.dataset.cell);
        const kind = node === grid.start ? 'start' : node === grid.goal ? 'goal' : walls.has(node) ? 'wall' : state.path.has(node) ? 'path' : node === state.current || node === state.to ? 'current' : state.visited.has(node) ? 'visited' : state.discovered.has(node) ? 'discovered' : 'open';
        const className = `pf-cell ${kind}`;
        if (cell.className !== className) {
          cell.className = className;
          cell.textContent = kind === 'start' ? 'S' : kind === 'goal' ? 'G' : kind === 'wall' ? '×' : kind === 'path' ? '·' : '';
          const label = `${coordinate(node, grid)}: ${kind === 'visited' ? 'expanded' : kind}`;
          cell.setAttribute('aria-label', label);
          cell.title = label;
        }
      }
      board.querySelector('[data-board-role="operation"]').textContent = state.operation;
      board.querySelector('[data-board-role="work"]').textContent = `Recorded operations shown: ${state.count.toLocaleString()} · Distinct expanded cells: ${state.visited.size.toLocaleString()}`;
    }
    controls();
  }
  function invalidate(message = 'Map updated. Run comparison to measure the new map.') {
    pause(); cancel(); results = []; position = 0; length = 0; emptyStates();
    $('results').innerHTML = '<p>Run comparison to see measured times and path lengths.</p>';
    $('method').textContent = $('outcome').textContent = '';
    $('status').textContent = message;
    render();
  }
  function setGrid(next, description) {
    grid = cloneGrid(next); walls = new Set(grid.walls);
    $('heuristic').value = grid.heuristicWeight;
    form.elements.namedItem('rows').value = grid.rows;
    form.elements.namedItem('cols').value = grid.cols;
    $('map-note').textContent = description;
    $('map-stats').textContent = `${grid.rows} × ${grid.cols} cells · ${grid.walls.length} blocked · Start ${coordinate(grid.start, grid)} · Goal ${coordinate(grid.goal, grid)} · Every move costs 1`;
    buildBoards(); invalidate();
    $('error').textContent = '';
  }
  function generate() {
    try {
      const settings = parseSettings(Object.fromEntries(new FormData(form)));
      const next = randomGrid(settings);
      next.heuristicWeight = Number($('heuristic').value);
      $('preset').value = 'random';
      setGrid(next, `Random obstacles · seed ${settings.seed} · ${settings.density}% blocking probability per non-endpoint cell.`);
    } catch (error) { $('error').textContent = error.message; }
  }
  function apply(result, event) {
    const state = states.get(result.algorithm);
    state.count++;
    state.current = event.node; state.from = event.from ?? null; state.to = event.to ?? null;
    if (event.kind === 'expand') {
      state.visited.add(event.node);
      state.operation = `Expand ${coordinate(event.node, grid)} at known distance ${event.distance}.`;
    } else if (event.kind === 'check') {
      state.operation = `Check ${coordinate(event.from, grid)} → ${coordinate(event.to, grid)}.`;
    } else if (event.kind === 'relax') {
      state.discovered.add(event.to ?? event.node);
      state.operation = `Discover / improve ${coordinate(event.node, grid)} to distance ${event.distance}.`;
    } else if (event.kind === 'finish') {
      state.visited = new Set(result.visited); state.discovered = new Set(result.discovered); state.path = new Set(result.path);
      state.current = state.to = null; state.complete = true;
      state.operation = result.status === 'found' ? `Returned path: ${result.distance} moves.${result.algorithm === 'bellman-ford' ? ` ${result.passes} full passes.` : ''}` : 'No route exists from the start to the goal.';
      if (result.traceTruncated) state.operation += ` Playback skips from its ${result.traceLimit.toLocaleString()}-operation limit to the complete final state.`;
    }
  }
  function seek(next, announce = false) {
    next = Math.max(0, Math.min(length, next));
    if (next < position) { emptyStates(); position = 0; }
    for (const result of results) {
      for (let i = position; i < Math.min(next, result.events.length); i++) apply(result, result.events[i]);
    }
    position = next; render();
    if (announce) $('announcement').textContent = `Playback operation ${position} of ${length}. ${algorithms.map(algorithm => `${labels[algorithm]}: ${states.get(algorithm).operation}`).join(' ')}`;
    if (position === length) pause();
  }
  function reset() { pause(); emptyStates(); position = 0; render(); }
  function tick() {
    seek(position + Number($('speed').value));
    if (position < length) timer = setTimeout(tick, 50);
  }
  function play() { if (!results.length || position === length) return; button('play').textContent = 'Pause'; timer = setTimeout(tick, 50); }

  function measuredResults() {
    const baseline = results.find(result => result.algorithm === 'dijkstra');
    const fastest = Math.min(...results.map(result => result.runtimeMs));
    const slowest = Math.max(...results.map(result => result.runtimeMs), 0.000001);
    $('results').innerHTML = `<table class="pf-results-table"><caption>Same map, same endpoints, same movement rules</caption><thead><tr><th scope="col">Search</th><th scope="col">Median ms / run</th><th scope="col">Edge checks</th><th scope="col">Distinct expanded</th><th scope="col">Path length</th><th scope="col">Result</th></tr></thead><tbody>${results.map(result => {
      const longer = result.status === 'found' && baseline.status === 'found' && result.distance > baseline.distance;
      const ratio = fastest > 0 ? `${(result.runtimeMs / fastest).toFixed(1)}× fastest` : 'Below timer resolution';
      return `<tr><th scope="row">${labels[result.algorithm]}${result.algorithm === 'astar' && grid.heuristicWeight > 1 ? '<small>Weighted heuristic</small>' : ''}</th><td><strong>${escape(time(result.runtimeMs))}</strong><div class="pf-time-bar" aria-hidden="true"><span style="width:${Math.max(1, result.runtimeMs / slowest * 100)}%"></span></div><small>${ratio}</small></td><td>${result.edgeChecks.toLocaleString()}</td><td>${result.expandedUnique.toLocaleString()}</td><td>${result.distance === null ? '—' : result.distance}</td><td class="${longer ? 'pf-longer' : ''}">${longer ? `Longer route (+${result.distance - baseline.distance})` : result.status === 'found' ? 'Shortest route' : 'Unreachable'}</td></tr>`;
    }).join('')}</tbody></table>`;
    $('method').textContent = `${results[0].sampleCount} timed samples after warm-up; each sample averages repeated searches. Runs per sample: ${results.map(result => `${labels[result.algorithm]} ${result.batchSize}`).join(', ')}. Order rotates between samples. Browser load and timer precision affect small results. Edge checks count attempted relaxations from reachable cells; distinct expanded counts each processed cell once, including Bellman–Ford’s repeated-pass visits only once.`;
    const astar = results.find(result => result.algorithm === 'astar');
    if (baseline.status === 'unreachable') $('outcome').textContent = 'No route exists on this map. All three searches correctly report an unreachable goal.';
    else if (astar.distance > baseline.distance) $('outcome').textContent = `Weighted A* returned ${astar.distance} moves; the optimal route is ${baseline.distance}. The overestimating heuristic lost optimality. Change the weight to 1 and run again on this same map.`;
    else $('outcome').textContent = `All three returned an optimal path of ${baseline.distance} moves.${grid.heuristicWeight > 1 ? ' An inflated heuristic happened to work here; it still has no shortest-path guarantee.' : ''}`;
  }
  function run() {
    pause(); cancel();
    results = []; length = position = 0; emptyStates(); render();
    $('error').textContent = '';
    $('results').innerHTML = '<p>Measuring the three searches…</p>';
    $('method').textContent = $('outcome').textContent = '';
    button('run').disabled = true; button('cancel').hidden = false;
    $('status').textContent = 'Starting measurement…';
    const current = ++request;
    try {
      const url = new URL('./worker.mjs', import.meta.url);
      // Propagate the staged asset version to the worker entry point too.
      url.search = new URL(import.meta.url).search;
      worker = new Worker(url, {type: 'module'});
      const fail = message => {
        cancel('Comparison did not finish. Run again to retry.');
        $('error').textContent = message;
        $('results').innerHTML = '<p>No timing result. Run comparison to retry.</p>';
      };
      worker.onerror = () => { if (current === request) fail('The comparison worker could not load. Serve the site over HTTP and refresh the page.'); };
      worker.onmessage = ({data}) => {
        if (data.id !== current || current !== request) return;
        if (data.type === 'progress') { $('status').textContent = data.message; return; }
        if (data.type === 'error') { fail(data.error); return; }
        if (data.type !== 'complete') return;
        results = data.results; length = Math.max(...results.map(result => result.events.length));
        cancel();
        $('status').textContent = 'Measurement complete. Replay the recorded operations below.';
        measuredResults(); render();
        $('announcement').textContent = $('outcome').textContent;
        if (!document.hidden && root.isConnected) play();
      };
      worker.postMessage({id: current, grid: cloneGrid(grid), repeats: 7});
    } catch (error) {
      cancel('Comparison did not start.');
      $('error').textContent = error.message;
      $('results').innerHTML = '<p>No timing result. Run comparison to retry.</p>';
    }
  }

  form.onsubmit = event => { event.preventDefault(); generate(); };
  button('randomize').onclick = () => {
    const values = new Uint32Array(1); crypto.getRandomValues(values);
    form.elements.namedItem('seed').value = values[0]; generate();
  };
  button('preset').onclick = () => {
    const preset = gridPresets.find(item => item.id === $('preset').value);
    if (preset) setGrid(preset.grid, preset.description);
    else generate();
  };
  $('heuristic').onchange = () => {
    grid = {...grid, heuristicWeight: Number($('heuristic').value)};
    invalidate('Heuristic changed. Run comparison on this same map.');
  };
  for (const board of boards.values()) {
    board.onclick = event => {
      const cell = event.target.closest('[data-cell]');
      if (!cell) return;
      try {
        const next = editGrid(grid, Number(cell.dataset.cell), $('tool').value);
        $('preset').value = 'random';
        setGrid(next, 'Edited map · the same walls and endpoints are used by all three searches.');
      } catch (error) { $('error').textContent = error.message; }
    };
    board.onfocusin = event => {
      const cell = event.target.closest('[data-cell]');
      if (!cell) return;
      board.querySelectorAll('[data-cell][tabindex="0"]').forEach(item => { item.tabIndex = -1; });
      cell.tabIndex = 0;
    };
    board.onkeydown = event => {
      const cell = event.target.closest('[data-cell]');
      if (!cell) return;
      const node = Number(cell.dataset.cell), row = Math.floor(node / grid.cols), col = node % grid.cols;
      const moves = {ArrowUp: row > 0 ? node - grid.cols : node, ArrowDown: row < grid.rows - 1 ? node + grid.cols : node, ArrowLeft: col > 0 ? node - 1 : node, ArrowRight: col < grid.cols - 1 ? node + 1 : node};
      if (Object.hasOwn(moves, event.key)) { event.preventDefault(); board.querySelector(`[data-cell="${moves[event.key]}"]`).focus({preventScroll: false}); }
    };
  }
  button('run').onclick = run;
  button('cancel').onclick = () => cancel('Measurement cancelled. Run comparison to try again.');
  button('play').onclick = () => timer !== null ? pause() : play();
  button('step').onclick = () => { pause(); seek(position + 1, true); };
  button('back').onclick = () => { pause(); seek(position - 1, true); };
  button('reset').onclick = reset;
  button('finish').onclick = () => { pause(); seek(length, true); };
  $('seek').oninput = () => { pause(); seek(Number($('seek').value)); };
  const deactivate = () => { pause(); if (worker) cancel('Measurement paused while this workspace was hidden. Run comparison to try again.'); };
  document.addEventListener('visibilitychange', () => { if (document.hidden) deactivate(); });
  generate();
  return {deactivate};
}
