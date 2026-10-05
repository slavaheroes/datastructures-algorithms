import {mountCycle} from '../visualizations/linked-list-cycle.mjs';
export default {
  pattern: 'Floyd’s slow and fast pointers',
  problem: 'Determine whether following next pointers in a linked list eventually revisits a node. A cycle is about node identity, not repeated values. The visualization also explains the extension that finds the cycle entry.',
  example: 'head = [3,2,0,-4], tail.next points to index 1\nOutput: true\nCycle: node 1 → node 2 → node 3 → node 1',
  insight: 'A slow pointer moves one edge per round and a fast pointer moves two. Inside a cycle, their relative position changes by one edge each round, so they must meet. Without a cycle the fast pointer reaches None. The saved Python source starts curr at head and curr2x at head.next and returns only a boolean. The standard proof of entry finding instead starts both pointers at head and checks for a meeting after moving.',
  steps: ['Source version: return False for an empty list. Set curr = head and curr2x = head.next.', 'While both pointers exist and differ, move curr one link. Move curr2x two links when its next exists, otherwise move it to None.', 'Return False if curr2x is None, otherwise True. Starting one node ahead is sufficient for detection.', 'Entry-finding extension: start both at head, move before checking equality, then reset one pointer to head after a meeting. Move both one edge per round; they meet at the cycle entry. Choose the standard mode to visualize this proof.'],
  proof: {
    title: 'Why resetting one pointer finds the cycle entry',
    paragraphs: [
      'Use the standard initialization: both pointers start at head. Let a be the number of edges from head to the entry, L the cycle length, and b the forward distance from the entry to the meeting node, with 0 ≤ b < L. Let t > 0 be the number of slow-pointer steps at the first detected meeting.',
      'At the meeting, slow has traveled t edges and fast has traveled 2t. They occupy the same cycle node, so their distance difference is a whole number of laps: 2t − t = mL. Also t = a + b + qL, where q counts complete laps made by slow after entering the cycle. Subtracting gives a + b = (m − q)L, hence a ≡ −b (mod L).',
      'Let c = (L − b) mod L be the shortest forward distance from the meeting node to the entry. Then a = c + rL for some integer r ≥ 0. The distance from head is therefore equal to a walk from the meeting node to the entry that may include extra full laps; it is not always equal to the shortest distance c.',
      'Reset one pointer to head and leave the other at the meeting node. After a one-edge moves, the head pointer reaches the entry, and the meeting pointer is at cycle offset (b + a) mod L = 0, also the entry. Before those a moves the head pointer is outside the cycle, so they cannot meet earlier. If a = 0, they are already equal immediately after the reset.',
      'Example: a = 5 and L = 3. The standard pointers first meet after t = 6 slow steps, at b = 1. The shortest return distance is c = 2, while a = 5 = 2 + 3. The second pointer makes an extra lap during the five steps that take the head pointer to the entry.',
      'This reset proof does not directly apply to the saved detection source’s one-node offset. There fast travels 1 + 2t edges, so the meeting relation is t + 1 = mL. Switch to the standard initialization before using the entry-finding phase shown here.'
    ]
  },
  complexity: 'Detection and the standard entry-finding extension each take O(n) time and O(1) auxiliary space, where n is the number of distinct reachable nodes. No links are modified.',
  pitfall: 'Compare node identities, not values. Check for a missing fast pointer or next link before taking two steps. At standard initialization the pointers being equal is not evidence of a cycle; move before the first detection comparison. In the entry-finding phase, check equality before moving.'
};
export const mountVisualization = root => mountCycle(root);
