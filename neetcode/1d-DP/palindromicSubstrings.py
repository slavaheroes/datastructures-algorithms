class Solution:
    def countSubstrings(self, s: str) -> int:
        # O(1) space
        # O(n^2) time

        res = 0

        for i in range(len(s)):
            l, r = i, i
            
            # odd
            while l>-1 and r<len(s) and s[l]==s[r]:
                res += 1

                l -= 1
                r += 1
            
            # even
            l, r = i, i+1
            while l>-1 and r<len(s) and s[l]==s[r]:
                res += 1
                
                l -= 1
                r += 1

        return res
        