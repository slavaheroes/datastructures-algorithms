export const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[c]));

// Each lesson supplies immutable snapshots; this component only controls playback.
export function mountSequencePlayback(root, config) {
  root.innerHTML = `<p>${escape(config.description)}</p><form class="sequence-form">
    ${config.inputs.map(field => `<div><label for="${config.id}-${field.key}">${escape(field.label)}</label><input id="${config.id}-${field.key}" name="${field.key}" value="${escape(field.value)}" aria-describedby="${config.id}-hint" ${field.type === 'number' ? 'type="number" step="1"' : ''}></div>`).join('')}
    <button type="submit">Load input</button></form><p class="hint" id="${config.id}-hint">${escape(config.hint)}</p>
    ${config.modes.length > 1 ? `<label for="${config.id}-mode">Solution version</label><select id="${config.id}-mode" data-role="mode">${config.modes.map((mode, i) => `<option value="${i}">${escape(mode.label)}</option>`).join('')}</select>` : ''}
    <p class="error" data-role="error" role="alert"></p><p class="height-legend">${escape(config.legend)}</p>
    <div data-role="drawing" class="sequence-drawing"></div>
    <p class="height-message" data-role="message" aria-live="off"></p><dl class="height-stats" data-role="stats"></dl>
    <div class="height-controls"><button type="button" class="primary" data-action="play">Play</button><button type="button" data-action="back">← Back</button><button type="button" data-action="step">Step →</button><button type="button" data-action="reset">Reset</button><label for="${config.id}-speed">Speed</label><select id="${config.id}-speed" data-role="speed"><option value="1400">Slow</option><option value="850" selected>Normal</option><option value="400">Fast</option></select><span class="hint" data-role="progress"></span></div>
    <p class="sr-only" data-role="announcement" aria-live="polite"></p><p class="hint">Playback stores snapshots. Complexity describes the Python algorithm, excluding these snapshots.</p>`;
  const find = role => root.querySelector(`[data-role="${role}"]`);
  const button = action => root.querySelector(`[data-action="${action}"]`);
  const form = root.querySelector('form'), disclosure = root.closest('details');
  let input, frames = [], position = 0, timer = null;
  const mode = () => config.modes[Number(find('mode')?.value || 0)];
  function pause() { clearTimeout(timer); timer = null; button('play').textContent = 'Play'; }
  function render(announce = false) {
    const frame = frames[position];
    const scrollPositions = [...find('drawing').querySelectorAll('.svg-scroll')].map(region => region.scrollLeft);
    find('drawing').innerHTML = config.render ? config.render(frame, input) : renderSequence(frame, input);
    find('drawing').querySelectorAll('.svg-scroll').forEach((region, i) => { region.scrollLeft = scrollPositions[i] || 0; });
    const focus = find('drawing').querySelector('[data-follow]');
    if (focus) {
      const region = focus.closest('.svg-scroll'), bounds = region.getBoundingClientRect(), item = focus.getBoundingClientRect();
      if (item.right > bounds.right) region.scrollLeft += item.right - bounds.right + 16;
      else if (item.left < bounds.left) region.scrollLeft -= bounds.left - item.left + 16;
    }
    find('message').textContent = frame.message;
    find('stats').innerHTML = (frame.stats || []).map(([label, value]) => `<div><dt>${escape(label)}</dt><dd>${escape(value)}</dd></div>`).join('');
    find('progress').textContent = `Step ${position} of ${frames.length - 1}`;
    button('back').disabled = position === 0;
    button('step').disabled = button('play').disabled = position === frames.length - 1;
    if (announce) find('announcement').textContent = frame.message;
  }
  function load() {
    pause();
    try {
      const candidate = config.parse(Object.fromEntries(new FormData(form)));
      const nextFrames = mode().trace(candidate);
      input = candidate; frames = nextFrames; position = 0;
      find('error').textContent = '';
      render(true);
    } catch (error) { find('error').textContent = error.message; }
  }
  function advance(announce = false) {
    if (position < frames.length - 1) position++;
    render(announce);
    if (position === frames.length - 1) { pause(); find('announcement').textContent = frames[position].message; }
  }
  function tick() { advance(); if (position < frames.length - 1) timer = setTimeout(tick, Number(find('speed').value)); }
  form.onsubmit = event => { event.preventDefault(); load(); };
  button('step').onclick = () => { pause(); advance(true); };
  button('back').onclick = () => { pause(); position = Math.max(0, position - 1); render(true); };
  button('reset').onclick = () => { pause(); position = 0; render(true); };
  button('play').onclick = () => {
    if (timer !== null) { pause(); return; }
    button('play').textContent = 'Pause'; timer = setTimeout(tick, Number(find('speed').value));
  };
  if (find('mode')) find('mode').onchange = () => { pause(); frames = mode().trace(input); position = 0; render(true); };
  const onToggle = () => { if (!disclosure.open) pause(); };
  const onVisibility = () => { if (document.hidden) pause(); };
  disclosure?.addEventListener('toggle', onToggle);
  document.addEventListener('visibilitychange', onVisibility);
  load();
  return () => { pause(); disclosure?.removeEventListener('toggle', onToggle); document.removeEventListener('visibilitychange', onVisibility); };
}

export function renderSequence(frame, input) {
  const values = input.values;
  return `<div class="svg-scroll"><ol class="sequence-cells" aria-label="Input values, indices, and pointers">${values.map((value, i) => {
    const labels = [i === frame.left ? 'L' : '', i === frame.right ? 'R' : '', i === frame.current ? 'i' : ''].filter(Boolean);
    const inside = i >= frame.left && i <= frame.right;
    return `<li ${i === (frame.current ?? frame.right) ? 'data-follow' : ''} class="${inside ? 'in-window' : ''} ${labels.length ? 'at-pointer' : ''}"><span class="sequence-index">${i}</span><strong>${escape(value === ' ' ? '␠' : value)}</strong><span class="sequence-pointer">${labels.join('/') || '·'}</span><span class="sr-only">${inside ? 'inside window' : 'outside window'}</span></li>`;
  }).join('')}</ol>${values.length ? '' : '<p>Empty input</p>'}</div>
    ${frame.rows ? `<div class="height-table svg-scroll"><table><caption>${escape(frame.caption || 'Algorithm state')}</caption><thead><tr>${frame.columns.map(c => `<th scope="col">${escape(c)}</th>`).join('')}</tr></thead><tbody>${frame.rows.map(row => `<tr>${row.map(c => `<td>${escape(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>` : ''}
    ${frame.detail ? `<p class="sequence-detail">${escape(frame.detail)}</p>` : ''}`;
}

export function integer(value, min, max, label) {
  if (String(value).trim() === '' || !Number.isInteger(Number(value)) || Number(value) < min || Number(value) > max) throw Error(`${label} must be an integer from ${min} to ${max}.`);
  return Number(value);
}
export function numbers(text, min = -999) {
  let values;
  try { values = JSON.parse(text); } catch { throw Error('Enter a JSON array, such as [1,3,-1,5].'); }
  if (!Array.isArray(values) || values.length > 32 || values.some(v => !Number.isInteger(v) || v < min || v > 999)) throw Error(`Use at most 32 integers from ${min} to 999.`);
  return values;
}
export function characters(text, pattern = /^[\x20-\x7e]*$/) {
  if (text.length > 32 || !pattern.test(text)) throw Error('Use at most 32 characters in the alphabet described above.');
  return [...text];
}
