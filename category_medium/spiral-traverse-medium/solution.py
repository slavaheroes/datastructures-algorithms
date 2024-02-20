def spiralTraverse(array):
    # Write your code here.
    # O(nm) | O(nm)
    output = []
    i, j = 0, 0
    end_i, end_j = len(array)-1, len(array[0])-1

    while i<=end_i and j<=end_j:
        if i==end_i and j==end_j:
            if array[i][j]!=None:
                output.append(array[i][j])
            break

        k_j = j
        while k_j < end_j:
            if array[i][k_j]!=None:
                output.append(array[i][k_j])
                array[i][k_j] = None
            k_j += 1

        k_i = i
        while k_i < end_i:
            if array[k_i][end_j]!=None:
                output.append(array[k_i][end_j])
                array[k_i][end_j] = None
            k_i += 1

        k_j = end_j
        while k_j > j:
            if array[end_i][k_j]!=None:
                output.append(array[end_i][k_j])
                array[end_i][k_j] = None
            k_j -= 1

        k_i = end_i
        while k_i > i:
            if array[k_i][j]!=None:
                output.append(array[k_i][j])
                array[k_i][j] = None
            k_i -= 1

        i += 1
        j += 1
        end_i -= 1
        end_j -= 1
        
    return output