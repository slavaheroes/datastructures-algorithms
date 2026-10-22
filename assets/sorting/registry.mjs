import bubble from './algorithms/bubble.mjs';
import merge from './algorithms/merge.mjs';
import quick from './algorithms/quick.mjs';

// Retain the full trace registry for existing consumers and CI checks.
export const sortingAlgorithms = [bubble, merge, quick];
export const availableSortingAlgorithms = [merge, quick];
