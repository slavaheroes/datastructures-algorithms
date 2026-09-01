'''
You're given an integer k representing a number of workers and an array of positive integers representing durations of tasks that must be completed by the workers.
Specifically, each worker must complete two unique tasks and can only work on one task at a time. The number of tasks will always be even and equal to 2k.

Write a function that returns the optimal assignment of tasks to each worker such that the tasks are completed as fast as possible.
Your function should return a list of pairs, where each pair stores the indices of the tasks that should be completed by one worker.
The pairs should be in the following format: [task1, task2], where the order of task1 and task2 doesn't matter.

Sample input:
k = 3
tasks = [1, 3, 5, 3, 1, 4]

Sample output:
[[0, 2], [4, 5], [1, 3]]
'''


def taskAssignment(k, tasks):
    # Write your code here.
    # O(n) space - O(nlogn) time
    tasks = [(i, tasks[i]) for i in range(len(tasks))]
    tasks.sort(key=lambda x: x[1])

    array = []

    for _ in range(k):
        a, b = tasks.pop(0), tasks.pop(-1)
        array.append([a[0], b[0]])

    return array


import unittest


class TestProgram(unittest.TestCase):
    def test_case_1(self):
        self.assertEqual(taskAssignment(3, [1, 3, 5, 3, 1, 4]), [[0, 2], [4, 5], [1, 3]])


if __name__ == '__main__':
    unittest.main()
