import {escape} from './dom.mjs';
import {highlightPython} from './python-highlight.mjs';

const resizeObservers = new WeakMap();

function formatValue(value) {
  if (value === null || value === undefined) return 'None';
  if (typeof value === 'boolean') return value ? 'True' : 'False';
  if (Array.isArray(value)) return `[${value.map(formatValue).join(', ')}]`;
  return String(value);
}

// Keep the listing mounted so playback preserves text selection and keyboard focus.
export function mountAlgorithmCode(root, definition) {
  const lines = definition.source.split('\n');
  root.innerHTML = `<div class="algorithm-code-heading"><div><h2>${escape(definition.language)} code</h2><span class="algorithm-code-name">${escape(definition.title)}</span></div><button type="button" class="algorithm-code-wrap" aria-pressed="true">Wrap lines</button></div>
    <div class="algorithm-code-operation"><span class="algorithm-code-location"></span><span class="algorithm-code-action"></span></div>
    <pre class="algorithm-code-scroll is-wrapped" tabindex="0" role="region" aria-label="${escape(`${definition.language} code for ${definition.title}. The arrow marks the current operation. Scroll to read all lines.`)}"><code>${lines.map((line, index) => `<span class="algorithm-code-line" data-line="${index + 1}" style="--code-indent:${line.match(/^ */)[0].length}"><span class="algorithm-code-gutter"><span class="algorithm-code-pointer" aria-hidden="true"></span><span class="algorithm-code-number" aria-hidden="true">${index + 1}</span></span><span class="algorithm-code-text"><span class="sr-only">Line ${index + 1}. </span>${highlightPython(line) || ' '}</span></span>`).join('')}</code></pre>
    <section class="algorithm-code-state"><h3 class="algorithm-variables-heading">Values at this step</h3><dl class="algorithm-code-variables"></dl></section>`;
  const listing = root.querySelector('.algorithm-code-scroll');
  const rows = [...root.querySelectorAll('.algorithm-code-line')];
  const location = root.querySelector('.algorithm-code-location');
  const operation = root.querySelector('.algorithm-code-action');
  const variables = root.querySelector('.algorithm-code-variables');
  const wrap = root.querySelector('.algorithm-code-wrap');
  let previousLines = '';
  let active = [];
  function followLine() {
    if (!active.length || !listing.clientHeight) return;
    const bounds = listing.getBoundingClientRect();
    const first = rows[active[0] - 1].getBoundingClientRect();
    const last = rows[active[active.length - 1] - 1].getBoundingClientRect();
    if (last.bottom - first.top > listing.clientHeight - 24) listing.scrollTop += first.top - bounds.top - 12;
    else if (last.bottom > bounds.bottom - 12) listing.scrollTop += last.bottom - bounds.bottom + 12;
    else if (first.top < bounds.top + 12) listing.scrollTop -= bounds.top - first.top + 12;
  }
  // Wrapping changes row heights when the window or panel width changes.
  resizeObservers.get(root)?.disconnect();
  const resizeObserver = new ResizeObserver(followLine);
  resizeObserver.observe(listing);
  resizeObservers.set(root, resizeObserver);
  wrap.onclick = () => {
    const wrapped = listing.classList.toggle('is-wrapped');
    wrap.setAttribute('aria-pressed', String(wrapped));
    if (wrapped) listing.scrollLeft = 0;
    followLine();
  };
  function update(frame) {
    active = [...new Set((frame.codeLines || []).filter(line => Number.isInteger(line) && line >= 1 && line <= rows.length))].sort((left, right) => left - right);
    rows.forEach((row, index) => {
      const current = active.includes(index + 1);
      row.classList.toggle('is-current', current);
      row.querySelector('.algorithm-code-pointer').textContent = current ? '→' : '';
      if (current) row.setAttribute('aria-current', 'step');
      else row.removeAttribute('aria-current');
    });
    location.textContent = active.length ? `${active.length === 1 ? 'Line' : 'Lines'} ${active.join(', ')}` : 'Ready';
    operation.textContent = active.length ? frame.operation || 'Current operation' : 'Choose Play or Step to begin';
    variables.innerHTML = (frame.variables || []).map(([name, value]) => {
      const formatted = formatValue(value);
      const wide = Array.isArray(value) || formatted.length > 34 || name.length > 20 || name === 'call stack';
      return `<div class="${wide ? 'is-wide' : ''}"><dt><code>${escape(name)}</code></dt><dd><code>${escape(formatted)}</code></dd></div>`;
    }).join('') || '<div class="is-wide"><dt class="sr-only">Variables</dt><dd class="hint">Values appear when playback starts.</dd></div>';
    const currentLines = active.join(',');
    // Follow a changed line inside the listing, never scroll the page itself.
    if (currentLines !== previousLines) followLine();
    previousLines = currentLines;
  }
  update({});
  return {update};
}
