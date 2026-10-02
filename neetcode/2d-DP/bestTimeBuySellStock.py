class Solution:
    def maxProfit(self, prices: List[int]) -> int:
        # O(N) time, space
        
        n = len(prices)
        dp = [[0]*(n+2) for _ in range(2)]

        for i in range(n-1, -1, -1):
            
            # buy
            dp[0][i] = max(
                dp[0][i+1], # skip
                dp[1][i+1] - prices[i]  # buy
            ) 
            
            # sell
            dp[1][i] = max(
                dp[1][i+1], # skip
                dp[0][i+2] + prices[i] # sell + cooldown
            )
        
        return dp[0][0]
                

        