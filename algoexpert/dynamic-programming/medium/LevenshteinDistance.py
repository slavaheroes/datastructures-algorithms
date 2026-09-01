'''
Write a function that takes in two strings and returns the minimum number of edit operations that need to be performed on the first string to obtain the second string.

There are three edit operations: insertion of a character, deletion of a character, and substitution of a character for another.

Sample Input:
str1 = "abc"
str2 = "yabd"

Sample Output:
2
'''


def levenshteinDistance(str1, str2):
    # Write your code here.
    # O(n*m) time | O(min(n, m)) space

    if len(str2) > len(str1):
        str2, str1 = str1, str2

    prev_row = [i for i in range(len(str1) + 1)]
    curr_row = [0 for _ in range(len(str1) + 1)]
    curr_row[0] = 1

    for j in range(1, len(str2) + 1):
        curr_row[0] = j
        for i in range(1, len(str1) + 1):
            if str1[i - 1] == str2[j - 1]:
                curr_row[i] = prev_row[i - 1]
            else:
                curr_row[i] = 1 + min(curr_row[i - 1], prev_row[i], prev_row[i - 1])

        prev_row = curr_row
        curr_row = [0 for _ in range(len(str1) + 1)]

    return prev_row[-1]


# def levenshteinDistance(str1, str2):
#     # Write your code here.
#     # O(n*m) time
#     # O(n*m) space
#     table = [[0] * (len(str1) + 1) for _ in range((len(str2) + 1))]
#     table[0] = [i for i in range(len(str1) + 1)]

#     for j in range(len(str2)+1):
#         table[j][0] = j

#     for i in range(1, len(str1)+1):
#         for j in range(1, len(str2) + 1):
#             if str1[i-1]==str2[j-1]:
#                 table[j][i] = table[j-1][i-1]
#             else:
#                 table[j][i] = 1 + min(
#                     table[j-1][i],
#                     table[j-1][i-1],
#                     table[j][i-1]
#                 )

#     return table[-1][-1]

import unittest


class TestProgram(unittest.TestCase):
    def test_case_1(self):
        self.assertEqual(levenshteinDistance("abc", "yabd"), 2)

    def test_case_2(self):
        self.assertEqual(levenshteinDistance("table", "tbres"), 3)

    def test_case_3(self):
        self.assertEqual(levenshteinDistance("table", "table"), 0)


if __name__ == "__main__":
    unittest.main()
