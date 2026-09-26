class Solution:
    def foreignDictionary(self, words: List[str]) -> str:
        # V = number of unique characters 
        # M = number of all characters
        # Time: O(M+V+E)
        # Space: O(V+E) -> V<=26, E<=26^2 -> O(1)
        # Kahn's algorithm
        
        adj_list = {}
        indegree = {}

        for w in words:
            for ch in w:
                adj_list[ch] = set()
                indegree[ch] = 0

        for i in range(1, len(words)):
            prev, curr = words[i-1], words[i]

            minLen = min(len(prev), len(curr))
            if len(prev) > len(curr) and prev[:minLen]==curr[:minLen]:
                return ""

            for j in range(minLen):
                if prev[j] != curr[j]:
                    if not curr[j] in adj_list[prev[j]]:
                        adj_list[prev[j]].add(curr[j])
                        indegree[curr[j]] += 1
                    break
        
        q = deque()

        for k, v in adj_list.items():
            if indegree[k]==0:
                q.append(k)

        res = []
        while q:
            ch = q.popleft()
            res.append(ch)
            for v in adj_list[ch]:
                indegree[v] -= 1
                if indegree[v]==0:
                    q.append(v)


        return "".join(res) if len(res) == len(indegree) else ""
        