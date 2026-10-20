import {mountGasStation} from '../visualizations/greedy-lessons.mjs';

export default {
  pattern: 'Discard a failed starting segment',
  problem: 'There are gas stations in a circle. At station i, collect gas[i] units, then spend cost[i] to travel to the next station. With an initially empty tank, return a starting station that can complete the circuit, or −1 if none can.',
  example: 'gas = [1,2,3,4,5], cost = [3,4,5,1,2]\nStarting at 3 gives successive tank levels 3,6,4,2,0 around the circle.\nOutput: 3',
  insight: 'If a candidate first runs out of fuel at i, no station inside its failed segment can do better: the original candidate reached that later station with nonnegative fuel, while a fresh start there begins with zero. Reset and look beyond the failure. A global gas-versus-cost check decides whether a complete circuit exists.',
  steps: ['Initialize sumGas = sumCost = tank = 0 and start_pos = −1.', 'Before each station, if tank == 0, set start_pos to its index. This source selects a new start after exact-zero balances as well as after failures.', 'Add gas[i] − cost[i] to tank. If tank is negative, reset it to 0.', 'Accumulate the gas and cost totals on every iteration.', 'Return −1 if sumGas < sumCost. Otherwise return start_pos.'],
  complexity: 'O(n) time and O(1) auxiliary space. The source uses one scan, constant-size counters, and no input mutation.',
  pitfall: 'The source resets the candidate whenever the tank is exactly zero before an iteration; it may select a later valid start when multiple starts work. That is different from updating the start only after a strict deficit, but remains valid under the total feasibility check. The intended inputs are equal-length, nonempty arrays of nonnegative values; an empty input returns −1.'
};

export const mountVisualization = mountGasStation;
