# This is an input class. Do not edit.
class LinkedList:
    def __init__(self, value):
        self.value = value
        self.next = None


def sumOfLinkedLists(linkedListOne, linkedListTwo):
    # Write your code here.
    # O(max(len(linkedListOne), len(linkedListTwo))) both time and space
    num_one = 0

    i = 0
    curr = linkedListOne
    while curr is not None:
        num_one += curr.value*(10**i)
        curr = curr.next
        i += 1
        
    num_two = 0

    j = 0
    curr = linkedListTwo
    while curr is not None:
        num_two += curr.value*(10**j)
        curr = curr.next
        j += 1

    sum_ = num_one + num_two
    
    k = max(i, j)
    outputList = None
    
    while k > -1:
        remain = sum_ // (10**k)
        if remain == 0 and k==max(i, j):
            k -= 1
            continue
        head = LinkedList(remain)
        head.next = outputList
        outputList = head
        sum_ -= remain * (10**k)
        k -= 1 
        
    return outputList