import heapq
from typing import List


class Solution:
    def findKthLargest(self, nums: List[int], k: int) -> int:
        # Keep the k largest values; the minimum is the kth largest.
        # Time: O(n log(k + 1)). Auxiliary space: O(k).
        heap = nums[:k]
        heapq.heapify(heap)

        for index in range(k, len(nums)):
            if nums[index] > heap[0]:
                heapq.heapreplace(heap, nums[index])

        return heap[0]
