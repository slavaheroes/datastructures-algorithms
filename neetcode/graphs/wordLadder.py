class Solution:
    def ladderLength(self, beginWord: str, endWord: str, wordList: List[str]) -> int:
        # N = len(wordList), M=len(beginWord)
        # Time: O(N^2 * M)
        # Space: O(N*M)

        def compare(s1, s2):
            count = 0
            for i in range(len(s1)):
                if s1[i] != s2[i]:
                    count += 1
            return count

        q = deque([(beginWord, 1)])
        visited = set()

        while q:
            word, dist = q.popleft()
            
            if word==endWord:
                return dist

            for i, w in enumerate(wordList):
                if i in visited:
                    continue

                if compare(word, w)==1:
                    visited.add(i)
                    q.append((w, dist+1))
        
        return 0

# Reference Solution
class Solution:
    def ladderLength(self, beginWord: str, endWord: str, wordList: List[str]) -> int:
        
        if endWord not in wordList:
            return 0 

        # N = len(wordList), M=len(beginWord)
        # Time: O(M^2 * N)
        # Space: O(N*M)

        q = deque([(beginWord, 1)])
        words = set(wordList) # O(N*M) time, and space

        while q:
            node, dist = q.popleft()

            if node==endWord:
                return dist
            
            for i in range(len(node)):
                for c in range(97, 123):
                    if chr(c) != node[i]:
                        new = node[:i] + chr(c) + node[i+1:]
                        if new in words:
                            q.append((new, dist+1))
                            words.remove(new)
        
        return 0
        