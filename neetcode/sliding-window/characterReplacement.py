class Solution:
    def characterReplacement(self, s: str, k: int) -> int:
        # O(n) time | O(1) space
        freq = {}
        
        i, j = 0, 0
        maxLen = 0
        maxFreq = 0

        while i<len(s):
            freq[s[i]] = freq.get(s[i], 0) + 1

            if freq[s[i]] > maxFreq:
                maxFreq = freq[s[i]]
            
            if  k < i-j+1 - maxFreq:
                freq[s[j]] -= 1
                j += 1
            
            maxLen = max(maxLen, i-j+1)
            i += 1
            
        return maxLen    