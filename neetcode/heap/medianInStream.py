class MedianFinder:

    def __init__(self):
        # Space: O(n)
        self.minHeap = []
        self.maxHeap = []

        self.median = None

        heapq.heapify(self.minHeap)
        heapq.heapify_max(self.maxHeap)

        

    def addNum(self, num: int) -> None:
        # Time O(logn)

        if self.median is None:
            # first elem
            self.median = num
            heapq.heappush(self.minHeap, num)
            return 

        if num > self.median:
            if len(self.minHeap) > len(self.maxHeap):
                n = heapq.heappop(self.minHeap)
                heapq.heappush_max(self.maxHeap, n)

            heapq.heappush(self.minHeap, num)

        else:
            if len(self.maxHeap) > len(self.minHeap):
                n = heapq.heappop_max(self.maxHeap)
                heapq.heappush(self.minHeap, n)
            heapq.heappush_max(self.maxHeap, num)


        if len(self.minHeap)==len(self.maxHeap):
            self.median = (self.minHeap[0] + self.maxHeap[0]) / 2
        else:
            if len(self.minHeap) > len(self.maxHeap):
                self.median = self.minHeap[0]
            else:
                self.median = self.maxHeap[0]  

    def findMedian(self) -> float:
        # time: O(1)
        return self.median
        