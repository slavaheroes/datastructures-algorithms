class Solution:
    def networkDelayTime(self, times: List[List[int]], n: int, k: int) -> int:
        # Dijkstra's algorithm
        
        # Space: O(V + E)
        # Time: O(E log V)
        
        # build adjacency 
        adj_matrix = defaultdict(list)
        for u,v,t in times:
            adj_matrix[u].append( (t, v) )
        
        visited = set()
        heap = [(0, k)]

        total_time = 0

        while heap:
            t,u = heapq.heappop(heap)
            if u in visited:
                continue
            visited.add(u)
            total_time = max(total_time, t)
            for tt, v in adj_matrix[u]:
                heapq.heappush(heap, (t+tt, v))

        return total_time if len(visited)==n else -1