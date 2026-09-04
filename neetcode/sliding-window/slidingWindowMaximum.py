class Solution:
    def maxSlidingWindow(self, nums: List[int], k: int) -> List[int]:
        # O(n log n) time | O(n) space
        
        heap = []
        heapq.heapify_max(heap)

        for i in range(k):
            heapq.heappush_max(heap, (nums[i], i))
        
        result = []

        j = 0
        for i in range(k, len(nums)):

            result.append(
                heap[0][0] # max elem
            )
            
            heapq.heappush_max(heap, (nums[i], i))

            j += 1

            while heap and j > heap[0][1]:
                heapq.heappop_max(heap)

            
        
        result.append(heap[0][0])
        
        return result

# Efficient solution using deque
class Solution:
    def maxSlidingWindow(self, nums: List[int], k: int) -> List[int]:
        output = []
        q = deque()  # index
        l = r = 0

        while r < len(nums):
            while q and nums[q[-1]] < nums[r]:
                q.pop()
            q.append(r)

            if l > q[0]:
                q.popleft()

            if (r + 1) >= k:
                output.append(nums[q[0]])
                l += 1
            r += 1

        return output