def moveElementToEnd(array, toMove):
    # Write your code here.
    # O(n) | O(1)
    i, j = 0, len(array)-1

    while j>i:
        if array[i]==toMove and array[j]!=toMove:
            array[i], array[j] = array[j], array[i]
            i += 1
            j -= 1
        elif array[i]==toMove and array[j]==toMove:
            j-= 1
        else:
            i += 1

    return array
