'''
Write a function that takes in a Binary Search Tree (BST) and a positive integer k and returns the kth largest integer contained in the BST.

Sample Input:
tree =
        15
     /     \
    5      20
   /   \   /   \
  2     5 17   22
 / \
1   3

k = 3

Sample Output:
17
'''


# This is an input class. Do not edit.
class BST:
    def __init__(self, value, left=None, right=None):
        self.value = value
        self.left = left
        self.right = right


# Bruteforce solution
# def inorder_traversal(root, array):
#     if root is None:
#         return
#     inorder_traversal(root.left, array)
#     array.append(root.value)
#     inorder_traversal(root.right, array)

# def findKthLargestValueInBst(tree, k):
#     # Write your code here.
#     # time O(n)
#     # space O(n)
#     array = []
#     inorder_traversal(tree, array)
#     return array[len(array)-k]


# Optimized solution
def findKthLargestValueInBst(tree, k):
    # Write your code here.
    # Time: O(k+h) | h - height
    # Space: O(k + h)

    stack = []
    curr = tree
    n = 1

    while curr or stack:
        if curr:
            stack.append(curr)
            curr = curr.right
        else:
            curr = stack.pop()
            if n == k:
                return curr.value
            n += 1

            curr = curr.left
    print("Invalid k")

    return -1


import unittest


class TestFindKthLargestValueInBst(unittest.TestCase):
    def setUp(self):
        self.tree = BST(15)
        self.tree.left = BST(5)
        self.tree.right = BST(20)
        self.tree.left.left = BST(2)
        self.tree.left.right = BST(5)
        self.tree.left.left.left = BST(1)
        self.tree.left.left.right = BST(3)
        self.tree.right.left = BST(17)
        self.tree.right.right = BST(22)

    def test_find_kth_largest_value_in_bst(self):
        self.assertEqual(findKthLargestValueInBst(self.tree, 1), 22)
        self.assertEqual(findKthLargestValueInBst(self.tree, 2), 20)
        self.assertEqual(findKthLargestValueInBst(self.tree, 3), 17)
        self.assertEqual(findKthLargestValueInBst(self.tree, 4), 15)
        self.assertEqual(findKthLargestValueInBst(self.tree, 5), 5)
        self.assertEqual(findKthLargestValueInBst(self.tree, 6), 5)
        self.assertEqual(findKthLargestValueInBst(self.tree, 7), 3)
        self.assertEqual(findKthLargestValueInBst(self.tree, 8), 2)
        self.assertEqual(findKthLargestValueInBst(self.tree, 9), 1)

    def test_find_kth_largest_value_in_bst_invalid_k(self):
        self.assertEqual(findKthLargestValueInBst(self.tree, 10), -1)
        self.assertEqual(findKthLargestValueInBst(self.tree, 0), -1)


if __name__ == '__main__':
    unittest.main()
