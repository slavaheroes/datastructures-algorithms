class Solution:
    def minDistance(self, word1: str, word2: str) -> int:
        # O(N*M) time space
        
        n = len(word1)
        m = len(word2)

        dp = [[0]*(m+1) for  _ in range(n+1)]
        
        for i in range(1, n+1):
            dp[i][0] = i
        
        for j in range(1, m+1):
            dp[0][j] = j
        
        
        for i in range(1, n+1):
            for j in range(1, m+1):
                ch1 = word1[i-1]
                ch2 = word2[j-1]

                if ch1==ch2:
                    dp[i][j] = dp[i-1][j-1]
                else:
                    dp[i][j] = 1+min(dp[i][j-1], dp[i-1][j], dp[i-1][j-1]) 
        
        # for r in dp:
        #     print(r)

        return dp[-1][-1]
