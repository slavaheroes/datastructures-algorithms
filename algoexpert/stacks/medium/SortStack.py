'''
Write a function that takes in an array of integers representing a stack,
recursively sorts the stack in place (i.e., doesn't create a brand new array), and returns it.

The array must be treated as a stack, with the end of the array as the top of the stack.
Therefore, you're only allowed to:
- Pop elements from the top of the stack by removing elements from the end of the array using the built-in .pop() method in Python.
- Push elements to the top of the stack by appending elements to the end of the array using the built-in .append() method in Python.
- Peek at the element on top of the stack by accessing the last element in the array.

You're not allowed to perform any other operations on the input array, including accessing elements (except for the last element), moving elements, etc..
You're also not allowed to use any other data structures, and your solution must be recursive.

Sample Input:
stack = [2, 3, 5, 6, 1]
Sample Output:
[1, 2, 3, 5, 6]
'''


def insertStack(stack, curr_elem):
    if len(stack) == 0 or curr_elem > stack[-1]:
        stack.append(curr_elem)
        return

    n = stack.pop()
    insertStack(stack, curr_elem)
    stack.append(n)


def sortStack(stack):
    # Write your code here.
    # O(n^2) time | O(n) space
    if len(stack) < 2:
        return stack

    if len(stack) == 2:
        n1 = stack.pop()
        n2 = stack.pop()

        stack.append(min(n1, n2))
        stack.append(max(n1, n2))

        return stack

    curr_elem = stack.pop()
    sortStack(stack)
    insertStack(stack, curr_elem)

    return stack


import unittest


class TestProgram(unittest.TestCase):
    def test_case_1(self):
        stack = [2, 3, 5, 6, 1]
        self.assertEqual(sortStack(stack), [1, 2, 3, 5, 6])

    def test_case_2(self):
        stack = [1, 2, 3, 4, 5]
        self.assertEqual(sortStack(stack), [1, 2, 3, 4, 5])

    def test_case_3(self):
        stack = [5, 4, 3, 2, 1]
        self.assertEqual(sortStack(stack), [1, 2, 3, 4, 5])

    def test_case_4(self):
        stack = [5, 3, 3, 2, 1]
        self.assertEqual(sortStack(stack), [1, 2, 3, 3, 5])

    def test_case_5(self):
        stack = [5, 3, 3, 2, 1, 6]
        self.assertEqual(sortStack(stack), [1, 2, 3, 3, 5, 6])

    def test_case_6(self):
        stack = [5, 3, 3, 2, 1, 0]
        self.assertEqual(sortStack(stack), [0, 1, 2, 3, 3, 5])


if __name__ == "__main__":
    unittest.main()
