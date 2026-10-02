class Solution:
    def change(self, amount: int, coins: List[int]) -> int:
        # O(N*A) time, space

        n = len(coins)
        dp = [[0]*(amount+1) for _ in range(n+1)]

        for i in range(n+1):
            dp[i][0] = 1 # amount=0 -> 1 

        for i in range(1, n+1):
            for j in range(1, amount+1):
                if j<coins[i-1]:
                    add = 0
                else:
                    add = dp[i][j-coins[i-1]]

                dp[i][j] = dp[i-1][j] + add
        
        return dp[-1][-1]

        