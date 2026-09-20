class Solution:
    def pacificAtlantic(self, heights: List[List[int]]) -> List[List[int]]:
        # O(N*M) time and space
        rows, cols = len(heights), len(heights[0])
        pac = set()
        atl = set()


        def dfs(i, j, prevValue, valid):
            if i<0 or j<0 or i==rows or j==cols:
                return
            
            if (i,j) in valid:
                return
            
            if heights[i][j] < prevValue:
                return

            valid.add((i,j))
            for x, y in [(i-1, j), (i+1,j), (i, j+1), (i,j-1)]:
                dfs(x, y, heights[i][j], valid)

        # for pacific
        for j in range(cols):
            dfs(0, j, 0, pac)
        for i in range(rows):
            dfs(i, 0, 0, pac)

        
        # for atlantic
        for j in range(cols):
            dfs(rows-1, j, 0, atl)
        
        for i in range(rows):
            dfs(i, cols-1, 0, atl)
        
        res = []
        for i, j in pac:
            if (i,j) in atl:
                res.append([i,j])
        return res
        
        