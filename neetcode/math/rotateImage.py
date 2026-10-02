class Solution:
    def rotate(self, matrix: List[List[int]]) -> None:
        # O(N^2) time, O(1) space
        rows = len(matrix)
        
        for i in range(rows//2):
            matrix[i], matrix[rows-i-1] = matrix[rows-i-1], matrix[i]
        
        # Transpose
        for i in range(rows):
            for j in range(i+1):
                matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]
        