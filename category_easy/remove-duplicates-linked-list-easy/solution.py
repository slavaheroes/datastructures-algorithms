# This is an input class. Do not edit.
class LinkedList:
    def __init__(self, value):
        self.value = value
        self.next = None

def removeDuplicatesFromLinkedList(linkedList):
    # Write your code here.
    prev = linkedList
    next = linkedList.next

    while next is not None:
        if prev.value == next.value:
            next = next.next
        else:
            prev.next = next
            prev = next
            next = next.next
            

    prev.next = None
    
    return linkedList