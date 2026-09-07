# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next

class Solution:
    def reverseKGroup(self, head: Optional[ListNode], k: int) -> Optional[ListNode]:
        # O(n) time | O(1) space
        
        length = 0
        curr = head
        while curr:
            length += 1
            curr = curr.next
        
        curr = head

        dummy = ListNode()
        new_head = dummy

        for _ in range(length//k):
            old_head = curr
            prev = None
            
            j = 0
            while j<k and curr:
                nxt = curr.next
                curr.next = prev
                prev = curr
                curr = nxt
                j+=1
            
            new_head.next = prev
            new_head = old_head


        if curr:
            new_head.next = curr
        
        return dummy.next

# Reference Solution
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next

class Solution:
    def reverseKGroup(self, head: Optional[ListNode], k: int) -> Optional[ListNode]:
        dummy = ListNode(0, head)
        groupPrev = dummy

        while True:
            kth = self.getKth(groupPrev, k)
            if not kth:
                break
            groupNext = kth.next

            prev, curr = kth.next, groupPrev.next
            while curr != groupNext:
                tmp = curr.next
                curr.next = prev
                prev = curr
                curr = tmp

            tmp = groupPrev.next
            groupPrev.next = kth
            groupPrev = tmp
        return dummy.next

    def getKth(self, curr, k):
        while curr and k > 0:
            curr = curr.next
            k -= 1
        return curr