'''
Write a fucntion that takes in a Binary Tree and returns a list of its branch sums ordered from leftmost branch sum to rightmost branch sum.

Sample Input:
tree =
        1
       / \
      2   3
     / \ / \
    4  5 6 7
   / \ /
   8  9 10

Sample Output:
[15, 16, 18, 10, 11]

// 15 == 1 + 2 + 4 + 8
// 16 == 1 + 2 + 4 + 9
// 18 == 1 + 2 + 5 + 10
// 10 == 1 + 3 + 6
// 11 == 1 + 3 + 7
'''


# This is the class of the input root. Do not edit it.
class BinaryTree:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None


def branchSums(root):
    # Write your code here.
    # Time O(n) | Space O(n)
    outputs = []

    def visit(tree, curr_sum):
        if tree.left is None and tree.right is None:
            outputs.append(curr_sum + tree.value)
            return
        if tree.left is None:
            visit(tree.right, curr_sum + tree.value)
            return

        if tree.right is None:
            visit(tree.left, curr_sum + tree.value)
            return

        # both of them not none
        visit(tree.left, curr_sum + tree.value)
        visit(tree.right, curr_sum + tree.value)

    visit(root, 0)

    return outputs


import unittest


class TestBranchSums(unittest.TestCase):
    def test_branch_sums(self):
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
        tree.left.right.left = BinaryTree(10)
        self.assertEqual(branchSums(tree), [15, 16, 18, 10, 11])


if __name__ == "__main__":
    unittest.main()
