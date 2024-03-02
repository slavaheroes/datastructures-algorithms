# This is an input class. Do not edit.
class Node:
    def __init__(self, value):
        self.value = value
        self.prev = None
        self.next = None

# Feel free to add new properties and methods to the class.
class DoublyLinkedList:
    def __init__(self):
        self.head = None
        self.tail = None

    def setHead(self, node):
        # Write your code here.
        if self.head:
            self.insertBefore(self.head, node)
        else:
            self.head = node
            self.tail = node

    def setTail(self, node):
        # Write your code here.
        if self.tail:
            self.insertAfter(self.tail, node)
        else:
            self.head = node
            self.tail = node

    def insertBefore(self, node, nodeToInsert):
        # Write your code here.
        if nodeToInsert is not self.head or nodeToInsert is not self.tail:
            self.remove(nodeToInsert)
            nodeToInsert.prev = node.prev
            nodeToInsert.next = node
        
            if node.prev is None:
                self.head = nodeToInsert
            else:
                node.prev.next = nodeToInsert
            node.prev = nodeToInsert
            
    def insertAfter(self, node, nodeToInsert):
        # Write your code here.
        if nodeToInsert is not self.head or nodeToInsert is not self.tail:
            self.remove(nodeToInsert)
            nodeToInsert.prev = node
            nodeToInsert.next = node.next
            if node.next is None:
                self.tail = nodeToInsert
            else:
                node.next.prev = nodeToInsert
            node.next = nodeToInsert

    def insertAtPosition(self, position, nodeToInsert):
        # Write your code here.
        if position==1:
            self.setHead(nodeToInsert)
            return
        idx = 0
        curr = self.head

        while curr is not None:
            if (idx+1) == position:
                self.insertBefore(curr, nodeToInsert)
                return
            idx += 1
            curr = curr.next
            
        # ended
        self.setTail(nodeToInsert)

    def removeNodesWithValue(self, value):
        # Write your code here.
        curr = self.head
        while curr is not None:
            if curr.value == value:
                toRemove = curr
                curr = curr.next
                self.remove(toRemove)
            else:
                curr = curr.next

    def remove(self, node):
        if node == self.head:
            self.head = self.head.next
        if node == self.tail:
            self.tail = self.tail.prev
        self.removeNodeBindings(node)

    def removeNodeBindings(self, node):
        if node.prev is not None:
            node.prev.next = node.next
        if node.next is not None:
            node.next.prev = node.prev
        node.prev = None
        node.next = None
        
    def containsNodeWithValue(self, value):
        # Write your code here.
        curr = self.head
        while curr is not None:
            if curr.value == value:
                return True
            curr = curr.next

        return False
