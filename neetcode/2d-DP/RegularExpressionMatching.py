class Solution:
    def isMatch(self, s: str, p: str) -> bool:
        # O(SP) time, space

        ns = len(s)
        np = len(p)

        dp = [[False]*(np+1) for _ in range(ns+1)]

        dp[0][0] = True
        for j in range(1, np+1):
            if p[j-1]=="*":
                dp[0][j] = dp[0][j-2]
            
            

        for i in range(1, ns+1):
            for j in range(1, np+1):
                ch_s = s[i-1]
                ch_p = p[j-1]

                if ch_s==ch_p or ch_p==".":
                    dp[i][j] = dp[i-1][j-1]
                elif ch_p=="*":
                    ch_p_prev = p[j-2]
                    matchprev = False
                    if ch_p_prev==ch_s or ch_p_prev==".":
                        matchprev = dp[i-1][j]

                    dp[i][j] = dp[i][j-2] or matchprev

        
        # for r in dp:
        #     print(r)

        return dp[-1][-1]


        