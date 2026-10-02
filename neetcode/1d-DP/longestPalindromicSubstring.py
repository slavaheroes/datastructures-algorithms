class Solution:
    def longestPalindrome(self, s: str) -> str:
        # O(1) space
        # O(n^2) time

        maxLen = 0
        ll = 0

        for i in range(len(s)):
            l, r = i, i
            
            # odd
            while l>-1 and r<len(s) and s[l]==s[r]:
                if r-l+1 > maxLen:
                    maxLen = r-l+1
                    ll = l

                l -= 1
                r += 1
            
            # even
            l, r = i, i+1
            while l>-1 and r<len(s) and s[l]==s[r]:
                if r-l+1 > maxLen:
                    maxLen = r-l+1
                    ll = l

                l -= 1
                r += 1

        return s[ll:ll+maxLen]
