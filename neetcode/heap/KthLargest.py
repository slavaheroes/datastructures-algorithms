# in stream

class KthLargest:
    def __init__(self, k: int, nums: List[int]):
        # Time: O(n) + k*log(n)
        # Space: O( log(n) ) -> O(log(k))
        self.heap = nums
        self.k = k
        heapq.heapify(self.heap) # O(n)

        while len(self.heap) > k:
            heapq.heappop(self.heap) # log(n)


    def add(self, val: int) -> int:
        # Time: O( log(k) )
        heapq.heappush(self.heap, val)
        heapq.heappop(self.heap)
        
        return self.heap[0]
        
