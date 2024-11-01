'''
Write a function that takes in a non-empty array of integers and
returns the maximum sum that can be obtained by summing up all the numbers in a non-empty subarray of the input array.
A subarray must only contain adjacent numbers (numbers next to each other in the input array).

Sample input:
array = [3, 5, -9, 1, 3, -2, 3, 4, 7, 2, -9, 6, 3, 1, -5, 4]
Sample output:
19
'''


def kadanesAlgorithm(array):
    # Write your code here.
    # O(n) time | O(1) space
    best_sum = float('-inf')
    curr_sum = 0

    for i in range(len(array)):
        curr_sum = max(curr_sum + array[i], array[i])
        best_sum = max(curr_sum, best_sum)

    return best_sum


import unittest


class TestProgram(unittest.TestCase):
    def test_case_1(self):
        self.assertEqual(kadanesAlgorithm([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]), 55)

    def test_case_2(self):
        self.assertEqual(kadanesAlgorithm([-1, -2, -3, -4, -5, -6, -7, -8, -9, -10]), -1)

    def test_case_3(self):
        self.assertEqual(kadanesAlgorithm([-10, -2, -9, -4, -8, -6, -7, -1, -3, -5]), -1)

    def test_case_4(self):
        self.assertEqual(kadanesAlgorithm([1, 2, 3, 4, 5, 6, -20, 7, 8, 9, 10]), 35)

    def test_case_5(self):
        self.assertEqual(kadanesAlgorithm([1, 2, 3, 4, 5, 6, -22, 7, 8, 9, 10]), 34)

    def test_case_6(self):
        self.assertEqual(kadanesAlgorithm([1, 2, -4, 3, 5, -9, 8, 1, 2]), 11)

    def test_case_7(self):
        self.assertEqual(kadanesAlgorithm([3, 4, -6, 7, 8]), 16)

    def test_case_8(self):
        self.assertEqual(kadanesAlgorithm([3, 5, -9, 1, 3, -2, 3, 4, 7, 2, -9, 6, 3, 1, -5, 4]), 19)

    def test_case_9(self):
        self.assertEqual(kadanesAlgorithm([3, 5, -9, 1, 3, -2, 3, 4, 7, 2, -9, 6, 3, 1, -5, 4]), 19)

    def test_case_10(self):
        self.assertEqual(kadanesAlgorithm([250, 50, -10, 20, 30]), 340)


if __name__ == "__main__":
    unittest.main()
