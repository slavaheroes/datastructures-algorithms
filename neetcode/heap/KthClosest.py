class Solution:
    def kClosest(self, points: List[List[int]], k: int) -> List[List[int]]:
        # Time: O(k * logN + N)
        # Space: O(N)
        distances = []

        for i, (x, y) in enumerate(points):
            distances.append(
                (x**2 + y**2, i)
            )
        
        heapq.heapify(distances) # O(n)
        return [points[heapq.heappop(distances)[1]] for i in range(k)]