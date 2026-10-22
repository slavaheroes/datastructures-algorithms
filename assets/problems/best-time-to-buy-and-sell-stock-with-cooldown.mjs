import {mountStockCooldown} from '../visualizations/dp-foundations.mjs';

export default {
  pattern: 'Track ownership and jump past the cooldown',
  problem: 'Given daily stock prices, maximize profit with any number of transactions. Hold at most one share at a time. After selling, wait one day before buying again.',
  example: 'prices = [1,2,3,0,2]\nBuy day 0 at 1; sell day 1 at 2; cooldown day 2.\nBuy day 3 at 0; sell day 4 at 2.\nOutput: 3',
  insight: 'Each day has two states: allowed to buy with no share (row 0), or holding a share (row 1). Skipping advances one day in the same state. Buying pays today’s price and enters tomorrow’s holding state. Selling receives today’s price and enters the can-buy state two days later, encoding the mandatory cooldown directly in the dependency.',
  steps: ['Allocate a two-row table with n+2 columns initialized to 0. The two extra days let every transition stay in bounds.', 'Process days i from n−1 down to 0.', 'Set dp[0][i] = max(dp[0][i+1], dp[1][i+1] − prices[i]): skip or buy.', 'Set dp[1][i] = max(dp[1][i+1], dp[0][i+2] + prices[i]): hold or sell and skip the cooldown day.', 'Return dp[0][0], beginning on day 0 with no share.'],
  complexity: 'O(n) time and O(n) auxiliary space. Each day fills two constant-work states, and the saved implementation retains the full table.',
  pitfall: 'The row named “holding” stores future cash flow after the share has already been bought; its purchase cost belongs to the earlier buy transition. A sell must read can-buy at i+2, not i+1. Equal alternatives may represent different optimal transaction schedules. Prices are nonnegative, and doing nothing yields profit 0.'
};

export const mountVisualization = mountStockCooldown;
