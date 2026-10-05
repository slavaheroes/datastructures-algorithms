export default {
  pattern: 'Merge with two pointers',
  problem: 'Merge two sorted singly linked lists into one sorted list by reusing their nodes.',
  example: 'list1 = [1,2,4], list2 = [1,3,4]\nOutput: [1,1,2,3,4,4]',
  insight: 'The smaller current head must be the next output node. This source keeps both original heads, connects each chosen node to prev, and returns whichever original head had the smaller value. Ties choose list2.',
  steps: ['Return the other list immediately if either input is empty.', 'Compare current values; choose list1 only when its value is strictly smaller, otherwise choose list2. Advance the chosen input.', 'If prev exists, connect prev.next to the chosen node, then move prev to that node.', 'When either list ends, attach the remaining suffix. Choose the output head using the same strict comparison as the loop.'],
  complexity: 'O(n + m) time and O(1) auxiliary space for input lengths n and m.',
  pitfall: 'The implementation changes the input links. Its tie rule also matters when selecting the returned head; there is no dummy head in this source.'
};
