import {createTrace} from './trace.mjs';
import {sortingAlgorithms} from './registry.mjs';

export function sortingSteps(input, id) {
  const algorithm = sortingAlgorithms.find(item => item.id === id);
  if (!algorithm) throw Error('Unknown sorting algorithm.');
  const trace = createTrace(input);
  trace.record('Ready. Follow the highlighted values through each operation.', [], {operation: 'Ready', variables: [['values', trace.values]]});
  algorithm.sort(trace);
  trace.record('Sorted! Every value is in ascending order. Return the array.', [], {
    codeLines: [algorithm.code.returnLine], operation: 'Return sorted array', variables: [['values', trace.values]]
  });
  return trace.steps;
}
