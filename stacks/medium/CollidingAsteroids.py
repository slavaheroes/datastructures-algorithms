'''
You're given an array of integers asteroids, where asteroids[i] represents the size of the ith asteroid.
Some asteroids are destroyed by colliding with each other.
When two asteroids collide, the smaller asteroid will explode.
If two asteroids are the same size, they both explode. Two asteroids moving in the same direction will never meet.

Return an array of the remaining asteroids after all collisions.

Sample Input:
asteroids = [5, 10, -5]
Sample Output:
[5, 10]
'''


def collidingAsteroids(asteroids):
    # Write your code here.
    # O(n) time space
    stack = []

    for ast in asteroids:

        while len(stack) > 0 and stack[-1] > 0:
            if ast > 0:
                stack.append(ast)
                break
            elif ast < 0 and abs(ast) < stack[-1]:
                break
            elif abs(ast) == stack[-1]:
                stack.pop(-1)
                break
            elif abs(ast) > stack[-1]:
                stack.pop()
        else:
            stack.append(ast)

    return stack


import unittest


class TestCollidingAsteroids(unittest.TestCase):
    def test_case1(self):
        self.assertEqual(collidingAsteroids([5, 10, -5]), [5, 10])

    def test_case2(self):
        self.assertEqual(collidingAsteroids([8, -8]), [])

    def test_case3(self):
        self.assertEqual(collidingAsteroids([10, 2, -5]), [10])


if __name__ == '__main__':
    unittest.main()
