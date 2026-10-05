import {mountWindow} from '../visualizations/sliding-window.mjs';
export default {
  pattern: 'Cheapest earlier buy day',
  problem: 'Given daily stock prices, return the largest profit from buying once and selling on a later day. Return 0 if no profitable trade exists.',
  example: 'prices = [7,1,5,3,6,4]\nOutput: 5\nBuy at price 1 on day 1; sell at price 6 on day 4 (zero-based days).',
  insight: 'Keep i at a cheapest price seen so far and j at the candidate sell day. If prices[j] is greater, evaluate the profit. Otherwise replace the buy candidate with j: a cheaper or equal price cannot hurt any future sale.',
  steps: ['Initialize i = 0, j = 1, and maxPrice = 0. Despite its name, maxPrice stores profit.', 'When prices[j] > prices[i], update maxPrice with prices[j] − prices[i].', 'Otherwise set i = j. The source replaces the buy candidate even when prices are equal.', 'Advance j each iteration and return maxPrice after the last day.'],
  complexity: 'O(n) time and O(1) auxiliary space.',
  pitfall: 'The sale must follow the purchase. The minimum and maximum of the whole array may occur in the wrong order. Falling prices give 0 because making no trade is allowed.'
};
export const mountVisualization = root => mountWindow(root, 'stock');
