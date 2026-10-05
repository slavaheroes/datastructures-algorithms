export default {
  pattern: 'Fixed gap and dummy head',
  problem: 'Remove the nth node from the end of a singly linked list and return the new head. The input guarantees 1 ≤ n ≤ list length.',
  example: 'head = [1,2,3,4,5], n = 2\nOutput: [1,2,3,5]',
  insight: 'Start left at a dummy node before head and right at head. Advance right n times, then move both pointers together. When right reaches None, left is immediately before the node to remove.',
  steps: ['Create dummy = ListNode(0, head), with left = dummy and right = head.', 'Advance right n links. For n = 2 in the example, right now points to 3.', 'Move both pointers until right is None. Left then points to 3.', 'Set left.next = left.next.next and return dummy.next. The dummy also handles removing the original head.'],
  complexity: 'O(length) time and O(1) auxiliary space, including one dummy node.',
  pitfall: 'Left must stop before the target. Keeping left at the dummy initially makes n = list length work without a separate head-removal branch.'
};
