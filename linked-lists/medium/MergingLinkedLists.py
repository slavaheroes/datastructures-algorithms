# This is an input class. Do not edit.
class LinkedList:
    def __init__(self, value):
        self.value = value
        self.next = None


def mergingLinkedLists(linkedListOne, linkedListTwo):
    # Write your code here.
    # O(n+m) | O(1)
    len1 = 0
    curr1 = linkedListOne

    while curr1:
        len1 += 1
        curr1 = curr1.next

    len2 = 0
    curr2 = linkedListTwo

    while curr2:
        len2 += 1
        curr2 = curr2.next

    if len1>len2:
        max_len = len1
        longList = linkedListOne
        shortList = linkedListTwo
    else:
        max_len = len2
        longList = linkedListTwo
        shortList = linkedListOne


    i = 0
    while i<(max_len - min(len1, len2)):
        longList = longList.next
        i += 1


    intersectionNode = None
    i = 0
    while shortList:
        if longList.value != shortList.value:
            intersectionNode = None
        else:
            if not intersectionNode:
                intersectionNode = shortList
        
        longList = longList.next
        shortList = shortList.next
        i += 1
        
    
    return intersectionNode
