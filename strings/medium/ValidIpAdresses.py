'''
You're given a string of length 12 or smaller, containing only digits.
Write a function that returns all the possible IP addresses that can be created by inserting three .s in the string.

Sample input:
string = "1921680"
Sample output:
["1.9.216.80", "1.92.16.80", "1.92.168.0", "19.2.16.80", "19.2.168.0", "19.21.6.80", "19.21.68.0", "19.216.8.0", "192.1.6.80", "192.1.68.0", "192.16.8.0"]

'''


def isvalid(string):
    if len(string) == 1 and string[0] == "0":
        return True
    if len(string) == 0 or string[0] == "0":
        return False
    return int(string) < 256


def validIPAddresses(string):
    # Write your code here.
    # O(1) time space

    ip_list = []
    for i in range(1, 4):
        for j in range(1, 4):
            for k in range(1, 4):
                num_one = string[:i]
                num_two = string[i : i + j]
                num_three = string[i + j : i + j + k]
                num_four = string[i + j + k :]

                if all([isvalid(s) for s in [num_one, num_two, num_three, num_four]]):
                    ip_list.append(".".join([num_one, num_two, num_three, num_four]))

    return ip_list


import unittest


class TestProgram(unittest.TestCase):
    def test_case_1(self):
        self.assertEqual(
            validIPAddresses("1921680"),
            [
                "1.9.216.80",
                "1.92.16.80",
                "1.92.168.0",
                "19.2.16.80",
                "19.2.168.0",
                "19.21.6.80",
                "19.21.68.0",
                "19.216.8.0",
                "192.1.6.80",
                "192.1.68.0",
                "192.16.8.0",
            ],
        )


if __name__ == "__main__":
    unittest.main()
