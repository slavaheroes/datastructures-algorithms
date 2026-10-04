import {mountHeightPlayback} from '../visualizations/height-playback.mjs';

export default {
  pattern: 'Boundary maxima',
  problem: 'Given nonnegative heights of width-1 bars, return the total rainwater trapped between them. Water above each bar is limited by the highest boundary on either side.',
  example: 'height = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]\nOutput: 6\nWater per index: [0, 0, 1, 0, 1, 2, 1, 0, 0, 1, 0, 0]',
  insight: 'The first solution precomputes the maximum strictly to the left and right of every bar, then adds max(0, min(leftMax, rightMax) - height[i]). The reference solution keeps two pointers and two running maxima. Process the side with the smaller maximum: a boundary at least that high already exists on the opposite side, so that bar’s water can be finalized.',
  steps: [
    'Prefix/suffix version: start both maximum arrays at zero. Walk forward to compute prefix[i] from prefix[i - 1] and height[i - 1], then backward to compute suffix[i] from suffix[i + 1] and height[i + 1].',
    'At index 5 in the example, the highest left boundary is 2 and the highest right boundary is 3. The bar height is 0, so it traps min(2, 3) - 0 = 2 units.',
    'Reference version: initialize L = 0, R = 11, leftMax = 0, and rightMax = 1. Since leftMax < rightMax, move L first, update leftMax, and add leftMax - height[L].',
    'On each iteration move the side with the smaller running maximum, update that maximum, and add the water at the newly reached bar. When maxima are equal the source moves R. Both versions return 6.'
  ],
  complexity: 'Both versions take O(n) time. The prefix/suffix version uses O(n) auxiliary space for two arrays. The reference two-pointer version uses O(1) auxiliary space.',
  pitfall: 'Do not confuse a container’s capacity with water above terrain: subtract each bar’s height here. The first version’s maxima exclude the current bar and its contribution is clamped to zero. The reference maxima include the newly visited bar, making its contribution nonnegative. Neither version modifies the input; empty input returns 0.'
};

function pointerSteps(heights) {
  if (!heights.length) return [{message: 'Empty input: the reference solution returns 0 immediately.', water: [], stats: [['Total water', 0]]}];
  const frames = [], water = heights.map(() => null);
  let left = 0, right = heights.length - 1, leftMax = heights[left], rightMax = heights[right], total = 0;
  water[left] = water[right] = 0;
  const save = (message, current = null) => frames.push({
    left, right, current, message, water: [...water],
    stats: [['Left index', left], ['Right index', right], ['Left maximum', leftMax], ['Right maximum', rightMax], ['Water added', current === null ? '—' : water[current]], ['Total water', total]]
  });
  save('Initialize pointers at both ends and set each running maximum to its endpoint height. The outermost bars trap no water.');
  while (left < right) {
    if (leftMax < rightMax) {
      const previousMax = leftMax;
      left++;
      leftMax = Math.max(leftMax, heights[left]);
      water[left] = leftMax - heights[left];
      total += water[left];
      save(`Left maximum ${previousMax} is smaller than right maximum ${rightMax}, so move L to ${left}. Update leftMax to ${leftMax}; add ${leftMax} - ${heights[left]} = ${water[left]} water units.`, left);
    } else {
      const previousMax = rightMax;
      right--;
      rightMax = Math.max(rightMax, heights[right]);
      water[right] = rightMax - heights[right];
      total += water[right];
      save(`Right maximum ${previousMax} is no greater than left maximum ${leftMax}, so move R to ${right}. Update rightMax to ${rightMax}; add ${rightMax} - ${heights[right]} = ${water[right]} water units.`, right);
    }
  }
  save(`The pointers meet. All water contributions have been finalized: total = ${total}.`);
  return frames;
}

function prefixSteps(heights) {
  const n = heights.length, frames = [];
  const prefix = Array(n).fill(0), suffix = Array(n).fill(0), water = Array(n).fill(null);
  if (n) water[0] = water[n - 1] = 0;
  let total = 0;
  const save = (message, current = null, added = null) => frames.push({
    message, current, prefix: [...prefix], suffix: [...suffix], water: [...water],
    stats: [['Pass', current === null ? 'Overview' : added === null ? 'Boundary maxima' : 'Water accumulation'], ['Current index', current ?? '—'], ['Water added', added ?? '—'], ['Total water', total]]
  });
  save('Initialize prefix and suffix arrays with zeros. First compute the maximum strictly to the left of each bar.');
  for (let i = 1; i < n; i++) {
    prefix[i] = Math.max(prefix[i - 1], heights[i - 1]);
    save(`Left pass, index ${i}: prefix[${i}] = max(${prefix[i - 1]}, ${heights[i - 1]}) = ${prefix[i]}. The current bar is excluded.`, i);
  }
  for (let i = n - 2; i >= 0; i--) {
    suffix[i] = Math.max(suffix[i + 1], heights[i + 1]);
    save(`Right pass, index ${i}: suffix[${i}] = max(${suffix[i + 1]}, ${heights[i + 1]}) = ${suffix[i]}. The current bar is excluded.`, i);
  }
  for (let i = 1; i < n - 1; i++) {
    water[i] = Math.max(0, Math.min(prefix[i], suffix[i]) - heights[i]);
    total += water[i];
    save(`Index ${i}: max(0, min(${prefix[i]}, ${suffix[i]}) - ${heights[i]}) = ${water[i]} water units. Add this contribution to the total.`, i, water[i]);
  }
  save(`Finished. Summing the water above each interior bar gives ${total}.`);
  return frames;
}

function waterTable(frame, heights) {
  if (!heights.length) return '';
  const prefixMode = Boolean(frame.prefix);
  return `<table><caption>${prefixMode ? 'Boundary arrays and water per bar (arrays start at zero)' : 'Finalized water per bar; — means not processed yet'}</caption><thead><tr><th scope="col">Index</th><th scope="col">Height</th>${prefixMode ? '<th scope="col">Left max</th><th scope="col">Right max</th>' : ''}<th scope="col">Water</th></tr></thead><tbody>${heights.map((height, i) => `<tr ${i === frame.current ? 'class="current-row"' : ''}><th scope="row">${i}</th><td>${height}</td>${prefixMode ? `<td>${frame.prefix[i]}</td><td>${frame.suffix[i]}</td>` : ''}<td>${frame.water[i] ?? '—'}</td></tr>`).join('')}</tbody></table>`;
}

export function mountVisualization(root) {
  return mountHeightPlayback(root, {
    id: 'rain-water', kind: 'terrain', initial: [0,1,0,2,1,0,1,3,2,1,2,1],
    description: 'Blue water appears only when a bar’s contribution has been calculated. Choose the reference two-pointer solution or the original prefix/suffix solution to follow the corresponding Python code.',
    legend: 'Green bars = terrain. Blue = finalized trapped water. Orange = bar being processed. L/R mark the two pointers; i marks the current index in the array passes. Labels above bars show terrain heights.',
    modes: [{id: 'two-pointers', label: 'Two pointers (reference solution)', steps: pointerSteps}, {id: 'prefix-suffix', label: 'Prefix/suffix arrays (first solution)', steps: prefixSteps}],
    table: waterTable
  });
}
