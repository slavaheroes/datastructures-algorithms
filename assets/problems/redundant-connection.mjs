import {mountRedundantConnection} from '../visualizations/graph-lessons.mjs';
export const mountVisualization = mountRedundantConnection;
export default {
  pattern: 'Cycle core by leaf trimming, or union-find',
  problem: 'An undirected tree on labels 1 through n has one extra edge. Remove an edge to restore a tree, choosing the last qualifying edge in the input order.',
  example: 'edges = [[1,2],[1,3],[2,3]]\nOutput: [2,3]',
  insight: 'A leaf cannot belong to the unique cycle. Repeatedly removing leaves exposes the cycle; scanning the input backward picks its last edge. Alternatively, when adding edges in order, the edge whose endpoints are already connected is the redundant one.',
  steps: ['Leaf-trimming version: build undirected adjacency sets and enqueue every degree-1 node.', 'Pop a leaf, remove it from its neighbors’ sets, enqueue a neighbor if its degree becomes 1, then delete the leaf’s adjacency entry.', 'After trimming, scan edges in reverse and return the first edge whose two endpoints remain in the graph.', 'Reference version: initialize parent and rank arrays for labels 1 through len(edges). find uses path halving.', 'For each edge, find both roots. Return the edge when they match; otherwise attach the smaller component to the larger one and add its size to the surviving rank.'],
  complexity: 'Leaf trimming: O(V + E) time and O(V + E) auxiliary space. Union-find: O(V + E α(V)) amortized time and O(V) space, where α is the inverse Ackermann function.',
  pitfall: 'The variable rank stores component size, rather than tree height. The source assumes a connected simple graph with one cycle and labels 1 through n, with n = len(edges). Both Solution versions are stored in the file; the final class is the union-find version.'
};
