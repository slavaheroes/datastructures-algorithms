# Do not edit the class below except for
# the constructor and the createSet, find,
# and union methods. Feel free to add new
# properties and methods to the class.
class UnionFind:
    def __init__(self):
        # Write your code here
        self.union_find = {}

    def createSet(self, value):
        # Write your code here
        # O(1) | O(1)
        if not value in self.union_find:
            self.union_find[value] = set([value])

    def find(self, value):
        # Write your code here
        # O(n) | O(1) n = number of sets
        for k, v in self.union_find.items():
            if value in v:
                return k

        return None

    def union(self, valueOne, valueTwo):
        # Write your code here
        # O(n) | O(1)
        k_1 = self.find(valueOne)
        k_2 = self.find(valueTwo)

        if (k_1 != None) and (k_2 != None) and (k_1 != k_2):
            # both values are valid
            k_1, k_2 = max(k_1, k_2), min(k_1, k_2)
            self.union_find[k_1] = self.union_find[k_1].union(self.union_find[k_2])
            del self.union_find[k_2]