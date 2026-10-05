export default {
  pattern: 'Map identities or temporarily link copies',
  problem: 'Deep-copy a linked list whose nodes each have next and random pointers. Every copied link must point to a copied node or None.',
  example: 'Nodes shown as [value, random target index]:\n[[7,null],[13,0],[11,4],[10,2],[1,0]]\nOutput has the same values and link structure, using entirely new nodes.',
  insight: 'The first version maps each original node object to its copy, builds next links in one pass, then fills random links in a second pass. The reference version uses the originals’ random fields as temporary links to their copies, avoiding a dictionary.',
  steps: ['Dictionary version: create each copy, record hm[original] = copy, and connect copies in original next order.', 'Walk both lists again. For every non-null original random link, set copy.random = hm[original.random].', 'Reference pass 1: save the original random target in copy.next, then point original.random at the copy. Original next links stay intact.', 'Reference pass 2: set copy.random to the copy of its saved target via copy.next.random. Pass 3 restores original.random from copy.next and sets copy.next to the next original’s copy.'],
  complexity: 'Both versions take O(n) time and allocate O(n) output nodes. The first uses O(n) auxiliary map space; the three-pass reference uses O(1) auxiliary space, excluding output.',
  pitfall: 'Map node identities, not values: values may repeat. The reference temporarily mutates random pointers and restores them in its final pass; it does not use the more common next-link interleaving technique.'
};
