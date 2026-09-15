"""
Definition of Interval:
class Interval(object):
    def __init__(self, start, end):
        self.start = start
        self.end = end
"""

class Solution:
    def minMeetingRooms(self, intervals: List[Interval]) -> int:
        # O(nlogn) time, O(n) space
        intervals.sort(key=lambda x: x.start)
        heap = []

        for i in intervals:
            if heap and i.start >= heap[0]:
                heapq.heappop(heap)


            heapq.heappush(heap, i.end)


        return len(heap)
        
# Reference Solution

class Solution:
    def eraseOverlapIntervals(self, intervals: List[List[int]]) -> int:
        # O(nlogn) time
        # O(1) space

        intervals.sort()
        res = 0

        print(intervals)
        curr_end = intervals[0][1]
        for i in range(1, len(intervals)):
            # curr_end = ----]
            # new_end  =  [------]
            if curr_end > intervals[i][0]:
                # there is overlap
                res += 1
                curr_end = min(curr_end, intervals[i][1])
            else:
                curr_end = intervals[i][1]
        
        
        return res
        