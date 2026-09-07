# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next

class Solution:    
    def mergeKLists(self, lists: List[Optional[ListNode]]) -> Optional[ListNode]:
        # O(N * K) time, O(1) space
        # Throws Time exceeded error 
        k = len(lists)
        dummy = ListNode()
        prev = dummy

        while True:
            min_idx = -1
            min_value = float('inf')

            for i, l in enumerate(lists):
                if not (l is None):
                    if l.val < min_value:
                        min_value = l.val
                        min_idx = i
            
            if min_idx==-1: break
            
            prev.next = lists[min_idx] 
            lists[min_idx] = lists[min_idx].next
            prev = prev.next

        return dummy.next


# Efficient solution using Divide and Conquer
# O(N * log K) time, O(log K) space

# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next

class Solution:
    def mergeTwoLists(self, list1: Optional[ListNode], list2: Optional[ListNode]) -> Optional[ListNode]:
        if not list2: return list1
        if not list1: return list2 

        curr = None
        prev = None
        head1 = list1
        head2 = list2
        
        while list1 and list2:
            if list1.val < list2.val:
                curr = list1
                list1 = list1.next
            else:
                curr = list2
                list2 = list2.next

            if prev:
                prev.next = curr
            prev = curr
        
        prev.next = list1 or list2

        return head1 if head1.val < head2.val else head2

    def mergeKLists(self, lists: List[Optional[ListNode]]) -> Optional[ListNode]:
        if not lists or len(lists) == 0:
            return None

        while len(lists) > 1:
            mergedLists = []
            for i in range(0, len(lists), 2):
                l1 = lists[i]
                l2 = lists[i + 1] if (i + 1) < len(lists) else None
                mergedLists.append(self.mergeTwoLists(l1, l2))
            lists = mergedLists
        return lists[0]
 
# Efficient solution using Heap
# O(N * log K) time, O(K) space

# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next

class Solution:    
    def mergeKLists(self, lists: List[Optional[ListNode]]) -> Optional[ListNode]:
        heap = []
        heapq.heapify(heap)

        for i, l in enumerate(lists):
            if l is not None:
                heapq.heappush(heap, (l.val, i, l))
        
        dummy = ListNode()
        curr = dummy
        k = len(lists)

        while heap:
            _, _, node = heapq.heappop(heap)
            curr.next = node
            curr = curr.next

            if node.next:
                heapq.heappush(heap, (node.next.val, k, node.next))
                k += 1

        return dummy.next
        