class TrieNode:
    def __init__(self):
        self.is_end = False
        self.index = -1
        self.letters = {}

class PrefixTree:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word: str, idx: int) -> None:
        # O(len(word)) time and space
        curr = self.root

        for ch in word:
            if not ch in curr.letters:
                curr.letters[ch] = TrieNode()
            
            curr = curr.letters[ch]
        
        curr.is_end = True
        curr.index = idx
        

class Solution:
    def findWords(self, board: List[List[str]], words: List[str]) -> List[str]:
        # L = max word length
        # Total time: O(sum(len(w)) + M·N·4·3^(L−1))      
        # Total space: sum(len(w)) + L


        # O( sum(len(w)) ) time
        # O( sum(len(w)) ) space

        trie = PrefixTree()
        for i in range(len(words)):
            trie.insert(words[i], i)
        
        M, N = len(board), len(board[0])
        visited = set()
        results = []

        def dfs(trie_node, i, j, visited):
            
            if i<0 or j<0 or i>(M-1) or j>(N-1) or (i,j) in visited:
                return 

            if board[i][j] in trie_node.letters:
                node = trie_node.letters[board[i][j]]
                visited.add((i, j))

                if node.is_end:
                    # we reached the end of word
                    node.is_end = False
                    results.append(words[node.index])
                
                for dx, dy in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
                    x = i + dx
                    y = j + dy
                    dfs(node, x, y, visited)
                
                visited.discard((i, j))
                        
            return 
        
        for i in range(M):
            for j in range(N):
                dfs(trie.root, i, j, visited)

        return results
        
  