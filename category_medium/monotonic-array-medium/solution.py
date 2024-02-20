def isMonotonic(array):
    # Write your code here.
    # O(n) | O(1)
    if len(array)<3:
        return True
    
    decreasing = 0
    for i in range(0, len(array)-1):
        if decreasing==0:
            if array[i]==array[i+1]:
                continue
            else:
                if array[i] > array[i+1]:
                    decreasing = 1
                else:
                    decreasing = -1
        
        elif decreasing==1:
            if array[i]<array[i+1]:
                return False
        else:
            if array[i+1]<array[i]:
                return False
        
    return True