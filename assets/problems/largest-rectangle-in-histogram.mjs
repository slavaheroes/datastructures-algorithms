export default {
  "pattern": "Monotonic stack with start indices",
  "problem": "Given nonnegative bar heights, each with width 1, find the largest rectangular area contained in the histogram.",
  "example": "heights = [2, 1, 5, 6, 2, 3]\nOutput: 10\nThe bars at indices 2 and 3 support height 5 across width 2.",
  "insight": "Keep (height, earliest start index) entries with non-decreasing heights. When a shorter bar arrives, taller entries can extend no farther right. Pop each one and calculate height * (current index - start). The shorter bar inherits the earliest start of the entries it removes.",
  "steps": [
    "The implementation appends a zero sentinel and initializes the stack with the first bar. At index 1, height 1 pops height 2: area = 2*(1-0) = 2. Push (1,0).",
    "Indices 2 and 3 push (5,2) and (6,3). At index 4, height 2 pops (6,3): area = 6*(4-3) = 6.",
    "Still at index 4, pop (5,2): area = 5*(4-2) = 10. Push (2,2), carrying the earlier start index forward.",
    "Index 5 pushes (3,5). The zero sentinel at index 6 pops heights 3, 2, and 1, evaluating the remaining positive-height rectangles. The maximum stays 10."
  ],
  "complexity": "O(n) amortized time and O(n) extra space. Each stack entry is pushed once and popped at most once. Appending the sentinel may also resize the input list.",
  "pitfall": "The source mutates heights by appending 0. Width is i - start, because the current shorter bar is excluded. Equal heights remain in the stack because the comparison is strictly <; an empty input returns 0 after the sentinel is appended."
};

