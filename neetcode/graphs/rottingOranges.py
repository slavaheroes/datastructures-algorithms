class Solution:
    def orangesRotting(self, grid: List[List[int]]) -> int:
        # O(N*M) time, space
        
        rows, cols = len(grid), len(grid[0])
        q = deque()
        visited = set()

        for i in range(rows):
            for j in range(cols):
                if grid[i][j]==2:
                    q.append((i, j, 0))
        
        maxTime = 0

        while q:
            i, j, minutes = q.popleft()
            if i<0 or j<0 or i==rows or j==cols:
                continue
            
            if grid[i][j] <= 0:
                continue

            maxTime = max(maxTime, minutes)
            grid[i][j] = -1
            for x, y in [(i+1, j), (i-1, j), (i, j+1), (i, j-1)]:
                q.append((x, y, minutes+1))
        
        for i in range(rows):
            for j in range(cols):
                if grid[i][j]==1:
                    return -1

        return maxTime
