'''
You're given a binary tree where each node can be either an integer or an operator.
You're also given the three values that each node can take: -1, -2, -3, or -4.
-1 represents an addition operator.
-2 represents a subtraction operator.
-3 represents a division operator. If the result is a decimal, the result should be rounded down to the nearest whole number.
-4 represents a multiplication operator.

Write a function that takes in the root of the tree and evaluates the expression it represents.

Sample Input:
tree =
        -1
       / \
      -2   -3
     / \  / \
    -4  2 8  3
    / \
    3  2

Sample Output:
6 // ((2*3)-2) + (8/3)

'''


# This is an input class. Do not edit.
class BinaryTree:
    def __init__(self, value, left=None, right=None):
        self.value = value
        self.left = left
        self.right = right


def evaluateExpressionTree(tree):
    # Write your code here.
    # Time O(n) | Space O(h) - height of the tree
    if tree.value > -1:
        return tree.value

    if tree.value == -1:
        return evaluateExpressionTree(tree.left) + evaluateExpressionTree(tree.right)
    elif tree.value == -2:
        return evaluateExpressionTree(tree.left) - evaluateExpressionTree(tree.right)
    elif tree.value == -3:
        return int(evaluateExpressionTree(tree.left) / evaluateExpressionTree(tree.right))
    elif tree.value == -4:
        return evaluateExpressionTree(tree.left) * evaluateExpressionTree(tree.right)

    return


import unittest


class TestEvaluateExpressionTree(unittest.TestCase):
    def test_addition(self):
        tree = BinaryTree(-1, BinaryTree(2), BinaryTree(3))
        self.assertEqual(evaluateExpressionTree(tree), 5)

    def test_subtraction(self):
        tree = BinaryTree(-2, BinaryTree(5), BinaryTree(3))
        self.assertEqual(evaluateExpressionTree(tree), 2)

    def test_multiplication(self):
        tree = BinaryTree(-4, BinaryTree(2), BinaryTree(3))
        self.assertEqual(evaluateExpressionTree(tree), 6)

    def test_division(self):
        tree = BinaryTree(-3, BinaryTree(8), BinaryTree(3))
        self.assertEqual(evaluateExpressionTree(tree), 2)

    def test_complex_expression(self):
        tree = BinaryTree(
            -1,
            BinaryTree(-2, BinaryTree(-4, BinaryTree(3), BinaryTree(2)), BinaryTree(2)),
            BinaryTree(-3, BinaryTree(8), BinaryTree(3)),
        )
        self.assertEqual(evaluateExpressionTree(tree), 6)


if __name__ == '__main__':
    unittest.main()
