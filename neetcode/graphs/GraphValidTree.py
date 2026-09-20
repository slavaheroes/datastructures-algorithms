class Solution:
    def validTree(self, n: int, edges: List[List[int]]) -> bool:
        # O(V+E) time, and space
        
        graph = defaultdict(set)

        for a, b in edges:
            graph[a].add(b)
            graph[b].add(a)
        
        visited = set()

        def dfs(node, parent):

            if node in visited:
                return False
            
            visited.add(node)
            for v in graph[node]:
                if v!=parent:
                    if not dfs(v, node): return False
            
            return True
        
        return (dfs(0, -1)) and len(visited)==n

        