def searchInSortedMatrix(matrix, target):
    # Write your code here.
    # O(nlogm), n, m = matrix.shape
    res = [-1, -1]

    for row_idx, row in enumerate(matrix):
        i, j = 0, len(row)-1

        if target < row[i]:
            break
        if target > row[j]:
            continue

        # run binary search in this row
        while i<=j:
            mid = (i+j)//2
            if row[mid]==target:
                return (row_idx, mid)
            elif row[mid]>target:
                j = mid - 1
            else:
                i = mid + 1

        if row[mid] == target:
            return (row_idx, mid)

    return res

    
