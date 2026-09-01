'''
Write a function that takes in a Binary Tree and checks if that Binary Tree can be split into exactly two Binary Trees of equal sum by removing exactly one edge.
If this split is possible, return the new sum of each Binary Tree, otherwise return 0.
You do not need to return the edge that was removed.

Sample input:
tree = 1
      /   \
     3     -2
    / \   / \
   6   -5 5   2
  /
 2

Sample output:
6 // remove the edge to the left of the root
'''


# This is an input class. Do not edit.
class BinaryTree:
    def __init__(self, value, left=None, right=None):
        self.value = value
        self.left = left
        self.right = right


def calc_sum(tree):
    if tree is None:
        return 0
    left_sum = calc_sum(tree.left)
    right_sum = calc_sum(tree.right)
    curr_value = tree.value
    tree.value = curr_value + left_sum + right_sum
    return tree.value


def check_value(tree, total_sum):
    if tree is None:
        return False

    if tree.value == (total_sum / 2):
        return True

    return check_value(tree.left, total_sum) or check_value(tree.right, total_sum)


def splitBinaryTree(tree):
    # Write your code here.
    # O(n) time
    # O(h) space
    total_sum = calc_sum(tree)

    if total_sum % 2 == 1:
        return 0

    if check_value(tree, total_sum):
        return total_sum // 2

    return 0


import unittest


class TestProgram(unittest.TestCase):
    def test_case_1(self):
        tree = BinaryTree(1)
        tree.left = BinaryTree(3)
        tree.right = BinaryTree(-2)
        tree.left.left = BinaryTree(6)
        tree.left.right = BinaryTree(-5)
        tree.right.left = BinaryTree(5)
        tree.right.right = BinaryTree(2)
        tree.left.left.left = BinaryTree(2)
        self.assertEqual(splitBinaryTree(tree), 6)


if __name__ == "__main__":
    unittest.main()
