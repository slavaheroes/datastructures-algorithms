import {escape} from '../shared/dom.mjs';
import {mountAlgorithmCode} from '../shared/algorithm-code.mjs';
import {parseGraphInput} from './input.mjs';
import {graphView, graphText} from './view.mjs';

let instance = 0;

function template(definition, id) {
  return `<section class="panel ga-explanation" aria-label="How ${escape(definition.title)} works">
    <div><h2>Approach</h2>${definition.explanation.map(text => `<p>${escape(text)}</p>`).join('')}</div>
    <div><h2>Steps</h2><ol>${definition.steps.map(text => `<li>${escape(text)}</li>`).join('')}</ol></div>
  </section>
  <form class="panel ga-form">
    <div class="ga-presets"><label for="${id}-example">Example</label><select id="${id}-example" data-role="example">${definition.examples.map((example, i) => `<option value="${i}">${escape(example.label)}</option>`).join('')}</select><button type="button" data-action="example">Load example</button></div>
    <div class="ga-inputs">
      <div><label for="${id}-nodes">Number of nodes · 1–16</label><input id="${id}-nodes" name="nodes" type="number" min="1" max="16" step="1" required aria-describedby="${id}-hint"></div>
      ${definition.direction === 'choice' ? `<div><label for="${id}-direction">Graph type</label><select id="${id}-direction" name="direction"><option value="directed">Directed</option><option value="undirected">Undirected</option></select></div>` : `<p class="ga-input-kind">${definition.direction === 'directed' ? 'Directed' : 'Undirected'} graph</p>`}
      ${definition.sourceMode === 'single' ? `<div><label for="${id}-source">Start node</label><input id="${id}-source" name="source" type="number" min="0" max="15" step="1" required></div>` : definition.sourceMode === 'multi' ? `<div><label for="${id}-sources">Sources · JSON array</label><input id="${id}-sources" name="sources" required spellcheck="false" aria-describedby="${id}-hint"></div>` : ''}
    </div>
    <label for="${id}-edges">Edges · JSON array of ${definition.weighted ? '[from, to, weight] triples' : '[from, to] pairs'}</label>
    <textarea id="${id}-edges" name="edges" rows="3" required spellcheck="false" aria-describedby="${id}-hint"></textarea>
    <div class="ga-load"><button type="submit">Load graph</button><p class="hint" id="${id}-hint">Nodes are 0 through n − 1, including isolated nodes. Use up to 64 edges; [] means no edges. Parallel edges and self-loops are retained.${definition.weighted ? ' Integer weights: −999 to 999.' : ''}${definition.sourceMode === 'multi' ? ' Sources start together at distance 0.' : ''}</p></div>
  </form>
  <p class="error" data-role="error" role="alert"></p>
  <div class="algorithm-workspace ga-workspace"><section class="canvas-panel" aria-label="Step-by-step graph visualization">
    <div class="canvas-heading"><span>${escape(definition.title)}</span><span data-role="count"></span></div>
    <ul class="ga-legend" aria-label="Diagram legend"><li><span class="ga-swatch active"></span>Current</li><li><span class="ga-swatch frontier"></span>Queued / active path</li><li><span class="ga-swatch visited"></span>Discovered</li><li><span class="ga-swatch finished"></span>Processed</li><li><span class="ga-line accepted"></span>Selected edge</li><li><span class="ga-line rejected"></span>Rejected / cycle edge</li></ul>
    <div data-role="drawing"></div>
    <p class="ga-message" data-role="message"></p>
    <div class="playback ga-playback"><button type="button" class="primary" data-action="play">Play</button><button type="button" data-action="back">← Back</button><button type="button" data-action="step">Step →</button><button type="button" data-action="reset">Reset</button>
      <label for="${id}-speed">Speed <select id="${id}-speed" data-role="speed"><option value="1500">Slow</option><option value="850" selected>Normal</option><option value="350">Fast</option></select></label><span data-role="progress"></span>
      <label class="ga-seek" for="${id}-seek">Playback step <input id="${id}-seek" data-role="seek" type="range" min="0" value="0" step="1"></label>
    </div>
    <p class="sr-only" data-role="announcement" aria-live="polite"></p>
    <details class="ga-text"><summary>Graph as text · edge numbers are zero-based</summary><pre data-role="text"></pre></details>
  </section><section class="algorithm-code-panel panel" data-role="code" aria-label="Python code and values for the current step"></section></div>
  <div class="ga-facts"><section class="panel"><h2>Complexity</h2><p><strong>Time:</strong> ${escape(definition.complexity.time)}</p><p><strong>Space:</strong> ${escape(definition.complexity.space)}</p><p class="hint">V = nodes, E = edges. Bounds include algorithm storage, excluding the snapshots saved by this teaching tool.</p></section>
    <section class="panel"><h2>Things to watch</h2><ul>${definition.notes.map(text => `<li>${escape(text)}</li>`).join('')}</ul>${definition.related?.length ? `<p>Related solutions: ${definition.related.map(item => `<a href="#practice/${escape(item.id)}">${escape(item.title)}</a>`).join(' · ')}</p>` : ''}<p class="hint">The Python listing explains this standalone visualization. The NeetCode lessons retain their original solution versions.</p></section></div>`;
}

