'''
Write a function that takes in an integer matrix of potentially unequal height and width and
returns the minimum number of passes required to convert all negative integers in the matrix to positive integers.

A negative integer in the matrix can only be converted to a positive integer if one or more of its adjacent elements is positive.
An adjacent element is an element that is to the left, to the right, above, or below the current element in the matrix.
Converting a negative to a positive simply involves multiplying it by -1

Note that the 0 value is neither positive nor negative, meaning that a negative integer cannot be converted to 0.

Sample input:
[
  [0, -1, -3, 2, 0],
  [1, -2, -5, -1, -3],
  [3, 0, 0, -4, -1]
]

Sample output:
3
'''


def minimumPassesOfMatrix(matrix):
    # Write your code here.
    # O(nm) time space
    queue = []

    for i in range(len(matrix)):
        for j in range(len(matrix[0])):
            if matrix[i][j] > 0:
                queue.append((i, j, 0))

    while len(queue) > 0:
        x, y, d = queue.pop(0)
        for dx, dy in [(1, 0), (-1, 0), (0, 1), (0, -1)]:
            xx, yy = x + dx, y + dy

            if xx < 0 or yy < 0 or xx >= len(matrix) or yy >= len(matrix[0]):
                continue

            if matrix[xx][yy] < 0:
                matrix[xx][yy] *= -1
                queue.append((xx, yy, d + 1))

    # final check is all positive
    for i in range(len(matrix)):
        for j in range(len(matrix[0])):
            if matrix[i][j] < 0:
                return -1
    return d


import unittest


class TestProgram(unittest.TestCase):
    def test_case_1(self):
        test = [[1, 0, 0, -2, -3], [-4, -5, -6, -2, -1], [0, 0, 0, 0, -1], [-1, 0, 3, 0, 3]]
        self.assertEqual(minimumPassesOfMatrix(test), -1)

    def test_case_2(self):
        test = [[0, -1, -3, 2, 0], [1, -2, -5, -1, -3], [3, 0, 0, -4, -1]]
        self.assertEqual(minimumPassesOfMatrix(test), 3)


if __name__ == "__main__":
    unittest.main()
