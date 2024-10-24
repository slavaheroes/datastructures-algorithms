'''
You're given three inputs, all of which are instances of an AncestralTree class that have an ancestor property pointing to their youngest ancestor.
The first input is the top ancestor in an ancestral tree (i.e., the only instance that has no ancestor),
and the other two inputs are descendants in the ancestral tree.

Write a function that returns the youngest common ancestor to the two descendants.

Note that a descendant is considered its own ancestor. So in the simple ancestral tree below,
the youngest common ancestor to nodes A and B is node A.
  A
 /
B

Sample Input:
topAncestor = node A
descendantOne = node E
descendantTwo = node I
        A
      /   \
     B     C
    / \   / \
   D   E F   G
  / \
 H   I

Sample Output:
node B
'''


# This is an input class. Do not edit.
class AncestralTree:
    def __init__(self, name):
        self.name = name
        self.ancestor = None


def getYoungestCommonAncestor(topAncestor, descendantOne, descendantTwo):
    # Write your code here.
    # O(d) time | O(1) space
    # d is max depth
    depth1 = 0
    curr = descendantOne
    while curr != topAncestor:
        curr = curr.ancestor
        depth1 += 1

    depth2 = 0
    curr = descendantTwo
    while curr != topAncestor:
        curr = curr.ancestor
        depth2 += 1

    while depth1 != depth2:
        if depth1 > depth2:
            descendantOne = descendantOne.ancestor
            depth1 -= 1
        else:
            descendantTwo = descendantTwo.ancestor
            depth2 -= 1

    while descendantOne != descendantTwo:
        descendantOne = descendantOne.ancestor
        descendantTwo = descendantTwo.ancestor

    return descendantTwo


import unittest


class TestProgram(unittest.TestCase):
    def test_case_1(self):
        topAncestor = AncestralTree("A")
        treeB = AncestralTree("B")
        treeC = AncestralTree("C")
        treeB.ancestor = topAncestor
        treeC.ancestor = topAncestor

        treeD = AncestralTree("D")
        treeE = AncestralTree("E")
        treeD.ancestor = treeB
        treeE.ancestor = treeB

        treeF = AncestralTree("F")
        treeG = AncestralTree("G")
        treeF.ancestor = treeC
        treeG.ancestor = treeC

        treeH = AncestralTree("H")
        treeI = AncestralTree("I")
        treeH.ancestor = treeD
        treeI.ancestor = treeD

        self.assertEqual(getYoungestCommonAncestor(topAncestor, treeE, treeI).name, "B")


if __name__ == '__main__':
    unittest.main()
