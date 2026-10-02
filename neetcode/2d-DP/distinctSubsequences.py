class Solution:
    def numDistinct(self, s: str, t: str) -> int:
        # O(S*T) time and space

        if len(t) > len(s):
            return 0
        
        ns, nt = len(s), len(t)
        dp = [[0]*(nt+1) for _ in range(ns+1)]

        for i in range(ns+1):
            dp[i][0] = 1

        for i in range(1, ns+1):
            for j in range(1, nt+1):
                if i>=j:
                    
                    ch_s = s[i-1]
                    ch_t = t[j-1]

                    if ch_s==ch_t:
                        dp[i][j] = dp[i-1][j] + dp[i-1][j-1]
                    else:
                        dp[i][j] = dp[i-1][j]
        
        # for r in dp:
        #     print(r)

        return dp[-1][-1]

        