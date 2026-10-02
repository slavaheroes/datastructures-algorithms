class Solution:
    def longestIncreasingPath(self, matrix: List[List[int]]) -> int:
        # O(N*M) time, space
        n, m = len(matrix), len(matrix[0])
        memo = {}

        def dfs(i, j, prev):
            if i<0 or j<0 or i==n or j==m:
                return 0
            
            if prev >= matrix[i][j]:
                return 0

            if (i,j) in memo:
                return memo[(i,j)]   
            
            memo[(i, j)] = 1 + max(
                dfs(i+1, j, matrix[i][j]),
                dfs(i-1, j, matrix[i][j]),
                dfs(i, j+1, matrix[i][j]),
                dfs(i, j-1, matrix[i][j])
            )

            return memo[(i,j)]
                        


        maxPath = 0
        for i in range(n):
            for j in range(m):
                maxPath = max(maxPath,
                    1+dfs(i+1,j, matrix[i][j]),
                    1+dfs(i-1,j, matrix[i][j]),
                    1+dfs(i,j+1, matrix[i][j]),
                    1+dfs(i,j-1, matrix[i][j])
                )
        
        return maxPath
                


        