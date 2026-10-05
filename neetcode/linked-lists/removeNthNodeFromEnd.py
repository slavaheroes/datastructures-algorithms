# ListNode is supplied by the coding platform; 1 <= n <= list length.
class Solution:
    def removeNthFromEnd(self, head: Optional[ListNode], n: int) -> Optional[ListNode]:
        dummy = ListNode(0, head)
        left, right = dummy, head
        for _ in range(n):
            right = right.next
        while right:
            left = left.next
            right = right.next
        left.next = left.next.next
        return dummy.next
