'''
You're given two positive integers representing the height of a staircase and the maximum number of steps that you can advance up the staircase at a time.
Write a function that returns the number of ways in which you can climb the staircase.

Sample Input:
height = 4
maxSteps = 2

Sample Output:
5 // 1+1+1+1, 1+1+2, 1+2+1, 2+1+1, 2+2
'''


def staircaseTraversal(height, maxSteps, curr_step=0):
    # Write your code here.
    # Recursive: Time: O(k^n) where k is the maxSteps and n is the height
    # Space: O(n) where n is the height
    if curr_step == height:
        return 1
    elif curr_step > height:
        return 0

    num_of_ways = 0
    for i in range(1, maxSteps + 1):
        num_of_ways += staircaseTraversal(height, maxSteps, curr_step + i)

    return num_of_ways


def staircaseTraversal(height, maxSteps):
    # Write your code here.
    # Iterative: Time: O(n) | Space: O(n)
    array = [0] * (height + 1)
    array[0] = 1
    curr_sum = 1
    for step in range(1, maxSteps):
        array[step] = curr_sum
        curr_sum += array[step]

    i = 0
    j = maxSteps

    while j < height + 1:
        array[j] = curr_sum
        curr_sum += array[j] - array[i]
        j += 1
        i += 1

    return array[-1]


import unittest


class TestStaircaseTraversal(unittest.TestCase):
    def test_sample_input(self):
        self.assertEqual(staircaseTraversal(4, 2), 5)

    def test_single_step(self):
        self.assertEqual(staircaseTraversal(4, 1), 1)

    def test_large_height(self):
        self.assertEqual(staircaseTraversal(10, 2), 89)

    def test_large_height_max_steps(self):
        self.assertEqual(staircaseTraversal(10, 5), 464)


if __name__ == '__main__':
    unittest.main()
