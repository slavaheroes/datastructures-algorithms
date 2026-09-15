class Solution:
    def minInterval(self, intervals: List[List[int]], queries: List[int]) -> List[int]:
        # n = len(intervals), m = len(queries)
        # Space: O(n+m)
        # Time: O(nlogn + mlogm)
        res = [-1 for _ in range(len(queries))]
        intervals.sort()
        for i in range(len(queries)):
            queries[i] = (queries[i], i)
        queries.sort()

        heap = []
        i = 0
        for q, idx in queries:

            while i<len(intervals) and intervals[i][0] <= q:
                l, r = intervals[i]
                heapq.heappush(heap, (r-l+1, r))
                i += 1
            
            while heap and q > heap[0][1]:
                heapq.heappop(heap)

            if heap:
                res[idx] = heap[0][0]

        return res
