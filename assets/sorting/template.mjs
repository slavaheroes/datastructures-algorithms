export const template = `<div class="sort-config panel">
  <div><label for="sort-algorithm">Algorithm</label><select id="sort-algorithm"></select></div>
  <div class="grow"><label for="sort-input">Your array (up to 32 integers, −999 to 999)</label><input id="sort-input" value="[38,12,65,24,52,8,43,19]"></div>
  <button id="load-sort">Load array</button><button id="random-sort">Shuffle</button>
</div>
<p class="error" id="sort-error" role="alert"></p>
<div class="canvas-panel">
  <div class="canvas-heading"><span id="sort-name">BUBBLE SORT</span><span><span class="legend-dot"></span> Active operation</span></div>
  <div id="sort-bars" aria-label="Array visualization"></div>
  <p class="sort-message" id="sort-message" aria-live="polite"></p>
  <div class="playback">
    <button id="sort-play" class="primary">Play</button><button id="sort-step">Step →</button><button id="sort-reset">Reset</button>
    <label for="sort-speed">Speed <input id="sort-speed" type="range" min="1" max="10" value="5"></label><span id="sort-progress"></span>
  </div>
</div>
<div class="sort-facts">
  <div class="panel"><span class="eyebrow">OPERATIONS SO FAR</span><h3 id="sort-stats"></h3><p class="hint">Writes count changes to the displayed array.</p></div>
  <div class="panel"><span class="eyebrow">COMPLEXITY</span><p id="sort-explanation"></p><p class="hint">Complexities describe the algorithm. This teaching tool also stores snapshots for playback.</p></div>
</div>`;
