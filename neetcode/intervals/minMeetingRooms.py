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
        

# Reference solution
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
        mp = defaultdict(int)
        for i in intervals:
            mp[i.start] += 1
            mp[i.end] -= 1
        prev = 0
        res = 0
        for i in sorted(mp.keys()):
            prev += mp[i]
            res = max(res, prev)
        return res