export function mountGraphAlgorithm(root, definition) {
  const id = `graph-algorithm-${++instance}`;
  root.innerHTML = template(definition, id);
  const $ = role => root.querySelector(`[data-role="${role}"]`);
  const button = action => root.querySelector(`[data-action="${action}"]`);
  const form = root.querySelector('form');
  const code = mountAlgorithmCode($('code'), {language: 'Python', title: definition.title, source: definition.code});
  let input, frames = [], position = 0, timer = null;

  function pause() {
    clearTimeout(timer); timer = null;
    button('play').textContent = 'Play';
  }
  function render(announce = false) {
    const frame = frames[position];
    if (!frame) return;
    const scroll = [...$('drawing').querySelectorAll('.svg-scroll')].map(region => [region.scrollLeft, region.scrollTop]);
    $('drawing').innerHTML = graphView(input, frame, id);
    $('drawing').querySelectorAll('.svg-scroll').forEach((region, i) => {
      region.scrollLeft = scroll[i]?.[0] || 0;
      region.scrollTop = scroll[i]?.[1] || 0;
    });
    $('message').textContent = frame.message;
    $('progress').textContent = `Step ${position} of ${frames.length - 1}`;
    $('seek').value = position;
    button('back').disabled = position === 0;
    button('play').disabled = button('step').disabled = position === frames.length - 1;
    code.update(frame);
    if (announce) $('announcement').textContent = `Step ${position} of ${frames.length - 1}. ${frame.message}`;
  }
  function load() {
    pause();
    try {
      const nextInput = parseGraphInput(Object.fromEntries(new FormData(form)), definition);
      const nextFrames = definition.trace(nextInput);
      if (!nextFrames.length || nextFrames.length > 6000) throw Error('Use a smaller graph; playback supports up to 6,000 steps.');
      input = nextInput; frames = nextFrames; position = 0;
      $('error').textContent = '';
      $('seek').max = frames.length - 1;
      $('count').textContent = `${input.n} / 16 nodes · ${input.edges.length} edges`;
      $('text').textContent = graphText(input);
      render(true);
    } catch (error) {
      $('error').textContent = `${error.message}${input ? ' The last loaded graph is still shown.' : ''}`;
    }
  }
  function loadExample() {
    const example = definition.examples[Number($('example').value)];
    form.elements.namedItem('nodes').value = example.n;
    form.elements.namedItem('edges').value = JSON.stringify(example.edges);
    if (definition.sourceMode === 'single') form.elements.namedItem('source').value = example.source ?? 0;
    if (definition.sourceMode === 'multi') form.elements.namedItem('sources').value = JSON.stringify(example.sources || [0]);
    if (definition.direction === 'choice') form.elements.namedItem('direction').value = example.directed === false ? 'undirected' : 'directed';
    load();
  }
  function advance(announce = false) {
    if (position < frames.length - 1) position++;
    render(announce);
    if (position === frames.length - 1) { pause(); if (!announce) $('announcement').textContent = frames[position].message; }
  }
  function tick() {
    advance();
    if (position < frames.length - 1) timer = setTimeout(tick, Number($('speed').value));
  }
  form.onsubmit = event => { event.preventDefault(); load(); };
  button('example').onclick = loadExample;
  button('play').onclick = () => {
    if (timer !== null) { pause(); return; }
    button('play').textContent = 'Pause';
    timer = setTimeout(tick, Number($('speed').value));
  };
  button('step').onclick = () => { pause(); advance(true); };
  button('back').onclick = () => { pause(); position = Math.max(0, position - 1); render(true); };
  button('reset').onclick = () => { pause(); position = 0; render(true); };
  $('seek').oninput = () => { pause(); position = Number($('seek').value); render(true); };
  document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); });
  loadExample();
  return {deactivate: pause};
}
