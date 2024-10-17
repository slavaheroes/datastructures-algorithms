'''
Write a function that, given a string, returns its longest palindromic substring.
A palindrome is defined as a string that's written the same forward and backward. Note that single-character strings are palindromes.

Sample Input:
string = "abaxyzzyxf"
Sample Output:
"xyzzyx"
'''


def longestPalindromicSubstring(string):
    # Write your code here.
    # O(n^2) time | O(n) space
    maxInd = [0, 1]

    for i in range(1, len(string)):
        start_idx = i - 1
        end_idx = i + 1

        # odd
        while start_idx >= 0 and end_idx < len(string):
            if string[start_idx] != string[end_idx]:
                break
            start_idx -= 1
            end_idx += 1

        odd = [start_idx + 1, end_idx]

        # even
        start_idx = i - 1
        end_idx = i
        while start_idx >= 0 and end_idx < len(string):
            if string[start_idx] != string[end_idx]:
                break
            start_idx -= 1
            end_idx += 1
        even = [start_idx + 1, end_idx]

        longest = max(odd, even, key=lambda x: x[1] - x[0])
        maxInd = max(longest, maxInd, key=lambda x: x[1] - x[0])

    return string[maxInd[0] : maxInd[1]]


import unittest


class TestProgram(unittest.TestCase):
    def test_case_1(self):
        self.assertEqual(longestPalindromicSubstring("abaxyzzyxf"), "xyzzyx")

    def test_case_2(self):
        self.assertEqual(longestPalindromicSubstring("a"), "a")


if __name__ == '__main__':
    unittest.main()
