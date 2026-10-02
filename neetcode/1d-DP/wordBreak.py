# My solution 

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

    def search(self, word: str, i: int, j: int) -> bool:
        # O(len(word)) time, O(1) space
        curr = self.root
        for k in range(i, j):
            ch = word[k]
            if not ch in curr.letters:
                return False
            curr = curr.letters[ch]
        
        return curr.is_end


class Solution:
    def wordBreak(self, s: str, wordDict: List[str]) -> bool:
        # s = len(s), n = len(wordDict), L = longest string
        # Total Time: s*n*L
        # Total Space: s + nL


        # N*L time
        # N*L space
        pt = PrefixTree()
        for w in wordDict:
            pt.insert(w)
        
        # s space
        dp = [False] * (len(s)+1)
        dp[-1] = True

        # s * n * L
        for i in range(len(s)-1, -1, -1):
            state = False
            for w in wordDict:
                if i+len(w) > len(s):
                    continue

                if pt.search(s, i, i+len(w)):
                    state = state or dp[i+len(w)]

            dp[i] = state

        return dp[0]
                

# Reference solution
class Solution:
    def wordBreak(self, s: str, wordDict: List[str]) -> bool:
        # s = len(s), n = len(wordDict), L = longest string
        # Total Time: s*n*L
        # Total Space: s 

        dp = [False] * (len(s)+1)
        dp[-1] = True

        for i in range(len(s)-1, -1, -1):

            state = False
            for w in wordDict:
                j = i+len(w)
                if j > len(s):
                    continue
                
                if w==s[i:j]:
                    state = state or dp[j]
            
            dp[i] = state
        
        return dp[0]

        
# Optimal Reference Solution
# Time: O((n∗t^2)+m)
# Space: O(n + (m*t))
class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_word = False

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word):
        node = self.root
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        node.is_word = True

    def search(self, s, i, j):
        node = self.root
        for idx in range(i, j + 1):
            if s[idx] not in node.children:
                return False
            node = node.children[s[idx]]
        return node.is_word

class Solution:
    def wordBreak(self, s: str, wordDict: List[str]) -> bool:
        trie = Trie()
        for word in wordDict:
            trie.insert(word)

        dp = [False] * (len(s) + 1)
        dp[len(s)] = True

        t = 0
        for w in wordDict:
            t = max(t, len(w))

        for i in range(len(s), -1, -1):
            for j in range(i, min(len(s), i + t)):
                if trie.search(s, i, j):
                    dp[i] = dp[j + 1]
                    if dp[i]:
                        break

        return dp[0]  
        
        