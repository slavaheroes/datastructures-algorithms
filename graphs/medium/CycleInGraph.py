'''
You're given a list of edges representing an unweighted, directed graph with at least one node.
Write a function that returns a boolean representing whether the given graph contains a cycle.

Sample Input:
edges = [[1, 3], [2, 3, 4], [0], [], [2, 5], []]
Sample Output:
True
'''


def cycleInGraph(edges):
    # Write your code here.
    # Time: O(v+e) | Space: O(v)
    for i in range(len(edges)):
        visited = [False] * len(edges)
        stack = [(i, edges[i])]
        recursion_stack = [False] * len(edges)

        while len(stack) > 0:
            s, neighbors = stack.pop(-1)

            if not visited[s]:
                visited[s] = True
                recursion_stack[s] = True

            if len(neighbors) == 0:
                recursion_stack[s] = False
                continue

            for node in neighbors:
                if not visited[node]:
                    stack.append((node, edges[node]))
                elif recursion_stack[node]:
                    return True

    return False


import unittest


class TestProgram(unittest.TestCase):
    def test_case_1(self):
        edges = [[1, 3], [2, 3, 4], [0], [], [2, 5], []]
        self.assertEqual(cycleInGraph(edges), True)

    def test_case_2(self):
        edges = [[1, 2], [2], []]
        self.assertEqual(cycleInGraph(edges), False)


if __name__ == "__main__":
    unittest.main()
