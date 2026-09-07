# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next

class Solution:
    def addTwoNumbers(self, l1: Optional[ListNode], l2: Optional[ListNode]) -> Optional[ListNode]:
        # O(n+m) time, space 
        # But only O(1) extra space

        head = ListNode()
        curr = head
        carry = 0

        while l1 or l2 or carry:
            val = l1.val if l1 else 0
            val += l2.val if l2 else 0

            val += carry

            carry = val // 10
            val = val % 10
            
            curr.val = val
            curr.next = ListNode()
            curr = curr.next

            l1 = l1.next if l1 else None
            l2 = l2.next if l2 else None

        
        curr = head
        prev = curr

        while curr.next:
            prev = curr
            curr = curr.next

        prev.next = None

        return head
