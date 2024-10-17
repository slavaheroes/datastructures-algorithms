'''
You're given an array of integers where each integer represents a jump of its value in the array.
For instance, the integer 2 represents a jump of 2 indices forward in the array; the integer -3 represents a jump of 3 indices backward in the array.

If a jump spills past the array's bounds, it wraps over to the other side. For instance, a jump of -1 at index 0 brings us to the last index in the array.

Write a function that returns a boolean representing whether the jumps in the array form a single cycle.
A single cycle occurs if, starting at any index in the array and following the jumps,
every element in the array is visited exactly once before landing back on the starting index.

Sample Input:
array = [2, 3, 1, -4, -4, 2]
Sample Output:
True
'''


def hasSingleCycle(array):
    # Write your code here.
    # O(n) time | O(1) space
    idx = 0
    next_idx = (idx + array[idx]) % len(array)
    array[idx] = True
    while next_idx != 0:
        if type(array[next_idx]) == bool:
            break
        v = array[next_idx]
        array[next_idx] = True
        next_idx = (next_idx + v) % len(array)  # (!) work with negative numbers as well: -1 % 6 = 5
    else:
        for v in array:
            if type(v) == int:
                return False

        return True

    return False


import unittest


class TestProgram(unittest.TestCase):
    def test_case_1(self):
        self.assertEqual(hasSingleCycle([2, 3, 1, -4, -4, 2]), True)

    def test_case_2(self):
        self.assertEqual(hasSingleCycle([2, 2, -1]), True)

    def test_case_3(self):
        self.assertEqual(hasSingleCycle([2, 2, 2]), True)

    def test_case_4(self):
        self.assertEqual(hasSingleCycle([1, 1, 1, 1, 2]), False)

    def test_case_5(self):
        self.assertEqual(hasSingleCycle([0, 1, 1, 1, 1]), False)

    def test_case_6(self):
        self.assertEqual(hasSingleCycle([1, 1, 0, 1, 1]), False)

    def test_case_7(self):
        self.assertEqual(hasSingleCycle([1, 1, 1, 1, 0]), False)

    def test_case_8(self):
        self.assertEqual(hasSingleCycle([1, 1, 1, 1, 1]), True)

    def test_case_9(self):
        self.assertEqual(hasSingleCycle([1, 1, 1, 1, -5]), False)

    def test_case_10(self):
        self.assertEqual(hasSingleCycle([-1, 2, 2]), True)

    def test_case_11(self):
        self.assertEqual(hasSingleCycle([3, 1, 2, 2]), True)

    def test_case_12(self):
        self.assertEqual(hasSingleCycle([3, 1, 2, 0]), False)


if __name__ == '__main__':
    unittest.main()
