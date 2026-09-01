'''
Write a function that takes in an array of positive integers and returns the maximum sum of non-adjacent elements in the array.
If the input array is empty, the function should return 0.

Sample:
array = [75, 105, 120, 75, 90, 135]
Output: 330 // 75 + 120 + 135
'''

# Solution 1
# O(n) time | O(n) space

# def maxSubsetSumNoAdjacent(array):
#     # Write your code here.
#     if len(array) == 0:
#         return 0

#     memory = [0] * len(array)
#     memory[0] = array[0]

#     for i in range(1, len(array)):
#         memory[i] = max(memory[i - 1], memory[i - 2] + array[i])

#     return memory[-1]


# Solution 2
# O(n) time | O(1) space


def maxSubsetSumNoAdjacent(array):
    # Write your code here.
    if len(array) == 0:
        return 0
    elif len(array) == 1:
        return array[0]

    prevprev = array[0]
    prev = max(array[1], array[0])
    curr = max(prev, prevprev)
    for i in range(2, len(array)):
        curr = max(prevprev + array[i], prev)
        prevprev = prev
        prev = curr

    return curr


print(maxSubsetSumNoAdjacent([75, 105, 120, 75, 90, 135]))
