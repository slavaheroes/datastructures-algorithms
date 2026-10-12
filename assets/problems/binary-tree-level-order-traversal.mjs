import {mountLevelOrder} from '../visualizations/tree-lessons.mjs';

export const mountVisualization = mountLevelOrder;

export default {
  pattern: 'Breadth-first search with level numbers',
  problem: 'Return node values grouped by tree depth, visiting each level from left to right.',
  example: 'root = [3,9,20,null,null,15,7]\nOutput: [[3],[9,20],[15,7]]',
  insight: 'Store (node, level) pairs in a deque. All nodes from one level are consecutive in the queue. Pop pairs while their level equals curr_level, append children with level + 1, then save the completed group.',
  steps: ['For a nonempty tree, start with (root, 0); an empty tree returns [].', 'Take all queue entries whose stored level equals curr_level.', 'Append each value to curr_level_values and enqueue its left child before its right child.', 'Append the completed level to answer, increment curr_level, and repeat until the queue is empty.'],
  complexity: 'O(n) time. O(w) auxiliary queue space, where w is the maximum width, plus O(n) output space; O(n) total space.',
  pitfall: 'Read the stored level at the front of the queue before popping. Children added during a level belong to the next group. The source uses deque supplied by the problem environment.'
};
