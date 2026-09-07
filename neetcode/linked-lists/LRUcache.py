
class ListNode:
    def __init__(self, key, value, prev=None, nnext=None):
        self.key = key
        self.value = value
        self.prev = prev
        self.nnext = nnext 

class LRUCache:

    def __init__(self, capacity: int):
        # O(N) space, O(1) time for get and put
        self.capacity = capacity

        self.head = ListNode(-1, -1)
        self.tail = ListNode(-1, -1)
        self.head.nnext = self.tail
        self.tail.prev = self.head

        self.nodes = {} # {key: Node} dictionary

        
    def get(self, key: int) -> int:
        # O(1) time
        if key in self.nodes:
            node = self.nodes[key]
            
            node.prev.nnext = node.nnext
            node.nnext.prev = node.prev

            node.nnext = self.head.nnext
            self.head.nnext.prev = node
            self.head.nnext = node
            node.prev = self.head
            
            return node.value
        
        return -1
    

    def remove(self, node):
        prev, nnext = node.prev, node.nnext
        prev.nnext = nnext
        nnext.prev = prev
        del self.nodes[node.key]
    
        

    def put(self, key: int, value: int) -> None:
        # O(1) time
        if key in self.nodes:
            self.remove(self.nodes[key])

        node = ListNode(key, value)
        nnext = self.head.nnext

        node.prev = self.head
        node.nnext = nnext
        self.head.nnext = node
        nnext.prev = node

        self.nodes[key] = node

        if len(self.nodes) > self.capacity:
            # remove from tail
            self.remove(self.tail.prev)
