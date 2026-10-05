export default {
  pattern: 'Digit addition with carry',
  problem: 'Add two nonnegative integers represented by nonempty linked lists of digits in reverse order. Return the sum in the same format.',
  example: 'l1 = [2,4,3], l2 = [5,6,4]\n342 + 465 = 807\nOutput: [7,0,8]',
  insight: 'Add the two current digits and the incoming carry. The next digit is total % 10 and the next carry is total // 10. This source writes into a current output node, allocates an extra node after every digit, then removes that trailing spare node in a second traversal.',
  steps: ['Create head and curr, with carry = 0. Continue while either input or carry remains.', 'Use zero for a missing input digit. Add both digits and carry, write the remainder into curr.val, and update carry.', 'Allocate curr.next and advance curr; advance either input that still exists.', 'After addition, walk the output to find the spare tail and detach it using prev.next = None. Return head.'],
  complexity: 'O(n + m) time including the cleanup traversal. O(max(n, m)) output space and O(1) auxiliary space, excluding the result.',
  pitfall: 'Include carry in the loop condition so [9] + [1] produces [0,1]. The source assumes the problem’s nonempty input lists; its final traversal removes the intentionally allocated extra node.'
};
