def insertionSort(array):
    # Write your code here.
    for i in range(1, len(array)):
        
        while array[i-1] > array[i] and i>0:
            array[i], array[i-1] = array[i-1], array[i]
            i -= 1

    return array
