def firstDuplicateValue(array):
    # Write your code here.
    # O(n) | O(1)
    for i in range(len(array)):
        
        if array[i]<0:
            j = abs(array[i]) - 1
        else:
            j = array[i] - 1
            
        if array[j] < 0:
            # we met duplicate
            return j+1
        else:
            array[j] = -1*array[j]
                     
    return -1
