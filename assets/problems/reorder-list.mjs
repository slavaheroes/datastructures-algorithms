export default {
  pattern: 'Split, reverse, weave',
  problem: 'Reorder L0 → L1 → … → Ln into L0 → Ln → L1 → Ln−1 → … in place, without changing node values.',
  example: 'head = [1,2,3,4,5]\nAfter reordering: [1,5,2,4,3]',
  insight: 'Split the list around its midpoint, reverse the second half, then alternate nodes from the two halves. The first half is at least as long as the second, so merging can stop when the second half ends.',
  steps: ['Move slow one link and fast two links, starting fast at head.next. Stop with slow at the end of the first half.', 'Save slow.next as second, then set slow.next = None to separate the halves.', 'Reverse the second half using prev, second, and a saved next pointer.', 'Save both next pointers before connecting first → second → next_first. Repeat until second is None. The function modifies head and returns no list.'],
  complexity: 'O(n) time over three linear passes and O(1) auxiliary space.',
  pitfall: 'Disconnect the halves before weaving to avoid a cycle. Preserve both next pointers before changing either link. Empty and one-node lists need no work.'
};
