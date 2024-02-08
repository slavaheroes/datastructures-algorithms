def selectionSort(array):
    # Write your code here.
    for i in range(len(array)):

        min_idx, min_num = i, array[i]
        for j in range(i, len(array)):

            if array[j]<min_num:
                min_num = array[j]
                min_idx = j

        array[i], array[min_idx] = array[min_idx], array[i]


    return array
