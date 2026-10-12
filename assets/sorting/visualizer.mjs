import {numberArray} from '../shared/input.mjs';
import {byId, escape, guarded} from '../shared/dom.mjs';
import {sortingAlgorithms} from './registry.mjs';
import {sortingSteps} from './steps.mjs';
import {sortBars} from './view.mjs';
import {template} from './template.mjs';
import {mountAlgorithmCode} from '../shared/algorithm-code.mjs';

export function mountSorting(root, {algorithmId} = {}) {
  root.innerHTML = template;
  const $ = id => byId(root, id);
  const attempt = action => guarded($('sort-error'), action);
  $('sort-algorithm').innerHTML = sortingAlgorithms.map(algorithm => `<option value="${escape(algorithm.id)}">${escape(algorithm.label)}</option>`).join('');
  if (algorithmId) {
    $('sort-algorithm').value = algorithmId;
    $('sort-algorithm').parentElement.hidden = true;
  }
  let frames = [], position = 0, timer = null, codeView;

  function pause() {
    if (timer !== null) clearTimeout(timer);
    timer = null;
    $('sort-play').textContent = 'Play';
  }
  function announceFrame(frame) {
    const lines = frame.codeLines?.length ? `Line${frame.codeLines.length > 1 ? 's' : ''} ${frame.codeLines.join(', ')}. ` : '';
    $('sort-announcement').textContent = `${lines}${frame.operation || ''}. ${frame.message}`;
  }
  function render(announce = false) {
    const frame = frames[position];
    $('sort-bars').innerHTML = sortBars(frame);
    $('sort-bars').setAttribute('aria-label', `Array at step ${position}: ${frame.values.join(', ') || 'empty'}`);
    const lines = frame.codeLines?.length ? `Line${frame.codeLines.length > 1 ? 's' : ''} ${frame.codeLines.join(', ')} · ` : '';
    $('sort-message').textContent = `${lines}${frame.message}`;
    $('sort-progress').textContent = `${position} / ${frames.length - 1} steps`;
    $('sort-stats').textContent = `${frame.comparisons} comparisons · ${frame.writes} writes`;
    codeView.update(frame);
    $('sort-back').disabled = position === 0;
    $('sort-step').disabled = $('sort-play').disabled = position === frames.length - 1;
    if (announce) announceFrame(frame);
  }
  function load() {
    const values = numberArray($('sort-input').value, 32);
    if (values.some(value => Math.abs(value) > 999)) throw Error('Keep each value between −999 and 999.');
    const algorithm = sortingAlgorithms.find(item => item.id === $('sort-algorithm').value);
    pause();
    frames = sortingSteps(values, algorithm.id);
    position = 0;
    $('sort-name').textContent = algorithm.label.toUpperCase();
    $('sort-explanation').textContent = algorithm.explanation;
    codeView = mountAlgorithmCode($('sort-code'), algorithm.code);
    render(true);
  }
  function advance(announce = false) {
    if (position < frames.length - 1) position++;
    render(announce);
    if (position === frames.length - 1) {
      pause();
      if (!announce) announceFrame(frames[position]);
    }
  }
  function tick() {
    advance();
    if (position < frames.length - 1) timer = setTimeout(tick, 1100 - Number($('sort-speed').value) * 100);
  }
  $('sort-play').onclick = () => {
    if (timer !== null) { pause(); return; }
    $('sort-play').textContent = 'Pause';
    timer = setTimeout(tick, 1100 - Number($('sort-speed').value) * 100);
  };
  $('sort-step').onclick = () => { pause(); advance(true); };
  $('sort-back').onclick = () => { pause(); position = Math.max(0, position - 1); render(true); };
  $('sort-reset').onclick = () => { pause(); position = 0; render(true); };
  $('load-sort').onclick = () => attempt(load);
  $('sort-algorithm').onchange = () => { pause(); attempt(load); };
  $('random-sort').onclick = () => {
    $('sort-input').value = JSON.stringify(Array.from({length: 10}, () => Math.floor(Math.random() * 90) + 10));
    attempt(load);
  };
  document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); });
  load();
  return {deactivate: pause};
}
