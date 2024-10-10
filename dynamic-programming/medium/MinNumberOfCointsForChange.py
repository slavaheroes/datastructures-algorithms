'''
Given an array of positive integers representing coin denominations and a single non-negative integer n representing a target amount of money,
implement a function that returns the smallest number of coins needed to make change for (to sum up to) that target amount using the given coin denominations.
Note that you have access to an unlimited amount of coins of each denomination.

Sample input:
n = 7
denoms = [1, 5, 10]

Sample output:
3 // 2x1 + 1x5
'''


def minNumberOfCoinsForChange(n, denoms):
    # Write your code here.
    # Time: O(n*len(denoms)) | Space O(n)
    array = [0] + [float('inf')] * n

    for den in denoms:
        for curr in range(1, n + 1):
            if curr >= den:
                array[curr] = min(array[curr], 1 + array[curr - den])

    if array[-1] == float('inf'):
        return -1

    return array[-1]


import unittest


class TestMinNumberOfCoinsForChange(unittest.TestCase):
    def test_sample_input(self):
        self.assertEqual(minNumberOfCoinsForChange(7, [1, 5, 10]), 3)

    def test_no_coins(self):
        self.assertEqual(minNumberOfCoinsForChange(7, [2, 4]), -1)

    def test_single_denom(self):
        self.assertEqual(minNumberOfCoinsForChange(10, [1]), 10)

    def test_multiple_denoms(self):
        self.assertEqual(minNumberOfCoinsForChange(10, [1, 5, 10]), 1)

    def test_large_n(self):
        self.assertEqual(minNumberOfCoinsForChange(100, [1, 5, 10, 25]), 4)

    def test_zero_n(self):
        self.assertEqual(minNumberOfCoinsForChange(0, [1, 2, 3]), 0)

    def test_empty_denoms(self):
        self.assertEqual(minNumberOfCoinsForChange(10, []), -1)


if __name__ == '__main__':
    unittest.main()
