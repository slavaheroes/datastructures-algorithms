const escape = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[char]));

// Controls and drawing are shared; each problem owns its algorithm snapshots.
export function mountHeightPlayback(root, config) {
  const inputId = `${config.id}-heights`, modeId = `${config.id}-mode`;
  root.innerHTML = `<p>${escape(config.description)}</p>
    ${config.modes.length > 1 ? `<label for="${modeId}">Solution version</label><select id="${modeId}" data-role="mode">${config.modes.map(mode => `<option value="${escape(mode.id)}">${escape(mode.label)}</option>`).join('')}</select>` : ''}
    <label for="${inputId}">Heights</label><div class="height-input-row"><input id="${inputId}" value="${escape(JSON.stringify(config.initial))}"><button type="button" data-action="load">Load heights</button></div>
    <p class="hint">Up to 16 nonnegative integer heights, each at most 999. Indices start at 0.</p><p class="error" data-role="error" role="alert"></p>
    <p class="height-legend">${escape(config.legend)}</p><div class="svg-scroll"><svg class="height-svg" role="img" aria-label="Height visualization"></svg></div>
    <p class="height-message" data-role="message" aria-live="polite"></p><dl class="height-stats" data-role="stats"></dl>
    <div class="height-controls"><button type="button" class="primary" data-action="play">Play</button><button type="button" data-action="step">Step →</button><button type="button" data-action="reset">Reset</button><span class="hint" data-role="progress"></span></div>
    ${config.table ? '<details class="height-values"><summary>Values by index</summary><div class="height-table svg-scroll" data-role="table"></div></details>' : ''}
    <p class="hint">The visualization stores snapshots for playback; the complexity explanation describes the Python algorithm.</p>`;
  const find = role => root.querySelector(`[data-role="${role}"]`);
  const button = action => root.querySelector(`[data-action="${action}"]`);
  const input = root.querySelector('input');
  const svg = root.querySelector('svg');
  const disclosure = root.closest('details');
  let values = [], frames = [], position = 0, timer = null;
  const mode = () => config.modes.find(item => item.id === find('mode')?.value) || config.modes[0];

  function pause() {
    if (timer !== null) clearTimeout(timer);
    timer = null;
    button('play').textContent = 'Play';
  }
  function render() {
    const frame = frames[position];
    renderHeights(svg, values, frame, config.kind);
    find('message').textContent = frame.message;
    find('stats').innerHTML = frame.stats.map(([label, value]) => `<div><dt>${escape(label)}</dt><dd>${escape(value)}</dd></div>`).join('');
    if (config.table) find('table').innerHTML = config.table(frame, values);
    find('progress').textContent = `${position} / ${frames.length - 1} steps`;
    button('play').disabled = button('step').disabled = position === frames.length - 1;
  }
  function load() {
    pause();
    find('error').textContent = '';
    try {
      const nextValues = JSON.parse(input.value);
      if (!Array.isArray(nextValues) || nextValues.length > 16 || nextValues.some(value => !Number.isInteger(value) || value < 0 || value > 999)) {
        throw Error('Enter a JSON array with at most 16 integer heights between 0 and 999.');
      }
      values = nextValues;
      frames = mode().steps(values);
      position = 0;
      render();
    } catch (error) {
      find('error').textContent = error instanceof SyntaxError ? 'Enter a JSON array, such as [2,0,2].' : error.message;
    }
  }
  function advance() {
    if (position < frames.length - 1) position++;
    render();
    if (position === frames.length - 1) pause();
  }
  function tick() {
    advance();
    if (position < frames.length - 1) timer = setTimeout(tick, 850);
  }
  button('load').onclick = load;
  button('step').onclick = () => { pause(); advance(); };
  button('reset').onclick = () => { pause(); position = 0; render(); };
  button('play').onclick = () => {
    if (timer !== null) { pause(); return; }
    button('play').textContent = 'Pause';
    timer = setTimeout(tick, 850);
  };
  if (find('mode')) find('mode').onchange = () => {
    pause();
    frames = mode().steps(values);
    position = 0;
    render();
  };
  const onToggle = () => { if (!disclosure.open) pause(); };
  const onVisibility = () => { if (document.hidden) pause(); };
  disclosure.addEventListener('toggle', onToggle);
  document.addEventListener('visibilitychange', onVisibility);
  load();
  return () => {
    pause();
    disclosure.removeEventListener('toggle', onToggle);
    document.removeEventListener('visibilitychange', onVisibility);
  };
}

function renderHeights(svg, heights, frame, kind) {
  const width = Math.max(480, heights.length * 46 + 48), base = 210;
  const cell = (width - 48) / Math.max(1, heights.length);
  const scale = 160 / Math.max(1, ...heights);
  const center = index => 24 + (index + 0.5) * cell;
  let drawing = `<line x1="24" y1="${base}" x2="${width - 24}" y2="${base}" stroke="#849b77"/>`;
  if (frame.container) {
    const {left, right, height} = frame.container;
    drawing += `<rect class="height-water container-water" x="${center(left)}" y="${base - height * scale}" width="${(right - left) * cell}" height="${height * scale}"/>`;
  }
  heights.forEach((height, index) => {
    const x = 24 + index * cell, barWidth = kind === 'container' ? 10 : cell - 6;
    const units = frame.water?.[index] || 0;
    drawing += `<rect class="height-bar ${index === frame.current ? 'current' : ''} ${index === frame.left ? 'left-pointer' : ''} ${index === frame.right ? 'right-pointer' : ''}" x="${center(index) - barWidth / 2}" y="${base - Math.max(2, height * scale)}" width="${barWidth}" height="${Math.max(2, height * scale)}"/>`;
    if (units > 0) {
      drawing += `<rect class="height-water ${index === frame.current ? 'current-water' : ''}" x="${x + 3}" y="${base - (height + units) * scale}" width="${cell - 6}" height="${units * scale}"/>`;
    }
    drawing += `<text x="${center(index)}" y="${base - Math.max(2, (height + units) * scale) - 9}">${height}</text><text x="${center(index)}" y="${base + 20}">${index}</text>`;
    const pointer = index === frame.left && index === frame.right ? 'L/R' : index === frame.left ? 'L' : index === frame.right ? 'R' : index === frame.current ? 'i' : '';
    if (pointer) drawing += `<text class="height-pointer-label" x="${center(index)}" y="${base + 41}">${pointer}</text>`;
  });
  if (!heights.length) drawing += '<text x="240" y="120">Empty input</text>';
  svg.setAttribute('viewBox', `0 0 ${width} 265`);
  svg.style.minWidth = `${width}px`;
  svg.setAttribute('aria-label', `Heights: ${heights.join(', ') || 'empty'}. ${frame.message} ${frame.stats.map(([label, value]) => `${label}: ${value}`).join('. ')}`);
  svg.innerHTML = drawing;
}
