import {escape} from '../shared/dom.mjs';
import {heapViolations} from './model.mjs';

export function heapView(frame, mode) {
  const {values, active} = frame;
  const followIndex = active[active.length - 1];
  const violations = new Set(heapViolations(values, mode));
  const array = values.length ? `<ol class="heap-array">${values.map((value, index) => `<li class="heap-cell${active.includes(index) ? ' heap-active' : ''}"${index === followIndex ? ' data-follow' : ''}><span class="heap-index">[${index}]</span><strong>${value}</strong></li>`).join('')}</ol>` : '<p class="heap-empty">The array is empty.</p>';
  if (!values.length) return `<section class="heap-array-section" aria-label="Heap array"><h3>Array</h3>${array}</section><section class="heap-tree-section" aria-label="Heap tree"><h3>Tree</h3><p class="heap-empty">No nodes. Push a value after playback completes.</p></section>`;

  const nodeWidth = Math.max(58, ...values.map(value => String(value).length * 9 + 20));
  const width = Math.max(540, values.length * (nodeWidth + 16));
  const depth = Math.floor(Math.log2(values.length)), height = 100 + depth * 94;
  const points = new Map();
  let rank = 0;
  function layout(index, level) {
    if (index >= values.length) return;
    layout(2 * index + 1, level + 1);
    points.set(index, {x: (rank++ + .5) * width / values.length, y: 45 + level * 94});
    layout(2 * index + 2, level + 1);
  }
  layout(0, 0);
  let edges = '', nodes = '';
  for (let index = 0; index < values.length; index++) {
    const point = points.get(index);
    if (index > 0) {
      const parent = points.get(Math.floor((index - 1) / 2));
      edges += `<path class="heap-tree-edge${violations.has(index) ? ' heap-violation' : ''}" d="M${parent.x} ${parent.y + 22} L${point.x} ${point.y - 22}"/>`;
    }
    nodes += `<g class="heap-tree-node${active.includes(index) ? ' heap-active' : ''}"${index === followIndex ? ' data-follow' : ''}><title>Index ${index}, value ${values[index]}${index ? `, parent index ${Math.floor((index - 1) / 2)}` : ', root'}</title><rect x="${point.x - nodeWidth / 2}" y="${point.y - 22}" width="${nodeWidth}" height="44" rx="12"/><text x="${point.x}" y="${point.y}">${values[index]}</text><text class="heap-index" x="${point.x}" y="${point.y + 40}">[${index}]</text></g>`;
  }
  const text = values.map((value, index) => `Index ${index}: value ${value}; parent ${index ? Math.floor((index - 1) / 2) : 'none'}; left ${2 * index + 1 < values.length ? 2 * index + 1 : 'none'}; right ${2 * index + 2 < values.length ? 2 * index + 2 : 'none'}${active.includes(index) ? '; active' : ''}${violations.has(index) ? '; parent order is being repaired' : ''}`).join('\n');
  return `<section class="heap-array-section" aria-label="Heap array"><h3>Array</h3>${array}</section><section class="heap-tree-section" aria-label="Heap tree"><h3>Tree</h3><div class="heap-tree-scroll"><svg class="heap-tree" viewBox="0 0 ${width} ${height}" style="min-width:${width}px" role="img" aria-label="${mode} heap, ${values.length} values; root ${values[0]}; active indices ${active.join(', ') || 'none'}">${edges}${nodes}</svg></div></section><details class="heap-text"><summary>Read the heap as text</summary><pre>${escape(text)}</pre></details>`;
}
