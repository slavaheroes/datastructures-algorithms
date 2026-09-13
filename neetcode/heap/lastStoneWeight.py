class Solution:
    def lastStoneWeight(self, stones: List[int]) -> int:
        # Time: O(n*log(n))
        # Space: O(1), cause heapify in-place

        heapq.heapify_max(stones) # O(n)

        while len(stones) > 1:
            x = heapq.heappop_max(stones) # O(logn)
            y = heapq.heappop_max(stones)

            if max(x,y) > min(x,y):
                heapq.heappush_max(stones, max(x,y)-min(x,y))
        
        return stones[0] if stones else 0
        