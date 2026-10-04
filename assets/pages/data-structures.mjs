import {mountSections} from './sections.mjs';
import {mountTrees} from '../data-structures/trees/visualizer.mjs';
import {mountGraph} from '../data-structures/graphs/visualizer.mjs';

export function mount(root) {
  return mountSections(root, {
    id: 'data-structures', title: 'Data structures',
    description: 'Choose a data structure to build and inspect. Each visualizer has its own inputs and workspace.',
    sections: [
      {id: 'trees', title: 'Trees', description: 'Build one or more binary trees from compact level-order arrays.', mount: mountTrees},
      {id: 'graphs', title: 'Graphs', description: 'Build directed or undirected graphs from edge lists or adjacency matrices.', mount: mountGraph}
    ]
  });
}
