import {mountSections} from './sections.mjs';
import {mountTrees} from '../data-structures/trees/visualizer.mjs';
import {mountGraph} from '../data-structures/graphs/visualizer.mjs';

export function mount(root) {
  return mountSections(root, {
    id: 'data-structures', title: 'Data Structures Visualizer',
    description: 'Build and inspect data structures from JSON input or add nodes and connections manually.',
    sections: [
      {id: 'trees', title: 'Trees', description: 'Build one or more binary trees from compact level-order arrays.', mount: mountTrees},
      {id: 'graphs', title: 'Graphs', description: 'Build directed or undirected graphs from edge lists or adjacency matrices.', mount: mountGraph}
    ]
  });
}
