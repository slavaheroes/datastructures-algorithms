export default {
  pattern: 'Reverse complete groups in place',
  problem: 'Reverse nodes in consecutive groups of k. Leave the final group unchanged if it has fewer than k nodes. Change links, not node values; k is positive.',
  example: 'head = [1,2,3,4,5], k = 2\nOutput: [2,1,4,3,5]',
  insight: 'Both source versions reverse only complete groups. The first counts the whole list and processes length // k groups. The reference looks ahead k nodes from groupPrev before reversing each group.',
  steps: ['Count-first version: count nodes, then reverse k links for each complete group. Save old_head, since it becomes the group’s tail.', 'Connect the previous group’s tail to the reversed group head. After all complete groups, attach the untouched remainder.', 'Reference version: getKth finds the kth node after groupPrev. If none exists, stop. Save groupNext = kth.next.', 'Reverse until curr == groupNext, starting prev at groupNext. Connect groupPrev.next to kth, then move groupPrev to the old group head.'],
  complexity: 'Both versions take O(n) time and O(1) auxiliary space. Looking ahead across each group still gives linear total work.',
  pitfall: 'Preserve the boundary after each group before changing links. A partial final group must stay in its original order. With k = 1 the list is unchanged.'
};
