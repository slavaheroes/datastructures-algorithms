'''
You're given two positive integers representing the width and height of a grid-shaped, rectangular graph.
Write a function that returns the number of ways to reach the bottom right corner of the graph when starting at the top left corner.
Each move you take must either go down or right. In other words, you can only move to the right or down in the graph.

For example, given the graph illustrated below, with width = 2 and height = 3, there are three ways to reach the bottom right corner when starting at the top left corner:
 _ _
|_|_|
|_|_|
|_|_|

1. Down, Down, Right
2. Right, Down, Down
3. Down, Right, Down

Sample Input:
width = 4
height = 3
Sample Output:
10
'''

from math import factorial


def numberOfWaysToTraverseGraph(width, height):
    # Write your code here.
    # O(w+h) time | O(1) space
    right_moves = width - 1
    down_moves = height - 1
    total = right_moves + down_moves
    return factorial(total) / (factorial(right_moves) * factorial(down_moves))


def numberOfWaysToTraverseGraph(width, height):
    # Dynamic Programming
    # Write your code here.
    # O(w*h) time and space
    grid = [[1] * width] * height

    for i in range(1, height):
        for j in range(1, width):
            grid[i][j] = grid[i - 1][j] + grid[i][j - 1]

    return grid[-1][-1]


import unittest


class TestProgram(unittest.TestCase):
    def test_case_1(self):
        self.assertEqual(numberOfWaysToTraverseGraph(4, 3), 10)

    def test_case_2(self):
        self.assertEqual(numberOfWaysToTraverseGraph(2, 3), 3)


if __name__ == "__main__":
    unittest.main()
