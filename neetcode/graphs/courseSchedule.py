class Solution:
    def canFinish(self, numCourses: int, prerequisites: List[List[int]]) -> bool:
        # O(V+E) time and space

        graph = defaultdict(set)
        for a, b in prerequisites:
            graph[b].add(a)
        
        visited = set()
        def dfs(course, path):
            if course in path:
                return False
            
            if course in visited:
                return True
            
            path.add(course)
            visited.add(course)
            for v in graph[course]:
                if not dfs(v, path):
                    return False

            path.discard(course)
            return True
        
        for i in range(numCourses):
            path = set()
            if not dfs(i, path):
                return False
        
        return True
        
# Reference Solution
# Kahn's Algorithm
class Solution:
    def canFinish(self, numCourses: int, prerequisites: List[List[int]]) -> bool:
        indegree = [0] * numCourses
        adj = [[] for i in range(numCourses)]
        for src, dst in prerequisites:
            indegree[dst] += 1
            adj[src].append(dst)

        q = deque()
        for n in range(numCourses):
            if indegree[n] == 0:
                q.append(n)

        finish = 0
        while q:
            node = q.popleft()
            finish += 1
            for nei in adj[node]:
                indegree[nei] -= 1
                if indegree[nei] == 0:
                    q.append(nei)

        return finish == numCourses
        