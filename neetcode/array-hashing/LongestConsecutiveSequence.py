# O(n) time and space)

class Solution:
    def longestConsecutive(self, nums: List[int]) -> int:
        table = set(nums)
        maxlen = 0
        for n in table:
            if not n-1 in table:
                curr = 1
                while n + curr in table:
                    curr += 1
                maxlen = max(maxlen, curr)
        return maxlen
                
        