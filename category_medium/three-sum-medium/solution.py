def threeNumberSum(array, targetSum):
    # Write your code here.
    # O(n^2) time | O(n) space
    array.sort()
    output = []
    for i in range(len(array)-2):
        left = i+1
        right = len(array)-1

        while right>left:
            currentSum = array[i] + array[left] + array[right]
            if currentSum==targetSum:
                output.append([array[i], array[left], array[right]])
                left += 1
                right -= 1
            elif currentSum<targetSum:
                left += 1
            else:
                right -= 1
    
    return output


assert threeNumberSum([12, 3, 1, 2, -6, 5, -8, 6], 0) == [[-8, 2, 6], [-8, 3, 5], [-6, 1, 5]]