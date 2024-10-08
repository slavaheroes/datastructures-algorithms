'''
Implement the BST Class for a Binary Search Tree.
The class should support:
    - Inserting values with the insert method.
    - Removing values with the remove method; this method should only remove the first instance of a given value.
    - Searching for values with the contains method.
'''


# Do not edit the class below except for
# the insert, contains, and remove methods.
# Feel free to add new properties and methods
# to the class.
class BST:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None

    def insert(self, value):
        # Write your code here.
        # Time O(log(n)) | Space O(1)
        curr = self
        while curr:
            if curr.value > value:
                if curr.left is None:
                    # insert here
                    curr.left = BST(value)
                    break
                curr = curr.left
            else:
                if curr.right is None:
                    curr.right = BST(value)
                    break
                curr = curr.right
        # Do not edit the return statement of this method.
        return self

    def contains(self, value):
        # Write your code here.
        # Time O(log(n)) | Space O(1)
        curr = self
        while curr:
            if curr.value == value:
                return True
            if curr.value > value:
                curr = curr.left
            else:
                curr = curr.right
        return False

    def getMinValue(self):
        curr = self
        while curr.left:
            curr = curr.left
        return curr.value

    def remove(self, value, parent=None):
        # Write your code here.
        # Time O(logn) | Space O(1)

        curr = self
        while curr:
            if curr.value > value:
                parent = curr
                curr = curr.left
            elif curr.value < value:
                parent = curr
                curr = curr.right
            else:  # actual removal
                if curr.left and curr.right:
                    print('scenario 1')
                    curr.value = curr.right.getMinValue()
                    curr.right.remove(curr.value, curr)
                elif parent is None:
                    print('scenario 4')
                    if curr.left:
                        curr.value = curr.left.value
                        curr.right = curr.left.right
                        curr.left = curr.left.left
                    elif curr.right:
                        curr.value = curr.right.value
                        curr.left = curr.right.left
                        curr.right = curr.right.right
                    else:
                        # This is a single-node tree; do nothing
                        pass
                elif parent.left == curr:
                    print('scenario 2')
                    parent.left = curr.left if curr.left else curr.right
                    del curr
                elif parent.right == curr:
                    print('scenario 3')
                    parent.right = curr.left if curr.left else curr.right
                    del curr

                break
        # Do not edit the return statement of this method.
        return self


import unittest


class TestBST(unittest.TestCase):
    def setUp(self):
        self.bst = BST(10)
        self.bst.insert(5).insert(15).insert(2).insert(5).insert(13).insert(22).insert(1).insert(14)

    def test_insert(self):
        self.bst.insert(12)
        self.assertTrue(self.bst.contains(12))
        self.assertFalse(self.bst.contains(20))

    def test_contains(self):
        self.assertTrue(self.bst.contains(10))
        self.assertTrue(self.bst.contains(15))
        self.assertFalse(self.bst.contains(99))

    def test_remove_leaf_node(self):
        self.bst.remove(1)
        self.assertFalse(self.bst.contains(1))

    def test_remove_node_with_one_child(self):
        self.bst.remove(2)
        self.assertFalse(self.bst.contains(2))
        self.assertTrue(self.bst.contains(1))

    def test_remove_node_with_two_children(self):
        self.bst.remove(5)
        self.assertTrue(self.bst.contains(2))
        self.assertTrue(self.bst.contains(10))

    def test_remove_root_node(self):
        self.bst.remove(10)
        self.assertFalse(self.bst.contains(10))
        self.assertTrue(self.bst.contains(5))
        self.assertTrue(self.bst.contains(15))


if __name__ == '__main__':
    unittest.main()
