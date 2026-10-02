class Solution:
    def isInterleave(self, s1: str, s2: str, s3: str) -> bool:
        if len(s1) + len(s2) != len(s3): return False

        def foo(i, j, k):

            if k==len(s3):
                return True
            
            ans = False
            if i<len(s1) and s3[k] == s1[i]:
                ans = foo(i+1, j, k+1)
            
            if j<len(s2) and s3[k] == s2[j]:
                ans = ans or foo(i, j+1, k+1)
            
            return ans
        
        return foo(0, 0, 0)

# Effiecient solution 

class Solution:
    def isInterleave(self, s1: str, s2: str, s3: str) -> bool:
        # O(N1*N2) time, space
        if len(s1) + len(s2) != len(s3): return False

        n1 = len(s1)
        n2 = len(s2)

        dp = [[False]*(n2+1) for _ in range(n1+1)]
        dp[0][0] = True
        
        for i in range(1, n1+1):
            dp[i][0] = dp[i-1][0] and s1[i-1]==s3[i-1]
            if not dp[i][0]:
                break
        
        for j in range(1, n2+1):
            dp[0][j] = dp[0][j-1] and s2[j-1]==s3[j-1]
            if not dp[0][j]:
                break
        
        for i in range(1, n1+1):
            for j in range(1, n2+1):
                k = i+j-1

                if s1[i-1]==s3[k]: 
                    dp[i][j] = dp[i][j] or dp[i-1][j]
                
                if s2[j-1]==s3[k]:
                    dp[i][j] = dp[i][j] or dp[i][j-1]
                
        return dp[-1][-1]

