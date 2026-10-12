export default {
  pattern: 'A tree of shared prefixes',
  problem: 'Implement a trie with insert(word), search(word), and startsWith(prefix). search checks for a complete inserted word; startsWith checks only whether the prefix exists.',
  example: 'insert("apple")\nsearch("apple") -> True\nsearch("app") -> False\nstartsWith("app") -> True\ninsert("app")\nsearch("app") -> True',
  insight: 'Each TrieNode stores a letters dictionary and an is_end flag. A dictionary edge consumes one character, so words with the same prefix share the same nodes. The flag distinguishes a complete word from a prefix of a longer word.',
  steps: [
    'Start insert at root. For each character, create a child only if that letter is missing, then move to that child.',
    'After the last character, set curr.is_end = True. Inserting apple creates the path a → p → p → l → e and marks only e as a word ending.',
    'search follows the same path. A missing letter returns False; reaching the final node returns its is_end flag.',
    'startsWith also follows the letters, but returns True as soon as the entire prefix has been consumed. Inserting app later marks its existing final p node without rebuilding apple.'
  ],
  complexity: 'For a word or prefix of length L, each operation takes O(L) time under average constant-time dictionary access. insert creates at most O(L) new nodes; search and startsWith use O(1) auxiliary space. Across all inserted words, trie storage is O(S), where S is their total character count.',
  pitfall: 'The saved Python implementation names its main class PrefixTree. An existing path does not imply a complete word: search must check is_end. Duplicate insertions reuse nodes and leave the same flag set. The empty prefix reaches root immediately, so startsWith("") returns True; inserting an empty word would mark root itself.'
};
