import {mountMinimumInterval} from '../visualizations/interval-lessons.mjs';

export default {
  pattern: 'Sweep sorted queries with a heap of candidate lengths',
  problem: 'For each query q, return the size of the smallest closed interval [left,right] containing q, or −1 if none contains it. Its size is right − left + 1. Return answers in the original query order.',
  example: 'intervals = [[1,4],[2,4],[3,6],[4,4]]\nqueries = [2,3,4,5]\nFor q = 4, [4,4] has size 1; for q = 5, [3,6] has size 4.\nOutput: [3,3,1,4]',
  insight: 'Sorted queries move only forward. An interval becomes eligible once its left endpoint is reached and can never become eligible again after its right endpoint expires. Push eligible intervals into a min-heap of (size, right end). Removing expired roots is enough: after that, the smallest remaining root is a covering interval of minimum size, even if expired entries remain deeper in the heap.',
  steps: ['Initialize a result list of −1 values. Sort intervals, then replace each query with (query value, original index) and sort those pairs.', 'For the current q, push every not-yet-added interval with left <= q. Use (right − left + 1, right) as the heap entry.', 'While the heap root ends before q, pop it. Do not remove intervals ending exactly at q because the interval is closed.', 'If the heap is nonempty, write its root size into res at the query’s original index.', 'Advance to the next query. Each interval is inserted at most once and removed at most once; duplicate queries reuse the same candidate state.'],
  complexity: 'For n intervals and m queries, O(n log(n + 1) + m log(m + 1)) time: sort both inputs, insert/pop at most n heap entries, and answer m queries. O(n + m) auxiliary space for the heap, indexed queries, result, and sorting storage.',
  pitfall: 'This source mutates both input lists: intervals is sorted, and queries is replaced with tuples and sorted. The returned result restores the original order, but the original query values list is no longer intact. A stale interval deeper in the heap is harmless until it becomes root. The source uses heapq and List supplied by its execution environment.'
};

export const mountVisualization = mountMinimumInterval;
