'''
Write a function that takes in an array of strings and groups anagrams together.

Anagrams are strings made up of exactly the same letters, where order doesn't matter. For example, "cinema" and "iceman" are anagrams; similarly, "foo" and "ofo" are anagrams.

Your function should return a list of anagram groups in no particular order.

Sample Input:
words = ["yo", "act", "flop", "tac", "foo", "cat", "oy", "olfp"]
Sample Output:
[["yo", "oy"], ["flop", "olfp"], ["act", "tac", "cat"], ["foo"]]

'''

# # Brute-force
# def same_hash(hash1, hash2):
#     if len(hash1)!=len(hash2):
#         return False

#     for k, v in hash1.items():
#         if k in hash2:
#             if hash2[k]!=v:
#                 return False
#         else:
#             return False

#     return True

# def groupAnagrams(words):
#     # Write your code here.
#     # Space: O(n*w) | w - is max len string
#     # Time: O(n^2 * w)

#     anagrams = []

#     while len(words)>0:
#         curr_hash = {}
#         for w in words[0]:
#             if w in curr_hash:
#                 curr_hash[w]+=1
#             else:
#                 curr_hash[w]=1

#         curr_anagrams = [words[0]]
#         words.pop(0)
#         i = 0
#         while i < len(words):
#             new_hash = {}
#             for w in words[i]:
#                 if w in new_hash:
#                     new_hash[w]+=1
#                 else:
#                     new_hash[w]=1

#             if same_hash(curr_hash, new_hash):
#                 curr_anagrams.append(words[i])
#                 words.pop(i)
#             else:
#                 i += 1

#         anagrams.append(curr_anagrams)

#     return anagrams


# Optimized
def groupAnagrams(words):
    # Write your code here.
    # Space: O(n*w) - w is len of string
    # Time: O(n*w*log(w))

    anagrams = []
    hash_t = {}
    for w in words:
        key = ''.join(sorted(w))  # O(w*log(w))
        if key in hash_t:
            hash_t[key].append(w)
        else:
            hash_t[key] = [w]

    for _, v in hash_t.items():
        anagrams.append(v)

    return anagrams


import unittest


class TestProgram(unittest.TestCase):
    def test_case_1(self):
        self.assertEqual(
            groupAnagrams(["yo", "act", "flop", "tac", "foo", "cat", "oy", "olfp"]),
            [["yo", "oy"], ["act", "tac", "cat"], ["flop", "olfp"], ["foo"]],
        )


if __name__ == '__main__':
    unittest.main()
