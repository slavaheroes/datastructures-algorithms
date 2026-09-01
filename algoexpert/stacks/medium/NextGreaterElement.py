'''
Write a function that takes in an array of integers and returns a new array containing, at each index,
the next element in the input array that's greater than the element at that index in the input array.

In other words, your function should return a new array where outputArray[i] is the next element in the input array that's greater than inputArray[i].

If there's no such next greater element for a particular index, the value at that index in the output array should be -1.

Sample Input:
    array = [2, 5, -3, -4, 6, 7, 2]
Sample Output:
    [5, 6, 6, 6, 7, -1, 5]
'''


def nextGreaterElement(array):
    # Write your code here.
    # O(n) time | O(n) space
    stack = [0]
    outputArray = [-1 for _ in range(len(array))]

    for i in range(1, len(array) * 2):
        idx = i % len(array)

        while len(stack) > 0 and array[idx] > array[stack[-1]]:
            outputArray[stack.pop()] = array[idx]

        stack.append(idx)

    return outputArray


import unittest


class TestProgram(unittest.TestCase):
    def test_case_1(self):
        self.assertEqual(nextGreaterElement([2, 5, -3, -4, 6, 7, 2]), [5, 6, 6, 6, 7, -1, 5])


if __name__ == "__main__":
    unittest.main()
