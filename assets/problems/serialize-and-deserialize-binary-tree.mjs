export default {
  pattern: 'Preorder tokens with explicit null markers',
  problem: 'Encode a binary tree as a string, then decode that string to reconstruct the same values and shape.',
  example: 'root = [1,2,3,null,null,4,5]\nSerialized: "1,2,N,N,3,4,N,N,5,N,N"\nDecoded tree: [1,2,3,null,null,4,5]',
  insight: 'Preorder values alone lose shape information, so serialize writes N for every missing child. During decoding, one shared token index consumes a root followed by its complete left and right subtrees.',
  steps: ['Serialize: append the current value, then serialize its left and right children; append N for None.', 'Join the token list with commas. An empty tree becomes "N".', 'Deserialize: split the string into tokens and initialize i = 0.', 'Consume one token. Return None for N; otherwise create a node, recursively build its left and right children, and return it.'],
  complexity: 'For n nodes with bounded-size integer values, O(n) time for each operation. O(n) auxiliary token storage plus O(h) recursive stack space. Serialization produces O(n) text and deserialization creates O(n) output nodes; the stored lists make total auxiliary space O(n), beyond the stack alone.',
  pitfall: 'The N markers are essential: trees with different missing-child positions can share the same preorder values. Decode expects a complete valid string in this Codec’s own format, which differs from compact level-order arrays.',
  treeVisualizer: true
};
