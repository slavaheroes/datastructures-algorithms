'''
Write a function that takes in a Binary Search Tree (BST) and a target integer value and returns the closest value to that target value contained in the BST.
You can assume that there will only be one closest value.
Each BST node has an integer value, a left child node, and a right child node.
A node is said to be a valid BST node if and only if it satisfies the BST property:
- its value is strictly greater than the values of every node to its left;
- its value is less than or equal to the values of every node to its right;
- and its children nodes are either valid BST nodes themselves or None / null.


Sample input:
       10
      /  \
     5    15
    / \   / \
   2   5 13  22
  /      /
 1      14

target = 12

Sample output: 13
'''

# Time: O(log(n)) | Space: O(1)


def findClosestValueInBst(tree, target):
    # Write your code here.

    curr_dif = None
    curr_value = None

    while True:
        if tree.value == target:
            return tree.value

        if tree.left is None and target <= tree.value:
            if abs(tree.value - target) < curr_dif:
                return tree.value
            return curr_value
        elif tree.right is None and target >= tree.value:
            if abs(tree.value - target) < curr_dif:
                return tree.value
            return curr_value
        elif tree.left and target <= tree.value:
            if curr_value is None or curr_dif > abs(tree.value - target):
                curr_value = tree.value
                curr_dif = abs(tree.value - target)
            tree = tree.left
        elif tree.right and target >= tree.value:
            if curr_value is None or curr_dif > abs(tree.value - target):
                curr_value = tree.value
                curr_dif = abs(tree.value - target)
            tree = tree.right

    return None


# This is the class of the input tree. Do not edit.
class BST:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None


import unittest


class TestFindClosestValueInBst(unittest.TestCase):
    def setUp(self):
        # Create the BST from the sample input
        self.tree = BST(10)
        self.tree.left = BST(5)
        self.tree.right = BST(15)
        self.tree.left.left = BST(2)
        self.tree.left.right = BST(5)
        self.tree.left.left.left = BST(1)
        self.tree.right.left = BST(13)
        self.tree.right.right = BST(22)
        self.tree.right.left.left = BST(14)

    def test_find_closest_value(self):
        target = 12
        expected_output = 13
        self.assertEqual(findClosestValueInBst(self.tree, target), expected_output)
        print('Test case 1 passed')


if __name__ == '__main__':
    unittest.main()
