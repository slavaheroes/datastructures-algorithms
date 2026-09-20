class Solution:
    def findRedundantConnection(self, edges: List[List[int]]) -> List[int]:
        # Kahn's algorithms 
        # O(V+E)

        q = deque()
        graph = defaultdict(set)
        for a, b in edges:
            graph[a].add(b)
            graph[b].add(a)
        
        for k, v in graph.items():
            if len(v)==1:
                q.append(k)

        while q:
            v = q.popleft()
            
            for n in graph[v]:
                graph[n].discard(v)
                if len(graph[n])==1:
                    q.append(n)
            
            del graph[v]
        
        for u, v in reversed(edges):
            if u in graph and v in graph:
                return [u, v]
            
# Reference Solution
class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n+1))
        self.rank = [1] * (n+1)
    
    def find(self, v):
        curr = self.parent[v]
        while curr!=self.parent[curr]:
            # path compression
            self.parent[curr] = self.parent[self.parent[curr]]
            curr = self.parent[curr]
        return curr
    
    def union(self, u, v):
        u = self.find(u)
        v = self.find(v)
        
        if u==v:
            return False

        if self.rank[v]>self.rank[u]:
            u, v = v, u
        
        # u >= v always 
        self.parent[v] = u
        self.rank[u] += self.rank[v]

        return True


class Solution:
    def findRedundantConnection(self, edges: List[List[int]]) -> List[int]:
        # Union Find
        # O(V) space
        # O(V + E (alpha*V))

        uf = UnionFind(len(edges))

        for u, v in edges:
            if not uf.union(u, v):
                return [u, v]
