class Solution:
    def maxAreaOfIsland(self, grid: List[List[int]]) -> int:
        # Time: O(n*m)
        # Space O(n*m)
        
        res = 0

        def dfs(i, j):
            if i<0 or j<0 or i>=len(grid) or j>=len(grid[0]):
                return 0
            
            if grid[i][j] == 0 or grid[i][j]==2:
                return 0
            
            grid[i][j] = 2
            area = 1
            for x, y in [(i+1, j), (i-1, j), (i, j+1), (i, j-1)]:
                area += dfs(x, y)
            return area
        
        for i in range(len(grid)):
            for j in range(len(grid[0])):
                if grid[i][j]==1:
                    res = max(res, dfs(i, j))
        
        return res
        