'''
Given an array of buildings and a direction that all of the buildings face, return an array of the indices of the buildings that can see the sunset.
A building can see the sunset if it's strictly taller than all of the buildings that come after it in the direction that it faces.

Sample Input:
buildings = [3, 5, 4, 4, 3, 1, 3, 2]
direction = "EAST"
Sample Output:
[1, 3, 6, 7]
'''


def sunsetViews(buildings, direction):
    # Write your code here.
    # O(n) time | O(n) space
    if len(buildings) == 0:
        return []

    if direction == "WEST":
        curr_max = buildings[0]
        ids = [0]
        for i in range(1, len(buildings)):
            if buildings[i] > curr_max:
                ids.append(i)
                curr_max = buildings[i]
    else:
        curr_max = buildings[-1]
        ids = [len(buildings) - 1]

        for i in range(len(buildings) - 2, -1, -1):
            if buildings[i] > curr_max:
                ids.insert(0, i)
                curr_max = buildings[i]
    return ids


import unittest


class TestProgram(unittest.TestCase):
    def test_case_1(self):
        self.assertEqual(sunsetViews([3, 5, 4, 4, 3, 1, 3, 2], "EAST"), [1, 3, 6, 7])

    def test_case_2(self):
        self.assertEqual(sunsetViews([3, 5, 4, 4, 3, 1, 3, 2], "WEST"), [0, 1])


if __name__ == '__main__':
    unittest.main()
