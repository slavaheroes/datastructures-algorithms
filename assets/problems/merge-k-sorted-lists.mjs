export default {
  pattern: 'Scan, pairwise merge, or min-heap',
  problem: 'Merge k sorted linked lists into one sorted linked list by reusing their nodes.',
  example: 'lists = [[1,4,5],[1,3,4],[2,6]]\nOutput: [1,1,2,3,4,4,5,6]',
  insight: 'The source contains three versions. Scanning every current head selects the next minimum but is marked as timing out. Pairwise merging halves the list count each round. The heap version keeps the current head from each nonempty list and repeatedly removes the smallest.',
  steps: ['Scan version: examine all k heads, attach the smallest, and advance that list. Stop when every head is None.', 'Pairwise version: merge neighbors into mergedLists. If a round has an odd final list, merge it with None. Repeat until only one list remains.', 'Heap version: push (value, unique counter, node) for each nonempty head. Pop one node, attach it, and push its next node if present.', 'Each heap insertion gets a unique counter, so equal values never require comparing ListNode objects. All versions return the merged head.'],
  complexity: 'Let N be the total nodes and k the number of lists. Scanning takes O(Nk + k) time and O(1) auxiliary space. Pairwise merging takes O(N log(k + 1) + k) time and O(k) auxiliary space for the round arrays, despite the source comment saying O(log k). The heap version takes O(N log(k + 1) + k) time and O(k) auxiliary space.',
  pitfall: 'These versions relink input nodes. Pairwise merging here is iterative and allocates arrays of list heads; it is not a recursive implementation. The heap solution expects the platform to supply heapq.'
};
