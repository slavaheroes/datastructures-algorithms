import {mountMaxPath} from '../visualizations/tree-lessons.mjs';

export const mountVisualization = mountMaxPath;

export default {
  pattern: 'One branch upward, two branches for the answer',
  problem: 'Return the largest sum along a nonempty path in a binary tree. A path follows parent-child edges, visits each node at most once, and may start and end anywhere.',
  example: 'root = [-10,9,20,null,null,15,7]\nOutput: 42\nThe best path is 15 → 20 → 7.',
  insight: 'A parent can extend only one branch through its child. The helper returns max(val, val + left, val + right). Separately, it updates a global answer with the best path centered at the current node, including a possible left + node + right combination.',
  steps: ['Start maxsum at −infinity so negative-only trees still have a nonempty answer.', 'Visit both children first. Missing children return −infinity in this implementation.', 'Compute the best upward branch from val alone, val + left, and val + right.', 'Update maxsum with those choices and val + left + right. Return only the upward branch to the parent.'],
  complexity: 'O(n) time and O(h) recursive stack space. Each node is processed once and the running maximum takes O(1) space.',
  pitfall: 'Passing both child branches upward would create a branching route rather than one path. This source excludes unhelpful branches by comparing against val alone; it does not clamp child returns to zero. The standard problem requires a nonempty tree.'
};
