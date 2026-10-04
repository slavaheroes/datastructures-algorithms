import {NODE_LIMIT} from '../../shared/input.mjs';
import {byId, guarded, integer} from '../../shared/dom.mjs';
import {buildGraph} from './model.mjs';
import {graphDrawing, graphText} from './view.mjs';
import {template} from './template.mjs';

export function mountGraph(root) {
  root.innerHTML = template;
  const $ = id => byId(root, id);
  const attempt = action => guarded($('graph-error'), action);
  let graph = buildGraph([[0,1],[0,2],[1,3],[2,3],[3,4]], 'edges', false), directed = false;

  function render() {
    $('graph-title').textContent = `${directed ? 'DIRECTED' : 'UNDIRECTED'} GRAPH`;
    $('graph-count').textContent = `${graph.nodes.length} nodes · ${graph.edges.length} edges`;
    $('graph-caption').textContent = graph.nodes.length ? 'Circular layout · Node positions are for readability, not distance or weight.' : 'Empty graph. Build from data or add an isolated node.';
    $('graph-svg').innerHTML = graphDrawing(graph, directed);
    $('graph-text').textContent = graphText(graph, directed);
  }

  $('graph-format').onchange = () => {
    $('graph-input').value = $('graph-format').value === 'matrix' ? '[[0,1,1],[1,0,0],[1,0,0]]' : '[[0,1],[0,2],[1,3],[2,3],[3,4]]';
  };
  $('build-graph').onclick = () => attempt(() => {
    const next = buildGraph(JSON.parse($('graph-input').value), $('graph-format').value, $('directed').checked);
    graph = next;
    directed = $('directed').checked;
    render();
  });
  $('directed').onchange = () => attempt(() => {
    directed = $('directed').checked;
    const next = buildGraph(graph.edges, 'edges', directed);
    graph = {nodes: graph.nodes, edges: next.edges};
    render();
  });
  $('add-graph-node').onclick = () => attempt(() => {
    const id = integer($('graph-node'));
    if (graph.nodes.includes(id)) throw Error('That node ID already exists.');
    if (graph.nodes.length >= NODE_LIMIT) throw Error('Keep graphs at 16 nodes or fewer.');
    graph.nodes.push(id);
    render();
  });
  $('add-edge').onclick = () => attempt(() => {
    const next = buildGraph([...graph.edges, [integer($('edge-from')), integer($('edge-to'))]], 'edges', directed);
    next.nodes = [...new Set([...graph.nodes, ...next.nodes])];
    if (next.nodes.length > NODE_LIMIT) throw Error('Keep graphs at 16 nodes or fewer.');
    graph = next;
    render();
  });
  $('clear-graph').onclick = () => attempt(() => { graph = {nodes: [], edges: []}; $('graph-input').value = '[]'; render(); });
  render();
}
