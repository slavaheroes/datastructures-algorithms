class Solution:
    def partitionLabels(self, s: str) -> List[int]:
        # O(n) time, O(m) space. m is number of unique chars
        # n = len(s)
        
        letters = {}

        for i in range(len(s)):
            if s[i] in letters:
                prev, prev_max = letters[s[i]]
                letters[s[i]] = [ min(i, prev), max(i, prev_max) ]
            else:
                letters[s[i]] = [i, i]
        
        res = []
        
        i = 0
        while i<len(s):
            ch = s[i]
            start, end = letters[ch]
            j = start

            while j<=end:
                end = max(end, letters[s[j]][1])
                j += 1                
            
            res.append(end-start+1)
            i = end+1


        return res
            
# Reference solution
class Solution:
    def partitionLabels(self, s: str) -> List[int]:
        # O(n) time, O(m) space. m is number of unique chars
        # n = len(s)
        
        letters = {}

        for i in range(len(s)):
            letters[s[i]] = i
        
        res = []
        end = 0
        size = 0
        for i in range(len(s)):
            end = max(end, letters[s[i]])
            size += 1
            if end==i:
                res.append(size)
                size = 0
            
        return res
    