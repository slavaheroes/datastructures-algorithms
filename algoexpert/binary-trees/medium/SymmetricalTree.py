'''
Write a function that takes in a Binary Tree and returns a boolean representing whether the Binary Tree is symmetrical.
A binary tree is considered symmetrical if the left subtree of the tree is the mirror image of the right subtree.
This means that the tree is symmetric around its root node. In other words, it is symmetric if the tree is unchanged when mirrored around its center.

Sample input:
tree = 1
      /   \
     2     2
    / \   / \
   3   4 4   3

Sample output: True
'''


# This is an input class. Do not edit.
class BinaryTree:
    def __init__(self, value, left=None, right=None):
        self.value = value
        self.left = left
        self.right = right


def check(left, right):
    if left is None and right is None:
        return True
    elif left and right:
        if left.value == right.value:
            return check(left.left, right.right) and check(left.right, right.left)
        else:
            return False
    return False


def symmetricalTree(tree):
    # Write your code here.
    # O(n) time
    # O(h) space
    return check(tree.left, tree.right)


import unittest


class TestProgram(unittest.TestCase):
    def test_case_1(self):
        tree = BinaryTree(1)
        tree.left = BinaryTree(2)
        tree.right = BinaryTree(2)
        tree.left.left = BinaryTree(3)
        tree.left.right = BinaryTree(4)
        tree.right.left = BinaryTree(4)
        tree.right.right = BinaryTree(3)
        self.assertEqual(symmetricalTree(tree), True)

    def test_case_2(self):
        tree = BinaryTree(1)
        tree.left = BinaryTree(2)
        tree.right = BinaryTree(2)
        tree.left.left = BinaryTree(3)
        tree.left.right = BinaryTree(4)
        tree.right.left = BinaryTree(3)
        tree.right.right = BinaryTree(4)
        self.assertEqual(symmetricalTree(tree), False)


if __name__ == '__main__':
    unittest.main()
