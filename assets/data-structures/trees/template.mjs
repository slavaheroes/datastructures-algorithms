export const template = `<div class="lab-layout">
  <aside class="panel controls">
    <h3>Build trees</h3>
    <label for="tree-array">Level-order array(s)</label>
    <textarea id="tree-array" rows="3">[8,3,10,1,6,9,14]</textarea>
    <p class="hint">Enter one array, such as [1,2,3], or multiple arrays: [[1,2,3],[4,null,5]]. Use null for missing children. Limit: 16 nodes per tree; null does not count.</p>
    <button class="primary" id="build-tree">Build trees</button>
    <hr><h3>Edit a tree</h3>
    <label for="tree-picker">Tree</label><select id="tree-picker"></select>
    <button id="new-tree">Add empty tree</button>
    <label for="tree-value">Integer value</label><input id="tree-value" type="number" value="5">
    <label for="tree-parent">Parent node</label><select id="tree-parent"></select>
    <label for="tree-side">Child position</label><select id="tree-side"><option value="left">Left</option><option value="right">Right</option></select>
    <button id="add-tree">Add node</button>
    <button class="quiet" id="clear-tree">Clear selected tree</button>
    <button class="quiet" id="clear-trees">Clear all trees</button>
    <p id="tree-error" class="error" role="alert"></p>
  </aside>
  <div>
    <div id="tree-gallery"></div>
    <div class="insight"><span>NOTES</span><p>Each array creates a separate binary tree. Use null for missing children; only existing parents consume the next pair of values. Each tree allows up to 16 actual nodes. Select a tree before adding a node manually.</p></div>
    <details class="panel"><summary>Accessible text representation</summary><pre id="tree-text"></pre></details>
  </div>
</div>`;
