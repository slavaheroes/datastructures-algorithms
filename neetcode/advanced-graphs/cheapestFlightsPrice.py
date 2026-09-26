class Solution:
    def findCheapestPrice(self, n: int, flights: List[List[int]], src: int, dst: int, k: int) -> int:
        # Space: O(E*K + N*K) 
        # Time: O(EK log EK)
        # Dijkstra's algorithm with a priority queue
        
        adj_matrix = defaultdict(list)
        for u, v, p in flights:
            adj_matrix[u].append((p, v))

        heap = [(0, -1, src)]
        best_prices = defaultdict(dict)

        while heap:

            cost, stops, node = heapq.heappop(heap)

            if node==dst:
                return cost
            
            for p, v in adj_matrix[node]:
                new_stops = stops + 1
                new_cost = cost + p

                if new_stops <= k and new_cost <  best_prices[v].get(new_stops, float('inf')):
                    best_prices[v][new_stops] = new_cost
                    heapq.heappush(heap, (new_cost, new_stops, v)) 


        return -1


# Reference Solution
# Bellman-Ford algorithm
class Solution:
    def findCheapestPrice(self, n: int, flights: List[List[int]], src: int, dst: int, k: int) -> int:
        # Space: O(N + E)
        # Time: O(K*N)
        cost = [float('inf')] * n
        adj_matrix = defaultdict(list)
        for u, v, p in flights:
            adj_matrix[u].append((p, v))
        cost[src] = 0

        q = deque([(0, 0, src)])

        while q:
            c, kk, u = q.popleft()
            if kk > k:
                continue 
            
            for p, v in adj_matrix[u]:
                if cost[v] > (c+p):
                    cost[v] = c+p
                    q.append((c+p, kk+1, v))
        
        return -1 if cost[dst]==float('inf') else cost[dst]
        