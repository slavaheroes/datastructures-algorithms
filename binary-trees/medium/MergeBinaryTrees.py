'''
Write a function that takes in two Binary Trees and merges them. The merge should be done in the following way:
- If two nodes overlap during the merge, the value of the merged node should be the sum of the values of the overlapping nodes.
- If only one node in the merge is non-null, the node in the new tree should have the same value as the non-null node.

Sample input:
tree1 = 1
      /   \
     3     2
    / \
   7   4

tree2 = 1
       /  \
      5    9
     /   /  \
    2   7    6

Sample output:
merged_tree = 2
            /   \
           8     11
          / \   /  \
         9  4  7   6
'''


# This is an input class. Do not edit.
class BinaryTree:
    def __init__(self, value, left=None, right=None):
        self.value = value
        self.left = left
        self.right = right


def mergeBinaryTrees(tree1, tree2):
    # Write your code here.
    # Time O(min(n, m)) sum of number of nodes
    # Space O(min(h1, h2)) heights of trees
    if tree1 is None and tree2 is None:
        return None
    elif tree1 is None:
        return tree2
    elif tree2 is None:
        return tree1

    merged_tree = BinaryTree(tree1.value + tree2.value)
    merged_tree.left = mergeBinaryTrees(tree1.left, tree2.left)
    merged_tree.right = mergeBinaryTrees(tree1.right, tree2.right)

    return merged_tree


import unittest


class TestProgram(unittest.TestCase):
    def test_case_1(self):
        tree1 = BinaryTree(1)
        tree1.left = BinaryTree(3)
        tree1.right = BinaryTree(2)
        tree1.left.left = BinaryTree(7)
        tree1.left.right = BinaryTree(4)

        tree2 = BinaryTree(1)
        tree2.left = BinaryTree(5)
        tree2.right = BinaryTree(9)
        tree2.left.left = BinaryTree(2)
        tree2.right.left = BinaryTree(7)
        tree2.right.right = BinaryTree(6)

        merged_tree = mergeBinaryTrees(tree1, tree2)
        self.assertEqual(merged_tree.value, 2)
        self.assertEqual(merged_tree.left.value, 8)
        self.assertEqual(merged_tree.right.value, 11)
        self.assertEqual(merged_tree.left.left.value, 9)
        self.assertEqual(merged_tree.left.right.value, 4)
        self.assertEqual(merged_tree.right.left.value, 7)
        self.assertEqual(merged_tree.right.right.value, 6)


if __name__ == "__main__":
    unittest.main()
