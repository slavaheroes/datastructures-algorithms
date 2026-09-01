'''
You're given a two-dimensional array (a matrix) of potentially unequal height and width containing only 0s and 1s. +
The matrix represents a two-toned image, where each 1 represents black and each 0 represents white.
An island is defined as any number of 1s that are horizontally or vertically adjacent (but not diagonally adjacent) and
that don't touch the border of the image.

In other words, a group of horizontally or vertically adjacent 1s isn't an island
if any of those 1s are in the first row, last row, first column, or last column of the input matrix.

Note that an island can twist. In other words, it doesn't have to be a straight vertical line or a straight horizontal line;
it can be L-shaped, for example.

You can think of islands as patches of black that don't touch the border of the two-toned image.

Write a function that returns a new matrix that represents the input matrix where all of its islands are removed.

Sample Input:
[
  [1, 0, 0, 0, 0, 0],
  [0, 1, 0, 1, 1, 1],
  [0, 0, 1, 0, 1, 0],
  [1, 1, 0, 0, 1, 0],
  [1, 0, 1, 1, 0, 0],
  [1, 0, 0, 0, 0, 1]
]

Sample output:
[
  [1, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 1, 1],
  [0, 0, 0, 0, 1, 0],
  [1, 1, 0, 0, 1, 0],
  [1, 0, 0, 0, 0, 0],
  [1, 0, 0, 0, 0, 1]
]
'''


def label_non_island(matrix, visited, x, y):
    if x < 0 or y < 0 or x >= len(matrix) or y >= len(matrix[0]) or matrix[x][y] == 0:
        return
    elif visited[x][y] == 1:
        return

    visited[x][y] = 1
    for dx, dy in [(1, 0), (0, 1), (-1, 0), (0, -1)]:
        label_non_island(matrix, visited, x + dx, y + dy)


def removeIslands(matrix):
    # Write your code here.
    # O(nm) space time
    visited = [[0 for _ in range(len(matrix[0]))] for _ in range(len(matrix))]

    # find non_islands
    for i in [0, len(matrix) - 1]:
        for j in range(len(matrix[0])):
            if matrix[i][j] == 1:
                label_non_island(matrix, visited, i, j)

    for i in range(len(matrix)):
        for j in [0, len(matrix[0]) - 1]:
            if matrix[i][j] == 1:
                label_non_island(matrix, visited, i, j)

    return visited


import unittest


class TestProgram(unittest.TestCase):
    def test_case_1(self):
        matrix = [
            [1, 0, 0, 0, 0, 0],
            [0, 1, 0, 1, 1, 1],
            [0, 0, 1, 0, 1, 0],
            [1, 1, 0, 0, 1, 0],
            [1, 0, 1, 1, 0, 0],
            [1, 0, 0, 0, 0, 1],
        ]
        expected = [
            [1, 0, 0, 0, 0, 0],
            [0, 0, 0, 1, 1, 1],
            [0, 0, 0, 0, 1, 0],
            [1, 1, 0, 0, 1, 0],
            [1, 0, 0, 0, 0, 0],
            [1, 0, 0, 0, 0, 1],
        ]
        self.assertEqual(removeIslands(matrix), expected)


if __name__ == '__main__':
    unittest.main()
