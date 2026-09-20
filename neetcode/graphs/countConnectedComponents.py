class Solution:
    def countComponents(self, n: int, edges: List[List[int]]) -> int:
        # O(V+E)
        graph = defaultdict(set)

        for a, b in edges:
            graph[a].add(b)
            graph[b].add(a)
        
        visited = set()

        def dfs(node, parent):

            if node in visited:
                return 
            
            visited.add(node)
            for v in graph[node]:
                if v!=parent:
                    dfs(v, node)
                    
        res = 0

        for i in range(n):
            if i not in visited:
                res += 1
                dfs(i, -1)
            

        return res
        