// This lesson owns its visualization. The shared renderer calls this hook only
// while the lesson is selected and calls the returned cleanup on navigation.
export function mountVisualization(root) {
  root.innerHTML = `<p>Step through the existing solution. Orange marks the current bar; the outlined rectangle is the candidate being evaluated. Stack entries show (height, earliest start index).</p>
    <label for="histogram-input">Bar heights</label><div class="histogram-input-row"><input id="histogram-input" value="[2,1,5,6,2,3]"><button type="button" data-action="load">Load heights</button></div>
    <p class="hint">Up to 16 nonnegative integer heights, each at most 999. S is the appended zero sentinel.</p><p class="error" role="alert" data-role="error"></p>
    <div class="svg-scroll"><svg class="histogram-svg" role="img" aria-label="Histogram"></svg></div>
    <p class="histogram-message" aria-live="polite" data-role="message"></p>
    <p data-role="area"></p><div class="histogram-stack"><span>Stack (bottom → top)</span><ol data-role="stack"></ol></div>
    <div class="histogram-controls"><button type="button" class="primary" data-action="play">Play</button><button type="button" data-action="step">Step →</button><button type="button" data-action="reset">Reset</button><span class="hint" data-role="progress"></span></div>
    <p class="hint">Playback uses a copy of your heights. The Python source itself appends 0 to its input list. This visualization stores snapshots for playback.</p>`;
  const find = role => root.querySelector(`[data-role="${role}"]`);
  const button = action => root.querySelector(`[data-action="${action}"]`);
  const svg = root.querySelector('svg');
  const input = root.querySelector('input');
  const disclosure = root.closest('details');
  let heights = [], frames = [], position = 0, timer = null;

  function snapshotSteps(values) {
    const bars = [...values, 0];
    const stack = [[bars[0], 0]], steps = [];
    let maxArea = 0, best = null;
    const save = (index, message, candidate = null) => steps.push({index, message, candidate, maxArea, stack: stack.map(entry => [...entry])});
    save(0, `Append a zero sentinel. Initialize the stack with (${bars[0]}, 0).`);
    for (let i = 1; i < bars.length; i++) {
      let start = i;
      save(i, `Read index ${i}${i === values.length ? ' (sentinel)' : ''}: height ${bars[i]}. Compare it with the stack's top height.`);
      while (stack.length && bars[i] < stack[stack.length - 1][0]) {
        const [height, left] = stack.pop();
        const area = height * (i - left);
        const candidate = {height, left, right: i, area};
        if (area > maxArea) { maxArea = area; best = candidate; }
        start = left;
        save(i, `Pop (${height}, ${left}). Width = ${i} - ${left} = ${i - left}; area = ${height} × ${i - left} = ${area}. Carry start ${start} into the shorter bar.`, candidate);
      }
      stack.push([bars[i], start]);
      save(i, `Push (${bars[i]}, ${start}). ${start < i ? 'The current height can extend left to the inherited start.' : 'The current height starts at its own index.'}`);
    }
    save(bars.length - 1, `Finished. Largest rectangle area = ${maxArea}. The sentinel closes all remaining positive-height rectangles.`, best);
    return steps;
  }

  function pause() {
    if (timer !== null) clearTimeout(timer);
    timer = null;
    button('play').textContent = 'Play';
  }

  function render() {
    const frame = frames[position], bars = [...heights, 0];
    const width = Math.max(450, bars.length * 44 + 48);
    const cell = (width - 48) / bars.length, base = 218;
    const scale = 165 / Math.max(1, ...heights);
    const candidate = frame.candidate;
    let drawing = `<line x1="24" y1="${base}" x2="${width - 24}" y2="${base}" stroke="#849b77"/>`;
    bars.forEach((height, i) => {
      const x = 24 + i * cell;
      drawing += `<rect class="histogram-bar ${i === frame.index ? 'current' : ''} ${i === heights.length ? 'sentinel' : ''}" x="${x + 3}" y="${base - Math.max(2, height * scale)}" width="${cell - 6}" height="${Math.max(2, height * scale)}"/><text x="${x + cell / 2}" y="${base - height * scale - 9}">${height}</text><text x="${x + cell / 2}" y="${base + 22}">${i === heights.length ? 'S' : i}</text>`;
    });
    if (candidate) {
      drawing += `<rect class="histogram-candidate" x="${24 + candidate.left * cell}" y="${base - candidate.height * scale}" width="${(candidate.right - candidate.left) * cell}" height="${candidate.height * scale}"/>`;
    }
    svg.setAttribute('viewBox', `0 0 ${width} 255`);
    svg.style.minWidth = `${width}px`;
    svg.setAttribute('aria-label', `Bar heights: ${heights.join(', ') || 'empty'}. Current index: ${frame.index}. ${candidate ? `Candidate: height ${candidate.height}, indices ${candidate.left} through ${candidate.right - 1}, area ${candidate.area}.` : ''} Largest area so far: ${frame.maxArea}.`);
    svg.innerHTML = drawing;
    find('message').textContent = frame.message;
    find('area').textContent = `Largest area so far: ${frame.maxArea}${candidate ? ` · Candidate area: ${candidate.area}` : ''}`;
    find('stack').innerHTML = frame.stack.map(([height, start]) => `<li>(${height}, ${start})</li>`).join('');
    if (!frame.stack.length) find('stack').innerHTML = '<li>Empty</li>';
    find('progress').textContent = `${position} / ${frames.length - 1} steps`;
    const finished = position === frames.length - 1;
    button('step').disabled = finished;
    button('play').disabled = finished;
  }

  function load() {
    pause();
    find('error').textContent = '';
    try {
      const values = JSON.parse(input.value);
      if (!Array.isArray(values) || values.length > 16 || values.some(value => !Number.isInteger(value) || value < 0 || value > 999)) {
        throw Error('Enter a JSON array with at most 16 integer heights between 0 and 999.');
      }
      heights = values;
      frames = snapshotSteps(heights);
      position = 0;
      render();
    } catch (error) { find('error').textContent = error instanceof SyntaxError ? 'Enter a JSON array, such as [2,1,5,6,2,3].' : error.message; }
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
  button('reset').onclick = () => { pause(); position = 0; render(); };
  button('step').onclick = () => { pause(); advance(); };
  button('play').onclick = () => {
    if (timer !== null) { pause(); return; }
    button('play').textContent = 'Pause';
    timer = setTimeout(tick, 850);
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
