class Solution:
    def numIslands(self, grid: List[List[str]]) -> int:
        # Time: O(n*m)
        # Space O(n*m)
        
        res = 0

        def dfs(i, j):
            if i<0 or j<0 or i>=len(grid) or j>=len(grid[0]):
                return
            
            if grid[i][j] == "0" or grid[i][j]=="#":
                return
            
            grid[i][j] = "#"

            for x, y in [(i+1, j), (i-1, j), (i, j+1), (i, j-1)]:
                dfs(x, y)
        
        for i in range(len(grid)):
            for j in range(len(grid[0])):
                if grid[i][j]=="1":
                    res += 1
                    dfs(i, j)
        
        return res

        