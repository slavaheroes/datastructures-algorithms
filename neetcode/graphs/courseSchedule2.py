class Solution:
    def findOrder(self, numCourses: int, prerequisites: List[List[int]]) -> List[int]:
        # O(V+E) time and space
        
        preqs = defaultdict(set)
        for a, b in prerequisites:
            preqs[a].add(b)
        
        graph = defaultdict(set)
        for a, b in prerequisites:
            graph[b].add(a)
        
        res = []
        q = deque()

        for i in range(numCourses):
            if len(preqs[i])==0:
                q.append(i)

        while q:
            course = q.popleft()
            res.append(course)

            for v in graph[course]:
                preqs[v].discard(course)
                if len(preqs[v])==0:
                    q.append(v)

        
        return res if len(res)==numCourses else []
        

        