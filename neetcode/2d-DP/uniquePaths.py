class Solution:
    def uniquePaths(self, m: int, n: int) -> int:
        # O(nm) time, space
        
        dp = [[0]*n for _ in range(m)]

        for i in range(m):
            dp[i][0] = 1
        
        for j in range(n):
            dp[0][j] = 1

        for i in range(1, m):
            for j in range(1, n):
                dp[i][j] = dp[i-1][j] + dp[i][j-1]

        return dp[-1][-1]


from math import comb

class Solution:
    def uniquePaths(self, m: int, n: int) -> int:
        # O(1) space, O(min(m, n)) time
        
        return comb(m + n - 2, m - 1)