import {mountSections} from './sections.mjs';
import {mountSorting} from '../sorting/visualizer.mjs';
import {sortingAlgorithms} from '../sorting/registry.mjs';

export function mount(root) {
  return mountSections(root, {
    id: 'algorithms', title: 'Algorithms',
    description: 'Choose a sorting algorithm to step through its operations and understand its complexity.',
    sections: sortingAlgorithms.map(algorithm => ({
      id: `${algorithm.id}-sort`, title: algorithm.label,
      description: {
        bubble: 'Compare neighboring values and swap them until the array is sorted.',
        merge: 'Split the array into smaller parts, then merge them in sorted order.',
        quick: 'Choose a pivot and partition values before sorting each partition.'
      }[algorithm.id] || algorithm.explanation,
      mount: container => mountSorting(container, {algorithmId: algorithm.id})
    }))
  });
}
