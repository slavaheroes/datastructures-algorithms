class Solution:
    def islandsAndTreasure(self, grid: List[List[int]]) -> None:
        # O(N*M) time | O(N*M) space
        rows, cols = len(grid), len(grid[0])
        visited = set()
        q = deque()

        for i in range(rows):
            for j in range(cols):
                if grid[i][j]==0:
                    visited.add((i, j))
                    q.append((i, j, 0))
        
        while q:
            i, j, dist = q.popleft()

            if i<0 or j<0 or i==rows or j==cols or grid[i][j]==-1:
                continue
            
            grid[i][j] = dist

            for x, y in [(i+1, j), (i-1, j), (i, j+1), (i, j-1)]:
                if not (x,y) in visited:
                    q.append((x, y, dist+1))
                    visited.add((x, y))
                    
            

        