# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next

class Solution:
    def hasCycle(self, head: Optional[ListNode]) -> bool:
        # O(n) time, O(1) space
        if not head: return False
        
        curr = head
        curr2x = head.next

        while curr and curr2x and (curr != curr2x):
            # print(curr.val, curr2x.val)
            curr = curr.next
            if curr2x.next:
                curr2x = curr2x.next.next
            else:
                curr2x = curr2x.next
        
        
        return False if curr2x is None else True