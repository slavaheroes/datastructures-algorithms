'''
You're given a two-dimensional array (a matrix) of potentially unequal height and width containing only 0s and 1s.
Each 0 represents land, and each 1 represents part of a river.
A river consists of any number of 1s that are either horizontally or vertically adjacent (but not diagonally adjacent).

Write a function that returns an array of the sizes of all rivers represented in the input matrix.
Note that these sizes do not need to be in any particular order.

Sample Input:
matrix = [
    [1, 0, 0, 1, 0],
    [1, 0, 1, 0, 0],
    [0, 0, 1, 0, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 1, 1, 0]
]
Sample Output:
[1, 2, 2, 2, 5]

'''


def getRiverSize(matrix, i, j):
    size = 0

    visited = [(i, j)]

    while len(visited) > 0:
        x, y = visited.pop(0)
        if matrix[x][y] == -1:
            continue
        matrix[x][y] = -1
        size += 1

        for dx, dy in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
            if (x + dx) < 0 or (y + dy) < 0 or (x + dx) == len(matrix) or (y + dy) == len(matrix[0]):
                continue

            if matrix[x + dx][y + dy] == 1:
                visited.append((x + dx, y + dy))

    return size


def riverSizes(matrix):
    # Write your code here.
    # O(n*m) time | O(n*m) space
    ans = []

    for i in range(len(matrix)):
        for j in range(len(matrix[0])):
            if matrix[i][j] == 1:
                a = getRiverSize(matrix, i, j)
                ans.append(a)

    return ans


import unittest


class TestProgram(unittest.TestCase):
    def test_case_1(self):
        matrix = [[1, 0, 0, 1, 0], [1, 0, 1, 0, 0], [0, 0, 1, 0, 1], [1, 0, 1, 0, 1], [1, 0, 1, 1, 0]]
        self.assertEqual(sorted(riverSizes(matrix)), [1, 2, 2, 2, 5])


if __name__ == '__main__':
    unittest.main()
