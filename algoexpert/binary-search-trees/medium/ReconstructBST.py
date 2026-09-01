'''
Given a non-empty array of integers representing the pre-order traversal of a Binary Search Tree (BST), write a function that creates the BST from the given array.

Sample input:
array = [10, 4, 2, 1, 5, 17, 19, 18]

Sample output:
        10
       /  \
      4    17
     / \     \
    2   5     19
    /         /
    1         18
'''


# This is an input class. Do not edit.
class BST:
    def __init__(self, value, left=None, right=None):
        self.value = value
        self.left = left
        self.right = right


def reconstructBst(preOrderTraversalValues):
    if len(preOrderTraversalValues) == 0:
        return None
    # Time O(n) | Space O(n)
    root = BST(preOrderTraversalValues[0])
    stack = [root]
    k = 1

    curr = root
    while k != len(preOrderTraversalValues):
        if preOrderTraversalValues[k] < curr.value:
            curr.left = BST(preOrderTraversalValues[k])
            curr = curr.left
            stack.append(curr)
            k += 1
        else:
            if len(stack) == 0:
                # curr is root
                curr.right = BST(preOrderTraversalValues[k])
                curr = curr.right
                stack.append(curr)
                k += 1
                continue

            parent = stack.pop(-1)
            if parent.value > preOrderTraversalValues[k]:
                curr.right = BST(preOrderTraversalValues[k])
                curr = curr.right
                stack.append(parent)
                stack.append(curr)
                k += 1
            else:
                curr = parent
    return root


import unittest


class TestReconstructBst(unittest.TestCase):
    def bstToList(self, root):
        if root is None:
            return []
        return [root.value] + self.bstToList(root.left) + self.bstToList(root.right)

    def test_reconstructBst(self):
        array = [10, 4, 2, 1, 5, 17, 19, 18]
        bst = reconstructBst(array)
        result = self.bstToList(bst)
        expected = [10, 4, 2, 1, 5, 17, 19, 18]
        self.assertEqual(result, expected)

    def test_reconstructBst_single_element(self):
        array = [10]
        bst = reconstructBst(array)
        result = self.bstToList(bst)
        expected = [10]
        self.assertEqual(result, expected)

    def test_reconstructBst_empty(self):
        array = []
        bst = reconstructBst(array)
        result = self.bstToList(bst)
        expected = []
        self.assertEqual(result, expected)


if __name__ == '__main__':
    unittest.main()
