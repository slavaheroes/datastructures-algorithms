'''
You're given two strings of potentially unequal length. Write a function that returns a boolean representing whether the strings are one edit away from each other.
There are three types of edits that can be performed on strings: insert a character, remove a character, or replace a character.

Sample Input
stringOne = "abc"
stringTwo = "ab"

Sample Output
True
'''


def oneEdit(stringOne, stringTwo):
    # Write your code here.
    # O(n) time | O(1) space
    if abs(len(stringOne) - len(stringTwo)) > 1:
        return False

    if len(stringOne) > len(stringTwo):
        stringOne, stringTwo = stringTwo, stringOne

    i, j = 0, 0

    skipped = False

    while i < len(stringOne) and j < len(stringTwo):
        if stringOne[i] == stringTwo[j]:
            i += 1
            j += 1
        else:
            if skipped:
                return False
            skipped = True
            if len(stringOne) == len(stringTwo):
                i += 1
                j += 1
            else:
                j += 1

    return True


import unittest


class TestProgram(unittest.TestCase):
    def test_case_1(self):
        self.assertEqual(oneEdit("abc", "ab"), True)

    def test_case_2(self):
        self.assertEqual(oneEdit("abc", "abc"), True)

    def test_case_3(self):
        self.assertEqual(oneEdit("abc", "abcd"), True)

    def test_case_4(self):
        self.assertEqual(oneEdit("abc", "abdc"), True)

    def test_case_5(self):
        self.assertEqual(oneEdit("abc", "abcc"), True)

    def test_case_6(self):
        self.assertEqual(oneEdit("abc", "abdd"), False)

    def test_case_7(self):
        self.assertEqual(oneEdit("abc", "abcdd"), False)

    def test_case_8(self):
        self.assertEqual(oneEdit("abc", "ab"), True)

    def test_case_9(self):
        self.assertEqual(oneEdit("abc", "a"), False)

    def test_case_10(self):
        self.assertEqual(oneEdit("abc", "bc"), True)

    def test_case_11(self):
        self.assertEqual(oneEdit("abc", "ac"), True)

    def test_case_12(self):
        self.assertEqual(oneEdit("abc", "abdd"), False)

    def test_case_13(self):
        self.assertEqual(oneEdit("abc", "abcdd"), False)

    def test_case_14(self):
        self.assertEqual(oneEdit("abc", "abdddd"), False)

    def test_case_15(self):
        self.assertEqual(oneEdit("abc", "abcddd"), False)

    def test_case_16(self):
        self.assertEqual(oneEdit("abc", "ab"), True)

    def test_case_17(self):
        self.assertEqual(oneEdit("abc", "ac"), True)

    def test_case_18(self):
        self.assertEqual(oneEdit("abc", "bc"), True)

    def test_case_19(self):
        self.assertEqual(oneEdit("abc", "ac"), True)

    def test_case_20(self):
        self.assertEqual(oneEdit("abc", "abdd"), False)

    def test_case_21(self):
        self.assertEqual(oneEdit("abc", "abcdd"), False)

    def test_case_22(self):
        self.assertEqual(oneEdit("abc", "abdddd"), False)

    def test_case_23(self):
        self.assertEqual(oneEdit("abc", "abcddd"), False)


if __name__ == '__main__':
    unittest.main()
