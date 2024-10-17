'''
You're given a Node class that has a name and an array of optional children nodes. When put together, nodes form an acyclic tree-like structure.

Implement the depthFirstSearch method on the Node class, which takes in an empty array,
traverses the tree using the Depth-first Search approach (specifically navigating the tree from left to right),
stores all of the nodes' names in the input array, and returns it.

Sample Input:
graph = A
       / | \
      B  C  D
     / \   / \
    E   F G   H
       / \ \
      I   J K
Sample Output:
["A", "B", "E", "F", "I", "J", "C", "D", "G", "K", "H"]
'''


# Do not edit the class below except
# for the depthFirstSearch method.
# Feel free to add new properties
# and methods to the class.
class Node:
    def __init__(self, name):
        self.children = []
        self.name = name

    def addChild(self, name):
        self.children.append(Node(name))
        return self

    def depthFirstSearch(self, array):
        # Write your code here.
        # O(v+e) time | O(v) space
        array.append(self.name)
        stack = [*self.children]

        while len(stack) != 0:
            x = stack.pop(0)
            array.append(x.name)

            for ch in x.children[::-1]:
                stack.insert(0, ch)

        return array


import unittest


class TestProgram(unittest.TestCase):
    def test_case_1(self):
        graph = Node("A")
        graph.addChild("B").addChild("C").addChild("D")
        graph.children[0].addChild("E").addChild("F")
        graph.children[2].addChild("G").addChild("H")
        graph.children[0].children[1].addChild("I").addChild("J")
        graph.children[2].children[0].addChild("K")
        self.assertEqual(graph.depthFirstSearch([]), ["A", "B", "E", "F", "I", "J", "C", "D", "G", "K", "H"])


if __name__ == '__main__':
    unittest.main()
