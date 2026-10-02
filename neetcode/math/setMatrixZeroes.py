class Solution:
    def setZeroes(self, matrix: List[List[int]]) -> None:
        # O(1) space
        # O(N*M) time
        
        n, m = len(matrix), len(matrix[0])
        rowOneZero, colOneZero = False, False

        for i in range(n):
            if matrix[i][0]==0:
                colOneZero = True
        
        for j in range(m):
            if matrix[0][j]==0:
                rowOneZero = True
        
        for i in range(1, n):
            for j in range(1, m):
                if matrix[i][j]==0:
                    matrix[i][0] = 0
                    matrix[0][j] = 0
        
        for i in range(1, n):
            for j in range(1, m):
                if matrix[0][j]==0 or matrix[i][0]==0:
                    matrix[i][j] = 0
        
        if rowOneZero:
            for j in range(m):
                matrix[0][j] = 0
        
        if colOneZero:
            for i in range(n):
                matrix[i][0] = 0
            


        
        