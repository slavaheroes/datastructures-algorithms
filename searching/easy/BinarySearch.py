def binarySearch(array, target):
    # Write your code here.
    i, j = 0, len(array)-1


    while j>=i:
        mid = (i+j)//2
        if array[mid] == target:
            return mid
        elif array[mid]>target:
            j = mid - 1
        else:
            i = mid + 1
        
    return -1
