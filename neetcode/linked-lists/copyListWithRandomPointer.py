"""
# Definition for a Node.
class Node:
    def __init__(self, x: int, next: 'Node' = None, random: 'Node' = None):
        self.val = int(x)
        self.next = next
        self.random = random
"""

class Solution:
    def copyRandomList(self, head: 'Optional[Node]') -> 'Optional[Node]':
        # O(n) time and space
        # but two passes
        
        hm = {}

        l1 = head

        new_head = None
        prev = None

        while l1:
            new_node = Node(l1.val, None, None)
            if new_head is None:
                new_head = new_node

            hm[l1] = new_node
            l1 = l1.next

            if prev:
                prev.next = new_node
                
            prev = new_node
        
        l1 = head
        l2 = new_head
        while l1:
            if l1.random:
                l2.random = hm[l1.random]
                
            l2 = l2.next
            l1 = l1.next

        
        return new_head
        

# Reference Solution
"""
# Definition for a Node.
class Node:
    def __init__(self, x: int, next: 'Node' = None, random: 'Node' = None):
        self.val = int(x)
        self.next = next
        self.random = random
"""

class Solution:
    def copyRandomList(self, head: 'Optional[Node]') -> 'Optional[Node]':
        # O(n) time, O(1) space
        if head is None:
            return None

        l1 = head
        while l1:
            l2 = Node(l1.val)
            l2.next = l1.random
            l1.random = l2
            l1 = l1.next

        newHead = head.random

        l1 = head
        while l1:
            l2 = l1.random
            l2.random = l2.next.random if l2.next else None
            l1 = l1.next

        l1 = head
        while l1 is not None:
            l2 = l1.random
            l1.random = l2.next
            l2.next = l1.next.random if l1.next else None
            l1 = l1.next

        return newHead