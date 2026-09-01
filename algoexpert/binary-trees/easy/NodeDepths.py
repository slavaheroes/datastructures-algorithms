'''
The distance between a node in a Binary Tree and the tree's root is called the node's depth.
Write a function that takes in a Binary Tree and returns the sum of its nodes' depths.

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
16
// The depth of the node with value 2 is 1.
// The depth of the node with value 3 is 1.
// The depth of the node with value 4 is 2.
// The depth of the node with value 5 is 2.
// Etc..
// Summing all of these depths yields 16.
'''


def nodeDepths(root):
    # Write your code here.
    # Time O(n) | Space O(h) - height of the tree

    # bread first search
    sum_all = 0
    stack = [(root.left, 1), (root.right, 1)]

    while len(stack) != 0:
        node, level = stack.pop(0)
        if node is None:
            continue
        sum_all += level
        stack.append((node.left, level + 1))
        stack.append((node.right, level + 1))

    return sum_all


# This is the class of the input binary tree.
class BinaryTree:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None


import unittest


class TestNodeDepths(unittest.TestCase):
    def setUp(self):
        self.tree = BinaryTree(1)
        self.tree.left = BinaryTree(2)
        self.tree.right = BinaryTree(3)
        self.tree.left.left = BinaryTree(4)
        self.tree.left.right = BinaryTree(5)
        self.tree.right.left = BinaryTree(6)
        self.tree.right.right = BinaryTree(7)
        self.tree.left.left.left = BinaryTree(8)
        self.tree.left.left.right = BinaryTree(9)

    def test_node_depths(self):
        self.assertEqual(nodeDepths(self.tree), 16)

    def test_single_node_tree(self):
        single_node_tree = BinaryTree(1)
        self.assertEqual(nodeDepths(single_node_tree), 0)


if __name__ == '__main__':
    unittest.main()
