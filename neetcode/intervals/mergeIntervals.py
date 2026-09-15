class Solution:
    def merge(self, intervals: List[List[int]]) -> List[List[int]]:
        # O(nlogn) time, O(n) space
        
        intervals.sort() # nlogn

        res = [intervals[0]]
        i = 1

        # O(n)
        while i < len(intervals):
            prev = res[-1]
            curr = intervals[i]

            # prev = [--------]
            # curr =    [------]

            if curr[0] <= prev[1]:
                res[-1] = [min(prev[0], curr[0]), max(prev[1], curr[1])]
            else:
                res.append(curr)

            i += 1

        return res
        