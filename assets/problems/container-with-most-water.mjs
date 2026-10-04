import {mountHeightPlayback} from '../visualizations/height-playback.mjs';

export default {
  pattern: 'Move the shorter boundary',
  problem: 'Choose two vertical lines that hold the most water. The container width is the distance between their indices; its height is the shorter line. Lines between the chosen boundaries do not reduce its capacity.',
  example: 'heights = [1, 8, 6, 2, 5, 4, 8, 3, 7]\nOutput: 49\nIndices 1 and 8 give min(8, 7) * (8 - 1) = 49.',
  insight: 'Begin with the widest possible container. Its shorter wall limits the water level. Keeping that wall and moving the taller wall inward cannot improve the area: width shrinks and height cannot increase. Discard the shorter wall and try again.',
  steps: [
    'Start with left = 0 and right = 8. Height = min(1, 7) = 1; width = 8; area = 8.',
    'The left wall is shorter, so move left to index 1. Height = min(8, 7) = 7; width = 7; area = 49.',
    'Now the right wall is shorter, so move right inward. Evaluate each new pair and keep the maximum.',
    'The source moves left only when heights[right] > heights[left]; on equal heights it moves right. Stop when the pointers meet.'
  ],
  complexity: 'O(n) time and O(1) auxiliary space. Every iteration discards one endpoint, so there are at most n - 1 evaluations.',
  pitfall: 'Width is right - left, not the number of included array entries. Use the smaller endpoint height, not the taller one. This is a container between two lines; it does not calculate rainwater trapped above individual bars. Empty and single-element inputs return 0.'
};

function containerSteps(heights) {
  const frames = [];
  let left = 0, right = heights.length - 1, bestArea = 0, bestPair = null;
  const save = (message, container = null) => frames.push({
    left, right, container, message,
    stats: [['Left index', left], ['Right index', right], ['Candidate height', container?.height ?? '—'], ['Candidate width', container ? container.right - container.left : '—'], ['Candidate area', container ? container.height * (container.right - container.left) : '—'], ['Best area', bestArea]]
  });
  if (heights.length < 2) {
    save('Fewer than two lines: no container can be formed. Return 0.');
    return frames;
  }
  save('Start at the first and last lines. This is the widest possible pair.');
  while (left < right) {
    const height = Math.min(heights[left], heights[right]), area = height * (right - left);
    const container = {left, right, height};
    if (bestPair === null || area > bestArea) { bestArea = area; bestPair = container; }
    save(`Evaluate indices ${left} and ${right}: min(${heights[left]}, ${heights[right]}) × (${right} - ${left}) = ${area}. Best area = ${bestArea}.`, container);
    if (heights[right] > heights[left]) {
      const previous = left++;
      save(`Move L from ${previous} to ${left}: its shorter height limited the previous container. Moving R while keeping that shorter wall could not improve the area.`);
    } else {
      const previous = right--;
      save(`Move R from ${previous} to ${right}: ${heights[previous] === heights[left] ? 'both walls were equal, so the source chooses R.' : 'the right wall was shorter and limited the previous container.'}`);
    }
  }
  left = bestPair.left; right = bestPair.right;
  save(`Finished. The best pair is highlighted at indices ${left} and ${right}, with capacity ${bestArea}. Interior lines do not block the water in this problem.`, bestPair);
  return frames;
}

export function mountVisualization(root) {
  return mountHeightPlayback(root, {
    id: 'container', kind: 'container', initial: [1,8,6,2,5,4,8,3,7],
    description: 'Watch each candidate container and the decision to move its shorter boundary. The blue rectangle shows capacity between two vertical lines.',
    legend: 'L = left pointer (green outline). R = right pointer (orange outline). Blue = candidate capacity. Labels above the lines are their heights.',
    modes: [{id: 'two-pointers', label: 'Two pointers', steps: containerSteps}]
  });
}
