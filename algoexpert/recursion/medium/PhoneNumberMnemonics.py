'''
You're given a phone number as a string number. Write a function that returns all the possible mnemonics for this phone number.
The mnemonics should be returned as a list of strings in any order.
A mnemonics is a way of representing a phone number by mapping each digit to a sequence of letters in the alphabet.

Sample Input:
phoneNumber = "1905"
Sample Output:

["1w0j", "1w0k", "1w0l", "1x0j", "1x0k", "1x0l", "1y0j", "1y0k", "1y0l", "1z0j", "1z0k", "1z0l"]


'''

import copy


def phoneNumberMnemonics(phoneNumber):
    # Write your code here.
    # Time O(4^n * n) | Space O(4^n * n)
    # Because we have 4 possible characters for each digit in the phone number and we have n digits in the phone number
    # We have 4^n possible mnemonics
    # Each mnemonic has n characters
    global mobilePhone
    mobilePhone = {
        '0': '0',
        '1': '1',
        '2': 'abc',
        '3': 'def',
        '4': 'ghi',
        '5': 'jkl',
        '6': 'mno',
        '7': 'pqrs',
        '8': 'tuv',
        '9': 'wxyz',
    }

    global ans
    ans = []

    def backtrack(phoneNumber, curr):
        global ans, mobilePhone

        if len(curr) == len(phoneNumber):
            ans.append(''.join(curr))
            return

        i = len(curr)
        for ch in mobilePhone[phoneNumber[i]]:
            curr.append(ch)
            new_curr = copy.deepcopy(curr)

            backtrack(phoneNumber, new_curr)

            curr.pop(-1)

    backtrack(phoneNumber, [])

    return ans


import unittest


class TestProgram(unittest.TestCase):
    def test_program_1(self):
        self.assertEqual(
            phoneNumberMnemonics("1905"),
            ["1w0j", "1w0k", "1w0l", "1x0j", "1x0k", "1x0l", "1y0j", "1y0k", "1y0l", "1z0j", "1z0k", "1z0l"],
        )


if __name__ == "__main__":
    unittest.main()
