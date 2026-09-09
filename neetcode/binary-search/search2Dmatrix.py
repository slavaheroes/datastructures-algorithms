class Solution:
    def searchMatrix(self, matrix: List[List[int]], target: int) -> bool:
        # O(log m + log n) time | O(1) space
        row_t, row_b = 0, len(matrix)-1

        while row_t <= row_b:
            mid = (row_t + row_b) // 2

            if target < matrix[mid][0]:
                row_b = mid - 1
            elif target > matrix[mid][-1]:
                row_t = mid + 1
            else:
                # print(mid)
                break
        
        l, r = 0, len(matrix[0]) - 1

        while l<=r:
            mid_c = (l+r)//2

            if matrix[mid][mid_c] == target:
                return True
            elif matrix[mid][mid_c] > target:
                r = mid_c - 1
            else:
                l = mid_c + 1

        return False