# This is an input class. Do not edit.
class LinkedList:
    def __init__(self, value):
        self.value = value
        self.next = None


def removeKthNodeFromEnd(head, k):
    # Write your code here.
    total_len = 0
    curr = head

    while curr is not None:
        total_len += 1
        curr = curr.next

    
    if total_len-k == 0:
        # remove head
        # then just alter its value
        head.value = head.next.value
        k -= 1

    curr = head
    
    for _ in range(total_len-k-1):
        curr = curr.next

    curr.next = curr.next.next
    
    return head
