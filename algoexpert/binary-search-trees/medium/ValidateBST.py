'''

Write a function that takes in a potentially invalid Binary Search Tree (BST) and returns a boolean representing whether the BST is valid.
Each BST node has an integer value, a left child node, and a right child node.
A node is said to be a valid BST node if and only if it satisfies the BST property:
- its value is strictly greater than the values of every node to its left;
- its value is less than or equal to the values of every node to its right;
- and its children nodes are either valid BST nodes themselves or None / null.
A BST is valid if and only if all of its nodes are valid BST nodes.

Sample input:
       10
      /  \
     5    15
    / \   / \
   2   5 13  22
  /      \
 1        14

Sample output: True

'''


# This is an input class. Do not edit.
class BST:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None


# Solution: Time O(n) | Space O(d) where d is the depth of the tree
# The time complexity is O(n) because we have to traverse all the nodes of the tree to validate the BST.
# The space complexity is O(d) because we are using the call stack to traverse the tree.
# The maximum number of calls in the call stack is equal to the depth of the tree.
def validateBst(tree, min_val=None, max_val=None):
    # Write your code here.
    if tree is None:
        return True

    if min_val is None:
        min_val = float('-inf')

    if max_val is None:
        max_val = float('inf')

    if tree.value >= min_val and tree.value < max_val:
        return validateBst(tree.left, min_val, tree.value) and validateBst(tree.right, tree.value, max_val)

    return False


import unittest


class TestValidateBST(unittest.TestCase):
    def test_valid_bst(self):
        # Construct the BST from the sample input
        root = BST(10)
        root.left = BST(5)
        root.right = BST(15)
        root.left.left = BST(2)
        root.left.right = BST(5)
        root.left.left.left = BST(1)
        root.right.left = BST(13)
        root.right.right = BST(22)
        root.right.left.right = BST(14)

        # Test if the BST is valid
        self.assertTrue(validateBst(root))

    def test_invalid_bst(self):
        # Construct an invalid BST
        root = BST(10)
        root.left = BST(5)
        root.right = BST(15)
        root.left.left = BST(2)
        root.left.right = BST(5)
        root.left.left.left = BST(1)
        root.right.left = BST(13)
        root.right.right = BST(22)
        root.right.left.right = BST(9)  # This makes the BST invalid

        # Test if the BST is invalid
        self.assertFalse(validateBst(root))

    def test_empty_bst(self):
        # Test with an empty BST
        self.assertTrue(validateBst(None))

    def test_single_node_bst(self):
        # Test with a single node BST
        root = BST(10)
        self.assertTrue(validateBst(root))

    def test_left_skewed_bst(self):
        # Construct a left skewed BST
        root = BST(10)
        root.left = BST(5)
        root.left.left = BST(2)
        root.left.left.left = BST(1)

        # Test if the BST is valid
        self.assertTrue(validateBst(root))

    def test_right_skewed_bst(self):
        # Construct a right skewed BST
        root = BST(10)
        root.right = BST(15)
        root.right.right = BST(20)
        root.right.right.right = BST(25)

        # Test if the BST is valid
        self.assertTrue(validateBst(root))


if __name__ == '__main__':
    unittest.main()
