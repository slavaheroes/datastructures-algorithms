class TrieNode:
    def __init__(self):
        self.is_end = False
        self.letters = {}

class PrefixTree:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word: str) -> None:
        # O(len(word)) time and space
        curr = self.root

        for ch in word:
            if not ch in curr.letters:
                curr.letters[ch] = TrieNode()
            
            curr = curr.letters[ch]
        
        curr.is_end = True


    def search(self, word: str) -> bool:
        # O(len(word)) time, O(1) space
        curr = self.root
        for ch in word:
            if not ch in curr.letters:
                return False
            curr = curr.letters[ch]
        
        return curr.is_end
        

    def startsWith(self, prefix: str) -> bool:
        # O(len(prefix)) time, O(1) space
        curr = self.root
        for ch in prefix:
            if not ch in curr.letters:
                return False
            curr = curr.letters[ch]
        return True

        
        