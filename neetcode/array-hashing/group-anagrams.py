from collections import defaultdict

class Solution:
    def groupAnagrams(self, strs: List[str]) -> List[List[str]]:
        # Space: O(n) - n = len(strs)
        # Time: O(n * m) m is len of longest string 

        hash_table = {}

        for string in strs:

            key = [0 for _ in range(26)]

            for ch in string:
                i = ord(ch) - ord('a')
                key[i] += 1
            
            key = tuple(key)

            if key in hash_table:
                hash_table[key].append(string)
            else:
                hash_table[key] = [string]
                
        return [v for _, v in hash_table.items()]

# Reference solution
class Solution:
    def groupAnagrams(self, strs: List[str]) -> List[List[str]]:
        res = defaultdict(list)
        for s in strs:
            count = [0] * 26
            for c in s:
                count[ord(c) - ord('a')] += 1
            res[tuple(count)].append(s)
        return list(res.values())