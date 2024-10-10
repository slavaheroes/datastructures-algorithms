'''
Given an array of positive integers representing coin denominations and
a single non-negative integer n representing a target amount of money,
write a function that returns the number of ways to make change for that target amount using the given coin denominations.
Note that an unlimited amount of coins is at your disposal.

Sample Input:
n = 6
denoms = [1, 5]

Sample Output:
2 // 1x1 + 1x5 and 6x1
'''


def numberOfWaysToMakeChange(n, denoms):
    # Write your code here.
    # Time: O(n*len(denoms))
    # Space: O(n)
    array = [0] * (n + 1)
    array[0] = 1

    for den in denoms:
        for curr in range(1, n + 1):
            if den <= curr:
                array[curr] += array[curr - den]

    return array[-1]


import unittest


class TestNumberOfWaysToMakeChange(unittest.TestCase):
    def test_sample_input(self):
        self.assertEqual(numberOfWaysToMakeChange(6, [1, 5]), 2)

    def test_no_ways(self):
        self.assertEqual(numberOfWaysToMakeChange(3, [2, 4]), 0)

    def test_single_denom(self):
        self.assertEqual(numberOfWaysToMakeChange(10, [1]), 1)

    def test_multiple_denoms(self):
        self.assertEqual(numberOfWaysToMakeChange(10, [1, 5, 10]), 4)

    def test_large_n(self):
        self.assertEqual(numberOfWaysToMakeChange(100, [1, 5, 10, 25]), 242)

    def test_zero_n(self):
        self.assertEqual(numberOfWaysToMakeChange(0, [1, 2, 3]), 1)

    def test_empty_denoms(self):
        self.assertEqual(numberOfWaysToMakeChange(10, []), 0)


if __name__ == '__main__':
    unittest.main()
