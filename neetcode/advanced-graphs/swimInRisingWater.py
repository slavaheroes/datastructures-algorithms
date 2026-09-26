class Solution:
    def swimInWater(self, grid: List[List[int]]) -> int:
        # Space: n^2
        # Time: n^2 log n 
        # Dijkstra's algorithm
        
        n = len(grid)
        heap = [(grid[0][0], 0, 0)] # time, i, j
        visited = {(0, 0)}

        while heap:
            time, i, j = heapq.heappop(heap)

            if i==(n-1) and j==(n-1):
                return time
            
            for x, y in [(i+1, j), (i-1, j), (i, j+1), (i, j-1)]:
                if x<0 or y<0 or x==n or y==n:
                    continue
                
                if (x,y) in visited:
                    continue
                
                visited.add((x, y))
                    
                heapq.heappush(heap,
                    ( max(grid[x][y], time) , x, y)
                )

        
        return grid[-1][-1]



        