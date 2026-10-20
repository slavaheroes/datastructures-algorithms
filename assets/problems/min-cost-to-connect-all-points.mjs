import {mountMinCostPoints} from '../visualizations/advanced-graph-lessons.mjs';

export const mountVisualization = mountMinCostPoints;

export default {
  pattern: 'Prim minimum spanning tree with Manhattan edge costs',
  problem: 'Connect all points so every pair is joined through some path, minimizing the sum of chosen edge costs. Connecting [x1,y1] and [x2,y2] costs |x1 − x2| + |y1 − y2|.',
  example: 'points = [[0,0],[2,2],[3,10],[5,2],[7,0]]\nOutput: 20\nOne minimum tree uses edges of costs 4, 3, 4, and 9.',
  insight: 'Treat every pair of points as an edge. Prim grows a connected set by repeatedly taking the cheapest edge from that set to an unvisited point. The first implementation stores the entire complete graph and uses a heap. The reference avoids building edges: dist[i] remembers the cheapest connection from the current tree to point i, and a linear scan chooses the next point.',
  steps: ['Heap version: compute every pair’s Manhattan distance and add it in both directions. Begin with (0, 0), an empty visited set, and total cost zero.', 'Pop (edgeCost, point). Ignore the entry if that point is already visited; otherwise add edgeCost to the total and mark the point visited.', 'Push outgoing edges leading to unvisited points. Stop when every point has joined the tree. The artificial first entry adds point 0 for free.', 'Optimized reference: start at point 0, initialize dist to a large sentinel, and mark the current point visited.', 'For each unvisited point, lower dist using its Manhattan distance to the current point. Choose the unvisited point with minimum dist, add that value to the result, and make that point current.', 'Repeat for n − 1 chosen edges. The final chosen point need not be marked visited because the loop finishes immediately afterward.'],
  complexity: 'For n points, the heap version builds O(n²) edges, takes O(n² log(n + 1)) time, and uses O(n²) auxiliary space. The optimized reference takes O(n²) time and O(n) auxiliary space by computing distances on demand. A single point needs no edges and returns zero in both versions.',
  pitfall: 'Prim chooses the cheapest connection to the whole existing tree; it does not always connect to the last point visited. Manhattan distance is not Euclidean distance. Equal-weight minimum spanning trees may use different edges but have the same optimal total. The reference uses 100000000 as its initial distance sentinel, which exceeds the original problem’s distance range; the interactive coordinates stay within that range.'
};
