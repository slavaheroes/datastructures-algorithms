def bubbleSort(array):
    # Write your code here.

    while True:
        num_swaps = 0
        for j in range(len(array)-1):
            if array[j] > array[j+1]:
                array[j], array[j+1] = array[j+1], array[j]
                num_swaps += 1

        if num_swaps==0:
            break
        
    return array
