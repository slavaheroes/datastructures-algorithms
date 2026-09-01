'''
You're given a Node class that has a name and an array of optional children nodes. When put together, nodes form an acyclic tree-like structure.

Implement the breadthFirstSearch method on the Node class, which takes in an empty array,
traverses the tree using the Breadth-first Search approach (specifically navigating the tree from left to right),
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
["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K"]
'''


# Do not edit the class below except
# for the breadthFirstSearch method.
# Feel free to add new properties
# and methods to the class.
class Node:
    def __init__(self, name):
        self.children = []
        self.name = name

    def addChild(self, name):
        self.children.append(Node(name))
        return self

    def breadthFirstSearch(self, array):
        # Write your code here.
        # O(v+e) time | O(v) space
        q = [*self.children]
        array.append(self.name)

        while len(q) != 0:
            x = q.pop(0)
            array.append(x.name)
            q.extend(x.children)

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
        self.assertEqual(graph.breadthFirstSearch([]), ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K"])


if __name__ == '__main__':
    unittest.main()
