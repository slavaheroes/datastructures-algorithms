'''
Write a function that takes in a Binary Tree and inverts it. In other words, the function should swap every left node in the tree for its corresponding right node.
Each BinaryTree node has an integer value, a left child node, and a right child node. Children nodes can either be BinaryTree nodes themselves or None / null.

Sample Input:
tree =
        1
       / \
      2   3
     / \ / \
    4  5 6 7
   / \
   8  9

Sample Output:
tree =
        1
       / \
      3   2
     / \ / \
    7  6 5 4
            \
            9
            \
            8
'''


def invertBinaryTree(tree):
    # Write your code here.
    # Time O(n)
    # Space O(d) - depth | number of recursions

    node = tree.left
    tree.left = tree.right
    tree.right = node

    if tree.left:
        invertBinaryTree(tree.left)

    if tree.right:
        invertBinaryTree(tree.right)


# This is the class of the input binary tree.
class BinaryTree:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None


import unittest


class TestInvertBinaryTree(unittest.TestCase):
    def test_invert_binary_tree(self):
        # Create the binary tree from the sample input
        tree = BinaryTree(1)
        tree.left = BinaryTree(2)
        tree.right = BinaryTree(3)
        tree.left.left = BinaryTree(4)
        tree.left.right = BinaryTree(5)
        tree.right.left = BinaryTree(6)
        tree.right.right = BinaryTree(7)
        tree.left.left.left = BinaryTree(8)
        tree.left.left.right = BinaryTree(9)

        # Invert the binary tree
        invertBinaryTree(tree)

        # Check the structure of the inverted tree
        self.assertEqual(tree.value, 1)
        self.assertEqual(tree.left.value, 3)
        self.assertEqual(tree.right.value, 2)
        self.assertEqual(tree.left.left.value, 7)
        self.assertEqual(tree.left.right.value, 6)
        self.assertEqual(tree.right.left.value, 5)
        self.assertEqual(tree.right.right.value, 4)
        self.assertEqual(tree.right.right.left.value, 9)
        self.assertEqual(tree.right.right.right.value, 8)


if __name__ == '__main__':
    unittest.main()
