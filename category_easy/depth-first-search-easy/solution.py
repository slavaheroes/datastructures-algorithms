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
        array.append(self.name)
        stack = [*self.children]

        while len(stack)!=0:
            x = stack.pop(0)
            array.append(x.name)

            for ch in x.children[::-1]:
                stack.insert(0, ch)

        return array