'''
Write a function that takes in an array of words and returns the smallest array of characters needed to form all of the words.
The characters don't need to be in any particular order.

For example, the characters ["y", "r", "o", "u"] are needed to form the words ["your", "you", "or", "yo"].

Sample Input:
words = ["this", "that", "did", "deed", "them!", "a"]

Sample Output:
["t", "t", "h", "i", "s", "a", "d", "d", "e", "e", "m", "!"]

'''


def minimumCharactersForWords(words):
    # Write your code here.
    # O(n*max_len) time | n words, and string with max_len
    # O(c) space | c number of unique chars
    global_table = {}

    for w in words:

        freq_table = {}
        for ch in w:
            freq_table[ch] = freq_table.get(ch, 0) + 1

        for k, v in freq_table.items():
            global_table[k] = max(v, global_table.get(k, 0))

    ans = []

    for k, v in global_table.items():
        for _ in range(v):
            ans.append(k)

    return ans


import unittest


class TestProgram(unittest.TestCase):
    def test_case_1(self):
        words = ["this", "that", "did", "deed", "them!", "a"]
        output = ["t", "t", "h", "i", "s", "a", "d", "d", "e", "e", "m", "!"]
        self.assertEqual(minimumCharactersForWords(words), output)


if __name__ == "__main__":
    unittest.main()
