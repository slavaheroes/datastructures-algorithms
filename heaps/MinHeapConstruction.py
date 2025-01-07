# Do not edit the class below except for the buildHeap,
# siftDown, siftUp, peek, remove, and insert methods.
# Feel free to add new properties and methods to the class.
class MinHeap:
    def __init__(self, array):
        # Do not edit the line below.
        self.heap = array
        self.buildHeap()
        
    def buildHeap(self):
        # Write your code here.
        # O(n) | O(1)
        i = int(len(self.heap)/2) - 1

        for idx in range(i, -1, -1):
            self.siftDown(idx, len(self.heap)-1)

    def _get_left_child(self, i):
        return 2*i + 1

    def _get_right_child(self, i):
        return 2*i + 2

    def _get_parent(self, i):
        return int((i-1)/2)

    def _swap(self, i, j):
        self.heap[i], self.heap[j] = self.heap[j], self.heap[i]
    
    def siftDown(self, startIdx, endIdx):
        # Write your code here.
        left = self._get_left_child(startIdx)

        while left <= endIdx:
            right = self._get_right_child(startIdx)
            right = right if right <= endIdx else -1

            if right != -1 and self.heap[right] < self.heap[left]:
                idx = right
            else:
                idx = left

            if self.heap[idx] < self.heap[startIdx]:
                self._swap(idx, startIdx)
                startIdx = idx
                left = self._get_left_child(startIdx)
            else:
                break
            
        

    def siftUp(self, startIdx):
        # Write your code here.
        parent = self._get_parent(startIdx)

        while startIdx > 0 and self.heap[parent] > self.heap[startIdx]:
            self._swap(startIdx, parent)
            startIdx = parent
            parent = self._get_parent(startIdx)
        

    def peek(self):
        # Write your code here.
        return self.heap[0]

    def remove(self):
        # Write your code here.
        # O(logn)
        self._swap(0, len(self.heap)-1)
        minVal = self.heap.pop()
        self.siftDown(0, len(self.heap)-1)
        return minVal

        
    def insert(self, value):
        # Write your code here.
        # O(logn)
        self.heap.append(value)
        self.siftUp(len(self.heap)-1)
