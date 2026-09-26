class Solution:
    def findItinerary(self, tickets: List[List[str]]) -> List[str]:
        # Time: ElogE
        # Space: E + V
        # Hierholzer's algorithm
        
        tickets.sort(reverse=True) 
        adj_matrix = defaultdict(list)
        for from_i, to_i in tickets: 
            adj_matrix[from_i].append(to_i)
        

        stack = ["JFK"]
        res = []

        while stack:
            curr = stack[-1]
            if not adj_matrix[curr]:
                res.append(stack.pop())
            else:
                stack.append(adj_matrix[curr].pop())
        
        return res[::-1]

# My initial brute force solution: 

class Solution:
    def findItinerary(self, tickets: List[List[str]]) -> List[str]:
        # Time: E*V
        # Space: E*V
        
        tickets.sort() 
        adj_matrix = defaultdict(list)
        for from_i, to_i in tickets: 
            adj_matrix[from_i].append([to_i, False])
        
        res = ["JFK"]

        def dfs(node):

            if len(res)==(len(tickets)+1):
                return True
            
            for idx in range(len(adj_matrix[node])):
                if adj_matrix[node][idx][1]:
                    continue

                res.append(adj_matrix[node][idx][0])
                adj_matrix[node][idx][1] = True

                if dfs(adj_matrix[node][idx][0]):
                    return True
                
                adj_matrix[node][idx][1] = False
                res.pop()
                    
        dfs("JFK")

        return res
        
        