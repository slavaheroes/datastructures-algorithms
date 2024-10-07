'''
Write a function that takes in an array of positive integers and returns the maximum sum of non-adjacent elements in the array.
If the input array is empty, the function should return 0.

Sample:
array = [75, 105, 120, 75, 90, 135]
Output: 330 // 75 + 120 + 135
'''


def maxSubsetSumNoAdjacent(array):
    # Write your code here.
    if len(array) == 0:
        return 0

    memory = [0] * len(array)
    memory[0] = array[0]

    for i in range(1, len(array)):
        memory[i] = max(memory[i - 1], memory[i - 2] + array[i])

    return memory[-1]


print(maxSubsetSumNoAdjacent([75, 105, 120, 75, 90, 135]))
