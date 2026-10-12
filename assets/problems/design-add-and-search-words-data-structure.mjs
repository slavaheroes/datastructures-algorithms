export default {
  pattern: 'Trie search with wildcard branching',
  problem: 'Design a WordDictionary with addWord(word) and search(pattern). A dot in the pattern matches exactly one letter; search returns whether any added word matches the entire pattern.',
  example: 'addWord("bad"), addWord("dad"), addWord("mad")\nsearch("pad") -> False\nsearch("bad") -> True\nsearch(".ad") -> True\nsearch("b..") -> True',
  insight: 'addWord builds the same shared-prefix trie as PrefixTree. Literal letters follow one dictionary edge. At a dot, the nested dfs function tries every existing child with the next pattern index and returns immediately when one branch succeeds.',
  steps: [
    'addWord walks the letters from root, creating missing TrieNodes, then sets is_end at the final node.',
    'search starts dfs(0, root). Its loop consumes ordinary letters without an additional recursive call; a missing literal returns False.',
    'At a dot, recursively try dfs(i + 1, child) for each child of the current node. A True result ends the search; if all children fail, return False.',
    'After consuming the complete pattern, return curr.is_end. For b.., the first dot branches from b, and the second branches from ba; the final d node is a complete word.'
  ],
  complexity: 'addWord takes O(L) time and creates at most O(L) new nodes. A search with no dots takes O(L) time and O(1) auxiliary space. With d dots and lowercase English letters, O(26^d · L) is a loose worst-case time bound; only existing trie branches are explored, and successful branches stop the search early. The recursive stack uses O(d + 1) space because recursion occurs only at dots. Total dictionary storage is O(S) for S inserted characters.',
  pitfall: 'A dot consumes one character, so it cannot match an empty string or an arbitrary-length suffix. Even after a matching path is found, is_end must be True. The source loops through existing letters rather than creating all 26 choices. Its O(d) stack comment should be read as O(d + 1), including the initial search call.'
};
