'''
You're given the root node of a Binary Tree. Write a function that returns true if this Binary Tree is height balanced and false if it isn't.

A Binary Tree is height balanced if for each node in the tree, the difference between the height of its left subtree and the height of its right subtree is at most 1.

Sample input:
tree = 1
     /   \
    2     3
   / \   / \
  4   5 6   7
 / \
8   9

Sample output: True
'''


# This is an input class. Do not edit.
class BinaryTree:
    def __init__(self, value, left=None, right=None):
        self.value = value
        self.left = left
        self.right = right


def check_balanced(tree):
    if tree is None:
        return 1

    left_h = check_balanced(tree.left) + 1
    right_h = check_balanced(tree.right) + 1

    if abs(left_h - right_h) > 1:
        global isBalanced
        isBalanced = False

    return max(left_h, right_h)


def heightBalancedBinaryTree(tree):
    # time O(n) | space O(h)
    # Write your code here.
    global isBalanced
    isBalanced = True
    check_balanced(tree)
    return isBalanced


import unittest


class TestProgram(unittest.TestCase):
    def test_case_1(self):
        tree = BinaryTree(1)
        tree.left = BinaryTree(2)
        tree.right = BinaryTree(3)
        tree.left.left = BinaryTree(4)
        tree.left.right = BinaryTree(5)
        tree.right.left = BinaryTree(6)
        tree.right.right = BinaryTree(7)
        tree.left.left.left = BinaryTree(8)
        tree.left.left.right = BinaryTree(9)
        self.assertEqual(heightBalancedBinaryTree(tree), True)

    def test_case_2(self):
        tree = BinaryTree(1)
        tree.left = BinaryTree(2)
        tree.right = BinaryTree(3)
        tree.left.left = BinaryTree(4)
        tree.left.right = BinaryTree(5)
        tree.left.left.left = BinaryTree(7)
        tree.left.left.right = BinaryTree(8)
        self.assertEqual(heightBalancedBinaryTree(tree), False)


if __name__ == '__main__':
    unittest.main()
