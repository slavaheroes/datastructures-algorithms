export default {
  pattern: 'Dictionary and doubly linked list',
  problem: 'Implement an LRU cache with get(key) and put(key, value). When capacity is exceeded, evict the least recently used key. Missing keys return -1.',
  example: 'capacity = 2\nput(1,1), put(2,2), get(1) → 1\nput(3,3) evicts key 2\nget(2) → -1',
  insight: 'A dictionary locates nodes by key, and a doubly linked list tracks recency. The node after head is most recent; the node before tail is least recent. Sentinel nodes make unlinking and inserting uniform.',
  steps: ['Create head and tail sentinels, connect them, and initialize the nodes dictionary.', 'For a successful get, unlink the existing node and insert it directly after head; return its value.', 'For put on an existing key, call remove to unlink and delete the old node. Create and insert a replacement after head and record it in nodes.', 'If the dictionary exceeds capacity, remove tail.prev from both the list and dictionary.'],
  complexity: 'Expected O(1) time per get and put using dictionary lookup; O(capacity) storage.',
  pitfall: 'The source names the forward link nnext. A successful read updates recency too. Removing a node must update both neighboring links, and eviction must also delete its dictionary entry.'
};
