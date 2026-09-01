# O(n) time and space 
# Heap implementation

class Solution:
    def topKFrequent(self, nums: List[int], k: int) -> List[int]:
        counts = []
        heapq.heapify(counts)
        table = {}
        for n in nums:
            table[n] = table.get(n, 0) + 1
        
        for key, value in table.items():
            heapq.heappush(counts, (value, key))
            if len(counts) > k:
                heapq.heappop(counts)
        
        return [key for val, key in counts]

# Bucket Sort implementation

class Solution:
    def topKFrequent(self, nums: List[int], k: int) -> List[int]:
        count = {}
        freq = [[] for i in range(len(nums) + 1)]

        for num in nums:
            count[num] = 1 + count.get(num, 0)
        for num, cnt in count.items():
            freq[cnt].append(num)

        res = []
        for i in range(len(freq) - 1, 0, -1):
            for num in freq[i]:
                res.append(num)
                if len(res) == k:
                    return res        