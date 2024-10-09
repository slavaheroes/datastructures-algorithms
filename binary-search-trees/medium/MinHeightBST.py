'''
Write a function that takes in a non-empty sorted array of distinct integers,
constructs a BST from the integers, and returns the root of the BST.
The function should minimize the height of the BST.
You've been provided with a BST class that you'll have to use to construct the BST.
Each BST node has an integer value, a left child node, and a right child node.
A node is said to be a valid Bst node if and only if it satisfies the BST property: its value is strictly greater than the values of every node to its left; its value is less than or equal to the values of every node to its right; and its children nodes are either valid Bst nodes themselves or None / null.
A BST is valid if and only if all of its nodes are valid BST nodes.
Note that the BST class already has an insert method which you can use if you want.

Sample input:
array = [1, 2, 5, 7, 10, 13, 14, 15, 22]

Sample output:
        10
       /  \
     2     14
    / \   /  \
   1   5 13  15
        \      \
        7      22

'''


def do_insert(root, array):
    if len(array) == 0:
        return
    mid = len(array) // 2
    root.insert(array[mid])
    do_insert(root, array[:mid])
    do_insert(root, array[mid + 1 :])


def minHeightBst(array):
    # Time: O(n)
    # Space: O(n) recursion n times
    # array.sort()

    mid = len(array) // 2
    root_val = array[mid]
    root = BST(root_val)

    do_insert(root, array[:mid])
    do_insert(root, array[mid + 1 :])

    return root


class BST:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None

    def insert(self, value):
        if value < self.value:
            if self.left is None:
                self.left = BST(value)
            else:
                self.left.insert(value)
        else:
            if self.right is None:
                self.right = BST(value)
            else:
                self.right.insert(value)


import unittest


class TestMinHeightBST(unittest.TestCase):
    def setUp(self):
        self.array = [1, 2, 5, 7, 10, 13, 14, 15, 22]
        self.root = minHeightBst(self.array)

    def test_bst_property(self):
        def is_valid_bst(node, min_val, max_val):
            if node is None:
                return True
            if not (min_val < node.value <= max_val):
                return False
            return is_valid_bst(node.left, min_val, node.value) and is_valid_bst(node.right, node.value, max_val)

        self.assertTrue(is_valid_bst(self.root, float('-inf'), float('inf')))

    def test_min_height(self):
        def get_height(node):
            if node is None:
                return -1
            return 1 + max(get_height(node.left), get_height(node.right))

        height = get_height(self.root)
        expected_height = 3  # For the given array, the minimal height is 3
        self.assertEqual(height, expected_height)


if __name__ == '__main__':
    unittest.main()
