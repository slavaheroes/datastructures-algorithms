class Solution:
    def spiralOrder(self, matrix: List[List[int]]) -> List[int]:
        # O(N*M) time
        # O(1) extra space
        
        rows, cols = len(matrix), len(matrix[0])
        res = []

        i, j = 0, 0

        direction = 'R'
        row_up, row_bottom = 0, rows-1
        col_left, col_right = 0, cols-1

        while len(res) != (rows*cols):
            
            res.append(matrix[i][j])

            if direction=='R':
                j += 1
                if j>col_right:
                    direction = 'D'
                    row_up += 1
                    j = col_right
                    i += 1

            elif direction=='D':
                i += 1
                if i>row_bottom:
                    direction='L'
                    col_right -= 1
                    i = row_bottom 
                    j -= 1
            elif direction=='L':
                j -= 1
                if j<col_left:
                    j = col_left
                    direction='U'
                    row_bottom -= 1
                    i -= 1
            else:
                i -= 1
                if i<row_up:
                    i = row_up
                    direction = 'R'
                    col_left += 1
                    j += 1
        
        return res


        
        