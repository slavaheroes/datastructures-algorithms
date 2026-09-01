'''
Write a function that takes in a Binary Tree (where nodes have an additional pointer to their parent node) as well as a node contained in that tree and
returns the given node's successor.

A node's successor is the next node to be visited (immediately after the given node) when traversing its tree using in-order traversal.
A node has no successor if it's the last node to be visited in the in-order traversal.

If a node has no successor, your function should return None / null.

Sample input:
tree =
        1
       / \
      2   3
     / \
    4   5
   /
  6
node = 5

Sample output:
1
'''


# This is an input class. Do not edit.
class BinaryTree:
    def __init__(self, value, left=None, right=None, parent=None):
        self.value = value
        self.left = left
        self.right = right
        self.parent = parent


def findSuccessor(tree, node):
    # Write your code here.
    # O(h) time | O(1) space
    if node.right:
        curr = node.right
        while curr.left:
            curr = curr.left

        return curr

    curr = node
    while curr:
        if curr.parent:
            if curr.parent.left == curr:
                return curr.parent
        curr = curr.parent

    return None


import unittest


class TestProgram(unittest.TestCase):
    def test_case_1(self):
        root = BinaryTree(1)
        root.left = BinaryTree(2, parent=root)
        root.right = BinaryTree(3, parent=root)
        root.left.left = BinaryTree(4, parent=root.left)
        root.left.right = BinaryTree(5, parent=root.left)
        root.left.left.left = BinaryTree(6, parent=root.left.left)
        node = root.left.right
        expected = root
        actual = findSuccessor(root, node)
        self.assertEqual(expected, actual)


if __name__ == "__main__":
    unittest.main()
