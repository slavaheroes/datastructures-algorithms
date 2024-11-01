'''
Write a function that takes in a string of words separated by one or more whitespaces and returns a string that has these words in reverse order.
For example, given the string "tim is great", your function should return "great is tim".

Sample Input:
string = "AlgoExpert is the best!"

Sample Output:
"best! the is AlgoExpert"
'''


def reverseWordsInString(string):
    # Write your code here.
    # O(len(string)) time
    # O(len(string)) space
    result = []

    i = len(string) - 1

    while i >= 0:
        if string[i] != ' ':
            j = i
            while string[j] != ' ' and j >= 0:
                j -= 1
            result.append(string[j + 1 : i + 1])
            i = j

        else:
            result.append(string[i])
            i -= 1

    return "".join(result)


import unittest


class TestProgram(unittest.TestCase):
    def test_case_1(self):
        self.assertEqual(reverseWordsInString("AlgoExpert is the best!"), "best! the is AlgoExpert")

    def test_case_2(self):
        self.assertEqual(reverseWordsInString("Tim is great"), "great is Tim")


if __name__ == "__main__":
    unittest.main()
