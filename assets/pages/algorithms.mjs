import {mountSections} from './sections.mjs';
import {mountSorting} from '../sorting/visualizer.mjs';
import {sortingAlgorithms} from '../sorting/registry.mjs';
import {mountHeap} from '../heap/visualizer.mjs';
import {graphAlgorithms} from '../graph-algorithms/registry.mjs';
import {mountGraphAlgorithm} from '../graph-algorithms/visualizer.mjs';

export function mount(root) {
  return mountSections(root, {
    id: 'algorithms', title: 'Algorithms',
    description: 'Step through sorting, heap operations, and graph algorithms with explanations, Python code, and complexity.',
    sections: [...sortingAlgorithms.map(algorithm => ({
      id: `${algorithm.id}-sort`, title: algorithm.label,
      description: {
        bubble: 'Compare neighboring values and swap them until the array is sorted.',
        merge: 'Split the array into smaller parts, then merge them in sorted order.',
        quick: 'Choose a pivot and partition values before sorting each partition.'
      }[algorithm.id] || algorithm.explanation,
      mount: container => mountSorting(container, {algorithmId: algorithm.id})
    })), {
      id: 'heap', title: 'Heap',
      description: 'Build a heap with heapify, then follow heappush and heappop in its array and tree.',
      mount: mountHeap
    }, ...graphAlgorithms.map(algorithm => ({
      id: algorithm.id, title: algorithm.title, description: algorithm.summary,
      mount: container => mountGraphAlgorithm(container, algorithm)
    }))]
  });
}
