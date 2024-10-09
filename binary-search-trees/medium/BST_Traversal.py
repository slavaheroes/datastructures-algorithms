'''
Imprement BST traversal methods
'''

from BST_Construction import BST


# Time O(n) | Space O(n) all traversals
def inOrderTraverse(tree, array):
    # Write your code here.
    if tree is None:
        return

    inOrderTraverse(tree.left, array)
    array.append(tree.value)
    inOrderTraverse(tree.right, array)

    return array


def preOrderTraverse(tree, array):
    # Write your code here.
    if tree is None:
        return

    array.append(tree.value)
    preOrderTraverse(tree.left, array)
    preOrderTraverse(tree.right, array)
    return array


def postOrderTraverse(tree, array):
    # Write your code here.
    if tree is None:
        return

    postOrderTraverse(tree.left, array)
    postOrderTraverse(tree.right, array)
    array.append(tree.value)

    return array


import unittest


class TestBSTTraversal(unittest.TestCase):
    def setUp(self):
        self.bst = BST(10)
        self.bst.insert(5).insert(15).insert(2).insert(5).insert(13).insert(22).insert(1).insert(14)

    def test_inOrderTraverse(self):
        result = inOrderTraverse(self.bst, [])
        expected = [1, 2, 5, 5, 10, 13, 14, 15, 22]
        self.assertEqual(result, expected)

    def test_preOrderTraverse(self):
        result = preOrderTraverse(self.bst, [])
        expected = [10, 5, 2, 1, 5, 15, 13, 14, 22]
        self.assertEqual(result, expected)

    def test_postOrderTraverse(self):
        result = postOrderTraverse(self.bst, [])
        expected = [1, 2, 5, 5, 14, 13, 22, 15, 10]
        self.assertEqual(result, expected)


if __name__ == '__main__':
    unittest.main()
