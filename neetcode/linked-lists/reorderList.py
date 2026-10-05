# ListNode is supplied by the coding platform.
class Solution:
    def reorderList(self, head: Optional[ListNode]) -> None:
        if not head or not head.next:
            return

        slow, fast = head, head.next
        while fast and fast.next:
            slow = slow.next
            fast = fast.next.next

        second = slow.next
        slow.next = None
        prev = None
        while second:
            nxt = second.next
            second.next = prev
            prev = second
            second = nxt

        first, second = head, prev
        while second:
            next_first, next_second = first.next, second.next
            first.next = second
            second.next = next_first
            first, second = next_first, next_second
