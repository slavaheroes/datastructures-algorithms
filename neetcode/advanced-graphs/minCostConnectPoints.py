class Solution:
    def minCostConnectPoints(self, points: List[List[int]]) -> int:
        # Prim's algorithm
        # Time: O(N^2 + N^2 log N) = O(N^2 log N)
        # Space: O(N^2)
        
        N = len(points)
        adj_list = defaultdict(list)

        for i in range(N):
            for j in range(i+1, N):
                dist = abs(points[i][0]-points[j][0]) + abs(points[i][1]-points[j][1])
                adj_list[i].append((dist, j))
                adj_list[j].append((dist, i))
        
        heap = [(0, 0)]
        visited = set()
        cost = 0

        while len(visited)<N:
            c, u = heapq.heappop(heap)
            if u in visited:
                continue
            cost += c
            visited.add(u)

            for elem in adj_list[u]:
                if elem[1] not in visited:
                    heapq.heappush(heap, elem)
        
        return cost

# Reference solution
# Optimized Prim's algorithm
# Time: O(N^2)
# Space: O(N)

class Solution:
    def minCostConnectPoints(self, points: List[List[int]]) -> int:
        n, node = len(points), 0
        dist = [100000000] * n
        visit = [False] * n
        edges, res = 0, 0

        while edges < n - 1:
            visit[node] = True
            nextNode = -1
            for i in range(n):
                if visit[i]:
                    continue
                curDist = (abs(points[i][0] - points[node][0]) +
                           abs(points[i][1] - points[node][1]))
                dist[i] = min(dist[i], curDist)
                if nextNode == -1 or dist[i] < dist[nextNode]:
                    nextNode = i

            res += dist[nextNode]
            node = nextNode
            edges += 1

        return res