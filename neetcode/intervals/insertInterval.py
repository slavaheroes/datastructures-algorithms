class Solution:
    def insert(self, intervals: List[List[int]], newInterval: List[int]) -> List[List[int]]:
        # O(n) space, time
        # O(1) extra space
        
        # insert newInterval first
        inserted = False
        for i in range(len(intervals)):
            if newInterval[0] < intervals[i][0]:
                intervals.insert(i, newInterval)
                inserted = True
                break
        
        if not inserted:
            intervals.append(newInterval)

        res = [intervals[0]]
        i = 1

        while i < len(intervals):
            prev = res[-1]
            curr = intervals[i]

            # prev = [----]
            # curr =    [---------]

            if prev[1] >= curr[0]:
                res[-1][1] = max(curr[1], prev[1])
            else:
                res.append(curr)

            i += 1

        return res

# Reference Solution
class Solution:
    def insert(self, intervals: List[List[int]], newInterval: List[int]) -> List[List[int]]:
        # O(n) time, space
        # O(1) extra space
        res = []

        for i in range(len(intervals)):
            if newInterval[1] < intervals[i][0]:
                res.append(newInterval)
                return res + intervals[i:]
            elif newInterval[0] > intervals[i][1]:
                res.append(intervals[i])
            else:
                newInterval = [
                    min(newInterval[0], intervals[i][0]),
                    max(newInterval[1], intervals[i][1]),
                ]
        res.append(newInterval)
        return res