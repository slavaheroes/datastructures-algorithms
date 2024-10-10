'''
Write a function that takes in a Binary Tree and returns its diameter.
The diameter of a binary tree is defined as the length of its longest path, even if that path doesn't pass through the root of the tree.

A path is a collection of connected nodes in a tree, where no node is connected to more than two other nodes.
The length of a path is the number of edges between the path's first node and its last node.

Sample Input:
tree =
        1
       / \
      3   2
     / \
    7   4
    /     \
    8       5
    /         \
    9           6

Sample Output:
6 // 9 -> 8 -> 7 -> 3 -> 4 -> 5 -> 6

'''


# This is an input class. Do not edit.
class BinaryTree:
    def __init__(self, value, left=None, right=None):
        self.value = value
        self.left = left
        self.right = right


def path(node):
    global diameter

    left, right = 0, 0
    if node.left:
        left = path(node.left) + 1
    if node.right:
        right = path(node.right) + 1
    k = left + right
    diameter = max(k, diameter)

    return max(left, right)


def binaryTreeDiameter(tree):
    # Write your code here.
    # Time O(n) | Space O(h) h is height of tree
    global diameter
    diameter = 0
    path(tree)

    return diameter


import unittest


class TestBinaryTreeDiameter(unittest.TestCase):
    def test_single_node(self):
        tree = BinaryTree(1)
        self.assertEqual(binaryTreeDiameter(tree), 0)

    def test_two_nodes(self):
        tree = BinaryTree(1, BinaryTree(2))
        self.assertEqual(binaryTreeDiameter(tree), 1)

    def test_balanced_tree(self):
        tree = BinaryTree(1, BinaryTree(2), BinaryTree(3))
        self.assertEqual(binaryTreeDiameter(tree), 2)

    def test_unbalanced_tree(self):
        tree = BinaryTree(1, BinaryTree(2, BinaryTree(3, BinaryTree(4))))
        self.assertEqual(binaryTreeDiameter(tree), 3)

    def test_complex_tree(self):
        tree = BinaryTree(
            1,
            BinaryTree(
                3, BinaryTree(7, BinaryTree(8, BinaryTree(9)), None), BinaryTree(4, None, BinaryTree(5, None, BinaryTree(6)))
            ),
            BinaryTree(2),
        )
        self.assertEqual(binaryTreeDiameter(tree), 6)


if __name__ == '__main__':
    unittest.main()
