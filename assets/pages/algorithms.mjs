import {mountSections} from './sections.mjs';
import {mountSorting} from '../sorting/visualizer.mjs';

export function mount(root) {
  return mountSections(root, {
    id: 'algorithms', title: 'Algorithms',
    description: 'Step through algorithms and compare their operations and complexity.',
    sections: [
      {id: 'sorting', title: 'Sorting algorithms', description: 'Compare Bubble Sort, Merge Sort, and Quick Sort one operation at a time.', mount: mountSorting}
    ]
  });
}
