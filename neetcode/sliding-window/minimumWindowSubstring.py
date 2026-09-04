class Solution:
    def minWindow(self, s: str, t: str) -> str:
        # O(n+m) time | O(n+m) space
        
        if len(t) > len(s) or len(t)==0:
            return ""
        
        t_freq = {}

        for i in range(len(t)):
            t_freq[t[i]] = t_freq.get(t[i], 0) + 1
            
        matches = 0
        j = 0
        minLen = [float('inf'), -1, -1]
        s_freq = {}

        for i in range(len(s)):

            if s[i] in t_freq:
                s_freq[s[i]] = s_freq.get(s[i], 0) + 1
                if s_freq[s[i]] == t_freq[s[i]]:
                    matches += 1

            while matches == len(t_freq):
                if minLen[0] > (i-j+1):
                    minLen = [i-j+1, j, i]
                    
                if s[j] in t_freq:
                    s_freq[s[j]] -= 1
                    if s_freq[s[j]] < t_freq[s[j]]:
                        matches -= 1
                j += 1
                
        return s[minLen[1]:minLen[2]+1] if minLen[0] != float('inf') else ""
            