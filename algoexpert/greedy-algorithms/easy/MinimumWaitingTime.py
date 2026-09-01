'''
You're given a non-empty array of positive integers representing the amounts of time that specific queries take to execute.
Only one query can be executed at a time, but the queries can be executed in any order.
A query's waiting time is defined as the amount of time that it must wait before its execution starts.
Write a function that returns the minimum amount of total waiting time for all of the queries.
For example, if you're given the queries of durations [1, 4, 5],
then the total waiting time if the queries were executed in the order of [5, 1, 4] would be (0) + (5) + (5+1) = 11.

Sample input:
queries = [3, 2, 1, 2, 6]
Sample output: 17
'''


def minimumWaitingTime(queries):
    # Write your code here.
    # O(nlogn) time | O(1) space
    queries.sort()
    currTime = 0
    runningSum = 0

    for i in range(1, len(queries)):
        currTime += queries[i - 1]
        runningSum += currTime

    return runningSum


import unittest


class TestProgram(unittest.TestCase):
    def test_case_1(self):
        self.assertEqual(minimumWaitingTime([3, 2, 1, 2, 6]), 17)

    def test_case_2(self):
        self.assertEqual(minimumWaitingTime([2, 1, 1, 1]), 6)


if __name__ == '__main__':
    unittest.main()
