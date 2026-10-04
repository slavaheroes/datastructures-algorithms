import {NODE_LIMIT} from '../../shared/input.mjs';
import {byId, guarded, integer} from '../../shared/dom.mjs';
import {buildTrees, addTreeNode} from './model.mjs';
import {treeGallery, treeText} from './view.mjs';
import {template} from './template.mjs';

export function mountTrees(root) {
  root.innerHTML = template;
  const $ = id => byId(root, id);
  const attempt = action => guarded($('tree-error'), action);
  let trees = buildTrees([8,3,10,1,6,9,14]), selectedTree = 0;

  function render() {
    $('tree-picker').innerHTML = trees.map((tree, index) => `<option value="${index}">Tree ${index + 1} (${tree.length}/${NODE_LIMIT} nodes)</option>`).join('');
    $('tree-picker').value = String(selectedTree);
    const tree = trees[selectedTree], parent = $('tree-parent').value;
    $('tree-parent').innerHTML = tree.map(node => `<option value="${node.id}">${node.value} (node ${node.id})</option>`).join('') || '<option value="">New root</option>';
    if (tree.some(node => String(node.id) === parent)) $('tree-parent').value = parent;
    $('tree-gallery').innerHTML = treeGallery(trees);
    $('tree-text').textContent = treeText(trees);
  }

  $('build-tree').onclick = () => attempt(() => {
    trees = buildTrees(JSON.parse($('tree-array').value));
    selectedTree = 0;
    render();
  });
  $('add-tree').onclick = () => attempt(() => {
    trees[selectedTree] = addTreeNode(trees[selectedTree], Number($('tree-parent').value), $('tree-side').value, integer($('tree-value')));
    render();
  });
  $('tree-picker').onchange = () => attempt(() => { selectedTree = Number($('tree-picker').value); render(); });
  $('new-tree').onclick = () => attempt(() => { trees.push([]); selectedTree = trees.length - 1; render(); });
  $('clear-tree').onclick = () => attempt(() => { trees[selectedTree] = []; render(); });
  $('clear-trees').onclick = () => attempt(() => { trees = [[]]; selectedTree = 0; $('tree-array').value = '[]'; render(); });
  render();
}
