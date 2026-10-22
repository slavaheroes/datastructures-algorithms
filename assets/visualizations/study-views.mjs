import {escape} from './sequence-playback.mjs';

function display(value) {
  if (value === null || value === undefined) return '·';
  if (value === Infinity) return '∞';
  if (value === -Infinity) return '−∞';
  if (typeof value === 'boolean') return value ? 'True' : 'False';
  return String(value);
}

// Shared markup only: each lesson owns its algorithm and snapshots.
export function grid(title, rows, {rowLabels, colLabels, active = null, dependencies = [], marked = []} = {}) {
  const contains = (coordinates, r, c) => coordinates.some(([row, col]) => row === r && col === c);
  const columns = colLabels ?? (rows[0] || []).map((_, i) => i);
  return `<div class="svg-scroll study-grid"><table><caption>${escape(title)}</caption><thead><tr><th scope="col">Row / column</th>${columns.map(label => `<th scope="col">${escape(label)}</th>`).join('')}</tr></thead><tbody>${rows.map((row, r) => `<tr><th scope="row">${escape(rowLabels?.[r] ?? r)}</th>${row.map((value, c) => {
    const current = active?.[0] === r && active?.[1] === c, dependency = contains(dependencies, r, c), stored = contains(marked, r, c);
    const label = [current ? 'current cell' : '', dependency ? 'dependency' : '', stored ? 'marked cell' : ''].filter(Boolean).join(', ');
    return `<td class="${current ? 'study-active' : ''} ${dependency ? 'study-dependency' : ''} ${stored ? 'study-marked' : ''}" ${current ? 'data-follow' : ''}>${escape(display(value))}${label ? `<span class="sr-only"> (${label})</span>` : ''}</td>`;
  }).join('')}</tr>`).join('')}</tbody></table></div>`;
}

export function sequence(title, values, {active = null, marked = [], notes = []} = {}) {
  return `<section class="study-sequence"><h4>${escape(title)}</h4><div class="svg-scroll"><ol class="sequence-cells study-cells" aria-label="${escape(title)}">${values.map((value, i) => `<li class="${i === active ? 'study-active' : ''} ${marked.includes(i) ? 'study-marked' : ''}" ${i === active ? 'data-follow' : ''}><span class="sequence-index">${i}</span><strong>${escape(display(value))}</strong><span class="study-note">${escape(notes[i] ?? '')}</span>${i === active ? '<span class="sr-only">current index</span>' : ''}${marked.includes(i) ? '<span class="sr-only">marked index</span>' : ''}</li>`).join('')}</ol>${values.length ? '' : '<p class="hint">Empty sequence</p>'}</div></section>`;
}

export function entries(title, columns, rows) {
  return `<div class="height-table svg-scroll study-entries"><table><caption>${escape(title)}</caption><thead><tr>${columns.map(column => `<th scope="col">${escape(column)}</th>`).join('')}</tr></thead><tbody>${rows.map(row => `<tr>${row.map(value => `<td>${escape(display(value))}</td>`).join('')}</tr>`).join('')}</tbody></table>${rows.length ? '' : '<p class="hint">No entries yet.</p>'}</div>`;
}
