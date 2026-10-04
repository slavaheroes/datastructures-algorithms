import {NODE_LIMIT} from '../../shared/input.mjs';
import {svgNode} from '../../shared/dom.mjs';

export function treeGallery(trees) {
  return trees.map((tree, index) => {
    const points = new Map();
    let rank = 0, maxDepth = 0;
    function layout(id, depth) {
      if (id === null) return;
      const node = tree[id];
      layout(node.left, depth + 1);
      points.set(id, {x: rank++, depth});
      maxDepth = Math.max(depth, maxDepth);
      layout(node.right, depth + 1);
    }
    if (tree.length) layout(0, 0);
    const width = Math.max(420, tree.length * 65), height = Math.max(280, 130 + maxDepth * 90);
    for (const point of points.values()) {
      point.x = (point.x + 1) * width / (tree.length + 1);
      point.y = 65 + point.depth * 90;
    }
    let edges = '', nodes = '';
    for (const node of tree) {
      const point = points.get(node.id);
      for (const side of ['left', 'right']) {
        if (node[side] !== null) {
          const child = points.get(node[side]);
          edges += `<path class="edge" d="M${point.x} ${point.y} L${child.x} ${child.y}"/>`;
        }
      }
      nodes += svgNode(point.x, point.y, node.value);
    }
    const caption = tree.length ? `Root: ${tree[0].value} · Height: ${maxDepth} edges` : 'Empty tree. Select this tree and add a node to create its root.';
    const drawing = edges + nodes || `<text x="${width / 2}" y="140" text-anchor="middle" fill="#58636b">Empty tree</text>`;
    return `<section class="canvas-panel"><div class="canvas-heading"><span>Tree ${index + 1}</span><span>${tree.length}/${NODE_LIMIT} nodes</span></div><div class="svg-scroll"><svg class="tree-svg" viewBox="0 0 ${width} ${height}" style="min-width:${width}px" role="img" aria-label="Tree ${index + 1}, ${tree.length} nodes">${drawing}</svg></div><div class="canvas-caption">${caption}</div></section>`;
  }).join('');
}

export function treeText(trees) {
  return trees.map((tree, index) => `Tree ${index + 1}:\n` + (tree.map(node => `Node ${node.id}: value ${node.value}; left ${node.left === null ? 'none' : `node ${node.left}`}; right ${node.right === null ? 'none' : `node ${node.right}`}`).join('\n') || 'Empty tree')).join('\n\n');
}
