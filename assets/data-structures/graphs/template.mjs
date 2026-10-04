export const template = `<div class="lab-layout">
  <aside class="panel controls">
    <h3>Build a graph</h3>
    <label for="graph-format">Input format</label><select id="graph-format"><option value="edges">Edge list</option><option value="matrix">Adjacency matrix</option></select>
    <label for="graph-input">Graph data (JSON)</label><textarea id="graph-input" rows="4">[[0,1],[0,2],[1,3],[2,3],[3,4]]</textarea>
    <label class="checkbox"><input id="directed" type="checkbox"> Directed graph</label>
    <p class="hint">Edges use integer node IDs. Matrices use 0/1 and label nodes from 0; undirected matrices must be symmetric.</p>
    <button class="primary" id="build-graph">Build graph</button>
    <hr><h3>Add connections</h3>
    <label for="graph-node">Node ID</label><input id="graph-node" type="number" value="5">
    <button id="add-graph-node">Add isolated node</button>
    <div class="two-col"><div><label for="edge-from">From</label><input id="edge-from" type="number" value="4"></div><div><label for="edge-to">To</label><input id="edge-to" type="number" value="5"></div></div>
    <button id="add-edge">Add edge</button>
    <p class="hint">New endpoint IDs are added automatically. Limit: 16 nodes, including isolated nodes.</p>
    <button class="quiet" id="clear-graph">Clear graph</button>
    <p id="graph-error" class="error" role="alert"></p>
  </aside>
  <div>
    <div class="canvas-panel"><div class="canvas-heading"><span id="graph-title">UNDIRECTED GRAPH</span><span id="graph-count"></span></div><div class="svg-scroll"><svg id="graph-svg" viewBox="0 0 800 460" role="img" aria-label="Graph visualization"></svg></div><div class="canvas-caption" id="graph-caption"></div></div>
    <div class="insight"><span>NOTES</span><p>Graphs describe connections between nodes. Directed edges point from one node to another; undirected edges connect both ways. A 1 in matrix row i, column j means an edge from i to j. Matrix rows can preserve isolated nodes.</p></div>
    <details class="panel"><summary>Accessible text representation</summary><pre id="graph-text"></pre></details>
  </div>
</div>`;
