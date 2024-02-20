def smallestDifference(arrayOne, arrayTwo):
    # Write your code here.
    # O(nlogn + mlonm) | O(1)

    arrayOne.sort()
    arrayTwo.sort()

    min_diff = float('inf')
    i, j = 0, 0
    num1, num2 = None, None

    while i<len(arrayOne) and j<len(arrayTwo):
        if abs(arrayOne[i] - arrayTwo[j])==0:
            return [arrayOne[i], arrayTwo[j]]
            
        if abs(arrayOne[i] - arrayTwo[j]) < min_diff:
            min_diff = abs(arrayOne[i] - arrayTwo[j])
            num1, num2 = arrayOne[i], arrayTwo[j]
            
        if arrayOne[i]>arrayTwo[j]:
            j += 1
        else:
            i += 1
        

    return [num1, num2]
