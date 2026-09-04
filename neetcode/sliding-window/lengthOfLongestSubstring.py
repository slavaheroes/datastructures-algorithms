class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        # O(n) time | O(1) space
        
        freqs = [0 for _ in range(128)]
        maxLen = 0

        i = 0
        j = 0
        while i<len(s):
            ch = s[i]
            idx = ord(ch)

            while freqs[idx] > 0:
                freqs[ ord(s[j]) ] -= 1
                j += 1
            
            maxLen = max(maxLen, i-j+1)

            freqs[idx] += 1
            i += 1
        
        return maxLen
        

# Optimal solution:
class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        mp = {}
        l = 0
        res = 0

        for r in range(len(s)):
            if s[r] in mp:
                l = max(mp[s[r]] + 1, l)
            mp[s[r]] = r
            res = max(res, r - l + 1)
        return res