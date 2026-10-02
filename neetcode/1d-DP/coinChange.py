class Solution:
    def coinChange(self, coins: List[int], amount: int) -> int:
        # O(N*t) time
        # O(t) space
        # t=amount, N=len(coins)

        dp = [0] * (amount+1)

        for i in range(1, len(dp)):
            best = float('inf')

            for c in coins:
                if i-c>=0:
                    best = min(
                        best, 1 + dp[i-c]
                    )
            dp[i] = best
        
        return -1 if dp[-1]==float('inf') else dp[-1]

        