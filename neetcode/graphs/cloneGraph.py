"""
# Definition for a Node.
class Node:
    def __init__(self, val = 0, neighbors = None):
        self.val = val
        self.neighbors = neighbors if neighbors is not None else []
"""

class Solution:
    def cloneGraph(self, node: Optional['Node']) -> Optional['Node']:


        def clone(node, lookupTable):
            if not node:
                return None
                
            new_node = Node(
                node.val
            )

            lookupTable[node] = new_node
            neighbors = []
            for n in node.neighbors:
                if n in lookupTable:
                    neighbors.append(lookupTable[n])
                else:
                    neighbors.append(
                        clone(n, lookupTable)
                    )

            new_node.neighbors = neighbors
            return new_node 

        return clone(node, {})
