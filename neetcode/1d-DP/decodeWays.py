class Solution:
    def numDecodings(self, s: str) -> int:
        # O(N) time and space
        
        n = len(s)
        dp = [0] * (n+1)
        dp[n] = 1
        
        for i in range(n-1, -1, -1):
            if s[i] !='0':
                dp[i] = dp[i+1]

                if int(s[i:min(len(s), i+2)]) <= 26 and len(s[i:min(len(s), i+2)])==2:
                    # valid 2-digits
                    dp[i] = dp[i+1] + dp[i+2]

                     
            else:
                dp[i] = 0
        

        return dp[0]

        
        