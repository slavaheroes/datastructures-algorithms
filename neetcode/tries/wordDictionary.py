class TrieNode:
    def __init__(self):
        self.is_end = False
        self.letters = {}

class WordDictionary:

    def __init__(self):
        self.root = TrieNode()

    def addWord(self, word: str) -> None:
        # O(len(word)) time and space
        curr = self.root

        for ch in word:
            if not ch in curr.letters:
                curr.letters[ch] = TrieNode()
            
            curr = curr.letters[ch]
        
        curr.is_end = True
        
    def search(self, word: str) -> bool:
        # O(26^d · L) where d is number of dots, L = len(word)
        # O(d) space due to recursion 

        def dfs(idx, curr_node):
            curr = curr_node
            for i in range(idx, len(word)):
                ch = word[i]
                if ch == ".":
                    for k in curr.letters.keys():
                        # check every letter
                        if dfs(i+1, curr.letters[k]):
                            return True 
                    
                    return False    
                    
                if not ch in curr.letters:
                    return False
                curr = curr.letters[ch]
            
            return curr.is_end

        return dfs(0, self.root)
        
