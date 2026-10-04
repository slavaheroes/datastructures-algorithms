import {createTrace} from './trace.mjs';
import {sortingAlgorithms} from './registry.mjs';

export function sortingSteps(input, id) {
  const algorithm = sortingAlgorithms.find(item => item.id === id);
  if (!algorithm) throw Error('Unknown sorting algorithm.');
  const trace = createTrace(input);
  trace.record('Ready. Follow the highlighted values through each operation.');
  algorithm.sort(trace);
  trace.record('Sorted! Every value is in ascending order.');
  return trace.steps;
}
