import {byId, guarded, integer} from '../shared/dom.mjs';
import {mountAlgorithmCode} from '../shared/algorithm-code.mjs';
import {HEAP_LIMIT, heapViolations, parseHeapArray} from './model.mjs';
import {heapTrace} from './trace.mjs';
import {heapCode} from './code.mjs';
import {template} from './template.mjs';
import {heapView} from './view.mjs';

export function mountHeap(root) {
  root.innerHTML = template;
  const $ = id => byId(root, id);
  const attempt = action => guarded($('heap-error'), action);
  let trace, codeView, position = 0, timer = null;

  function status(message) {
    if ($('heap-state').textContent !== message) $('heap-state').textContent = message;
  }
  function pause() {
    if (timer !== null) clearTimeout(timer);
    timer = null;
    $('heap-play').textContent = 'Play';
  }
  function followActive(region) {
    if (!region.clientWidth) return;
    const active = [...region.querySelectorAll('.heap-active')];
    if (!active.length) return;
    const bounds = region.getBoundingClientRect();
    const items = active.map(item => item.getBoundingClientRect());
    let left = Math.min(...items.map(item => item.left));
    let right = Math.max(...items.map(item => item.right));
    // Keep both compared values visible when possible; otherwise follow the
    // latest touched index. Move only the diagram's own horizontal scroller.
    if (right - left > region.clientWidth - 32) {
      const focus = (region.querySelector('[data-follow]') || active[active.length - 1]).getBoundingClientRect();
      left = focus.left;
      right = focus.right;
    }
    if (right > bounds.right - 16) region.scrollLeft += right - bounds.right + 16;
    else if (left < bounds.left + 16) region.scrollLeft -= bounds.left - left + 16;
  }
  function render(announce = false) {
    const frame = trace.frames[position], complete = position === trace.frames.length - 1;
    const min = trace.mode === 'min';
    $('heap-operation-title').textContent = `${min ? 'Min' : 'Max'} heap · ${trace.operation}${min ? '' : '_max'}`;
    $('heap-push').textContent = `heappush${min ? '' : '_max'}`;
    $('heap-pop').textContent = `heappop${min ? '' : '_max'}`;
    $('heap-count').textContent = `${frame.values.length} / ${HEAP_LIMIT} values`;
    const textDisclosure = $('heap-diagram').querySelector('.heap-text');
    const textOpen = textDisclosure?.open;
    const summaryFocused = textDisclosure?.querySelector('summary') === document.activeElement;
    const scrollPositions = new Map(['.heap-array', '.heap-tree-scroll'].map(selector => [selector, $('heap-diagram').querySelector(selector)?.scrollLeft || 0]));
    $('heap-diagram').innerHTML = heapView(frame, trace.mode);
    if (textOpen && $('heap-diagram').querySelector('.heap-text')) $('heap-diagram').querySelector('.heap-text').open = true;
    if (summaryFocused) $('heap-diagram').querySelector('.heap-text summary')?.focus({preventScroll: true});
    for (const [selector, left] of scrollPositions) {
      const region = $('heap-diagram').querySelector(selector);
      if (region) {
        region.scrollLeft = left;
        followActive(region);
      }
    }
    const lines = frame.codeLines.length ? `Line${frame.codeLines.length > 1 ? 's' : ''} ${frame.codeLines.join(', ')} · ` : '';
    $('heap-message').textContent = `${lines}${frame.message}`;
    if (announce) $('heap-announcement').textContent = `Step ${position} of ${trace.frames.length - 1}. ${frame.codeLines.length === 1 ? 'Line' : 'Lines'} ${frame.codeLines.join(', ')}. ${frame.operation}. ${frame.message}`;
    $('heap-return').hidden = frame.removed === null;
    $('heap-return').textContent = frame.removed === null ? '' : `Return value: ${frame.removed}`;
    $('heap-progress').textContent = `${position} / ${trace.frames.length - 1} steps`;
    $('heap-stats').textContent = `This operation so far: ${frame.comparisons} comparisons · ${frame.swaps} swaps.`;
    const violations = heapViolations(frame.values, trace.mode).length;
    $('heap-property').textContent = !frame.values.length ? 'The empty heap has no parent-child pairs.' : violations ? `Parent order is being repaired: ${violations} ${violations === 1 ? 'edge violates' : 'edges violate'} the ${min ? 'min' : 'max'}-heap property.` : `Every parent is ${min ? 'less than or equal to' : 'greater than or equal to'} its children.`;
    $('heap-order-explanation').textContent = `In a ${min ? 'min' : 'max'} heap, every parent is ${min ? 'less than or equal to' : 'greater than or equal to'} its children. The root at index 0 is the ${min ? 'smallest' : 'largest'} value.`;
    $('heap-back').disabled = position === 0;
    $('heap-step').disabled = $('heap-play').disabled = complete;
    $('heap-push').disabled = !complete || frame.values.length === HEAP_LIMIT;
    $('heap-pop').disabled = !complete || frame.values.length === 0;
    $('heap-value').disabled = !complete || frame.values.length === HEAP_LIMIT;
    if (complete) {
      status(`Operation complete. ${!frame.values.length ? 'Push a value to start the empty heap.' : frame.values.length === HEAP_LIMIT ? 'The heap is full; pop a value before pushing another.' : 'Push or pop to continue with this heap.'} Reset replays this operation.`);
    } else {
      status(`Finish ${trace.operation}${min ? '' : '_max'} playback to use the result for another operation. Heapify array starts a new trace from your input.`);
    }
    codeView.update(frame);
  }
  function start(nextTrace) {
    pause();
    trace = nextTrace;
    codeView = mountAlgorithmCode($('heap-code'), heapCode(trace.mode, trace.operation));
    position = 0;
    render(true);
  }
  function load() {
    start(heapTrace(parseHeapArray($('heap-input').value), $('heap-mode').value));
  }
  function advance(announce = false) {
    if (position < trace.frames.length - 1) position++;
    render(announce);
    if (position === trace.frames.length - 1) {
      pause();
      if (!announce) $('heap-announcement').textContent = trace.frames[position].message;
    }
  }
  const delay = () => 1200 - Number($('heap-speed').value) * 100;
  function tick() {
    advance();
    if (position < trace.frames.length - 1) timer = setTimeout(tick, delay());
  }
  $('heap-load').onclick = () => attempt(load);
  $('heap-push').onclick = () => attempt(() => start(heapTrace(trace.result, trace.mode, 'heappush', integer($('heap-value')))));
  $('heap-pop').onclick = () => attempt(() => start(heapTrace(trace.result, trace.mode, 'heappop')));
  $('heap-play').onclick = () => {
    if (timer !== null) { pause(); return; }
    $('heap-play').textContent = 'Pause';
    timer = setTimeout(tick, delay());
  };
  $('heap-back').onclick = () => { pause(); if (position > 0) position--; render(true); };
  $('heap-step').onclick = () => { pause(); advance(true); };
  $('heap-reset').onclick = () => { pause(); position = 0; render(true); };
  const onVisibility = () => { if (document.hidden) pause(); };
  document.addEventListener('visibilitychange', onVisibility);
  load();
  return {deactivate: pause};
}
