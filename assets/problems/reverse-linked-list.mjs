export default {
  pattern: 'Reverse links in place',
  problem: 'Reverse a singly linked list and return its new head.',
  example: 'head = [1,2,3,4,5]\nOutput: [5,4,3,2,1]',
  insight: 'Keep prev at the head of the reversed prefix and curr at the first unprocessed node. Save curr.next before redirecting it to prev. The stored nodes are reused; only links change.',
  steps: ['Start prev = None and curr = head.', 'Save nxt = curr.next, then set curr.next = prev.', 'Move prev to curr and curr to nxt. After processing 1 and 2, the reversed prefix is 2 → 1 → None.', 'When curr reaches None, return prev. An empty list returns None.'],
  complexity: 'O(n) time and O(1) auxiliary space. No new list nodes are allocated.',
  pitfall: 'Save the next node before overwriting its link, or the rest of the list becomes unreachable. Returning the original head would return the new tail.'
};
