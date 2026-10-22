import {runSearch} from './search.mjs';

const algorithms = ['dijkstra', 'bellman-ford', 'astar'];
const labels = {dijkstra: 'Dijkstra', 'bellman-ford': 'Bellman–Ford', astar: 'A*'};
const median = samples => {
  const sorted = [...samples].sort((a, b) => a - b), middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
};

self.onmessage = ({data}) => {
  const {id, grid} = data;
  const repeats = Number.isInteger(data.repeats) ? Math.max(3, Math.min(9, data.repeats)) : 7;
  try {
    self.postMessage({id, type: 'progress', message: 'Warming up the three searches on the same grid…'});
    for (const algorithm of algorithms) runSearch(algorithm, grid, {trace: false});

    const batches = {}, samples = Object.fromEntries(algorithms.map(algorithm => [algorithm, []]));
    for (const algorithm of algorithms) {
      let batchSize = 1;
      while (true) {
        const start = performance.now();
        for (let repeat = 0; repeat < batchSize; repeat++) runSearch(algorithm, grid, {trace: false});
        const elapsed = performance.now() - start;
        if (elapsed >= 8 || batchSize === 50) break;
        batchSize = Math.min(50, batchSize * 2);
      }
      batches[algorithm] = batchSize;
    }

    for (let sample = 0; sample < repeats; sample++) {
      self.postMessage({id, type: 'progress', message: `Measuring sample ${sample + 1} of ${repeats}…`});
      // Rotate order to reduce systematic first/last ordering effects.
      for (let offset = 0; offset < algorithms.length; offset++) {
        const algorithm = algorithms[(sample + offset) % algorithms.length];
        const batchSize = batches[algorithm], start = performance.now();
        for (let repeat = 0; repeat < batchSize; repeat++) runSearch(algorithm, grid, {trace: false});
        samples[algorithm].push((performance.now() - start) / batchSize);
      }
    }

    const results = algorithms.map(algorithm => {
      self.postMessage({id, type: 'progress', message: `Recording ${labels[algorithm]} playback separately from its timing…`});
      return {
        ...runSearch(algorithm, grid, {trace: true}),
        runtimeMs: median(samples[algorithm]), sampleCount: repeats, batchSize: batches[algorithm],
        timingSamplesMs: samples[algorithm]
      };
    });
    self.postMessage({id, type: 'complete', results});
  } catch (error) {
    self.postMessage({id, type: 'error', error: error.message || 'The grid comparison could not finish.'});
  }
};
