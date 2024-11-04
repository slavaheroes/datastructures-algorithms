'''
You're given a list of edges representing an unweighted graph. Write a function that returns a boolean indicating whether or not the given graph is two-colorable.

The graph is two-colorable (bipartile) if it is possible to assign a color to each node such that no two adjacent nodes share the same color.
To assign colors, you can use the integers 0 and 1.

The input list is what's called an adjacency list, and it represents a graph.
The number of nodes in the graph is indicated by the length of the input list, and each node is uniquely identified by its index in the list.

Sample Input:
edges = [
    [1, 3],
    [0, 2],
    [1, 3],
    [0, 2]
]

Sample Output:
True
'''


def twoColorable(edges):
    # Write your code here.
    # O(v+e) time | O(v) space
    # -1 not colored, 0 is black, 1 is white
    colored = [-1 for _ in range(len(edges))]
    colored[0] = 0
    queue = [0]

    while len(queue) > 0:
        node = queue.pop(0)
        color = colored[node]

        for adj in edges[node]:
            if colored[adj] == color:
                return False
            else:
                if colored[adj] == -1:
                    queue.append(adj)
                colored[adj] = 1 - color

    return True


import unittest


class TestProgram(unittest.TestCase):
    def test_case_1(self):
        edges = [[1, 3], [0, 2], [1, 3], [0, 2]]
        self.assertEqual(twoColorable(edges), True)

    def test_case_2(self):
        edges = [[1, 2], [0, 2], [0, 1]]
        self.assertEqual(twoColorable(edges), False)


if __name__ == '__main__':
    unittest.main()
