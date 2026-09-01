'''
Write a function that takes in a string of digits and a number of digits, k, and returns the largest number possible by removing k digits from the number.

The function should return the result as a string.

Sample Input
number = "1924"
numDigits = 2

Sample Output
"94"
'''


def bestDigits(number, numDigits):
    # Write your code here.
    # O(n) space time
    stack = []

    for digit in number:
        while numDigits > 0 and len(stack) > 0 and digit > stack[-1]:
            numDigits -= 1
            stack.pop()
        stack.append(digit)

    while numDigits > 0:
        stack.pop()
        numDigits -= 1

    return ''.join(stack)


import unittest


class TestProgram(unittest.TestCase):
    def test_case_1(self):
        self.assertEqual(bestDigits("1924", 2), "94")


if __name__ == '__main__':
    unittest.main()
