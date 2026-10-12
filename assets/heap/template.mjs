export const template = `<section class="heap-build panel" aria-labelledby="heap-build-title">
  <h2 id="heap-build-title">Build a heap</h2>
  <div class="heap-config">
    <div class="heap-input-field"><label for="heap-input">Array to heapify (up to 16 integers)</label><input id="heap-input" value="[12,3,9,1,8,2,7]" aria-describedby="heap-input-hint heap-error" spellcheck="false"></div>
    <div><label for="heap-mode">Type for heapify</label><select id="heap-mode"><option value="min">Min heap</option><option value="max">Max heap</option></select></div>
    <button id="heap-load">Heapify array</button>
  </div>
  <p class="hint" id="heap-input-hint">Use a JSON array; [] starts an empty heap. Heapify replaces the current heap. Values may repeat.</p>
  <div class="heap-operations">
    <div><label for="heap-value">Value to push</label><input id="heap-value" value="4" inputmode="numeric" aria-describedby="heap-operation-hint heap-error"></div>
    <button id="heap-push">heappush</button><button id="heap-pop">heappop</button>
    <p class="hint" id="heap-operation-hint">Push and pop use the completed heap below. Finish playback before starting the next operation.</p>
  </div>
</section>
<p class="error" id="heap-error" role="alert"></p>
<div class="algorithm-workspace">
<section class="heap-workspace canvas-panel" aria-labelledby="heap-operation-title">
  <div class="canvas-heading"><strong id="heap-operation-title">Min heap · heapify</strong><span id="heap-count"></span></div>
  <p class="heap-status" id="heap-state" role="status" aria-live="polite"></p>
  <div class="heap-legend"><span><span class="heap-active-key" aria-hidden="true"></span>Outlined indices: current operation</span><span><span class="heap-edge-key" aria-hidden="true"></span>Dashed edge: parent order being repaired</span></div>
  <div id="heap-diagram"></div>
  <div class="heap-frame-text"><p id="heap-message"></p><p class="hint" id="heap-property"></p><p id="heap-return" hidden></p></div>
  <p class="heap-announcement" id="heap-announcement" aria-live="polite" aria-atomic="true"></p>
  <div class="playback heap-playback">
    <button class="primary" id="heap-play">Play</button><button id="heap-back">← Back</button><button id="heap-step">Step →</button><button id="heap-reset">Reset</button>
    <label for="heap-speed">Speed <input id="heap-speed" type="range" min="1" max="10" value="5"></label><span id="heap-progress"></span>
  </div>
</section>
<section id="heap-code" class="algorithm-code-panel panel" aria-label="Algorithm code and current operation"></section>
</div>
<div class="heap-notes">
  <section class="panel"><h2>Heap property and indices</h2><p id="heap-order-explanation"></p><p>Both views show the same array. Index <code>i</code> has children <code>2i + 1</code> and <code>2i + 2</code>. Its parent is <code>floor((i − 1) / 2)</code> when <code>i &gt; 0</code>.</p><p class="hint">A binary heap is a complete binary tree. It orders parents against their children; it does not sort all values.</p></section>
  <section class="panel"><h2>Operations and complexity</h2><dl class="heap-complexity"><div><dt>heapify</dt><dd>O(n) time: repair subtrees from the last parent up to the root. Most nodes are close to the leaves and move only a short distance.</dd></div><div><dt>heappush</dt><dd>O(log n) time: append, then sift up along one path.</dd></div><div><dt>heappop</dt><dd>O(log n) time: remove the root, replace it with the last value, then sift down along one path.</dd></div><div><dt>Peek at the root</dt><dd>O(1) time: read array index 0 when the heap is not empty.</dd></div></dl><p class="hint">These operations use O(1) auxiliary space with an iterative sift. This visualizer also stores snapshots for playback.</p></section>
  <section class="panel heap-python"><h2>Python heapq</h2><p>For a min heap, use <code>heapq.heapify(heap)</code>, <code>heapq.heappush(heap, value)</code>, and <code>heapq.heappop(heap)</code>. Python 3.14 provides the matching max-heap functions <code>heapify_max</code>, <code>heappush_max</code>, and <code>heappop_max</code>. Read <code>heap[0]</code> to peek.</p><p class="hint">The steps show a conventional sift-down and sift-up explanation. Python can use a different internal sequence of comparisons and moves while maintaining the same heap property.</p><p class="heap-stats" id="heap-stats"></p></section>
</div>`;
