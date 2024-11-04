'''
You are given a list of integers and operators. Return the result of the expression using Reverse Polish Notation.
Reverse Polish notation (RPN) is a mathematical notation in which every operator follows all of its operands.
For example, the expression "3 + 4" is written as "3 4 +" in RPN.

Write a function that takes in a list of tokens in RPN and returns the result of the expression.

Sample Input:
    tokens = ["2", "1", "+", "3", "*"]
Sample Output:
    9
    Explanation: (2 + 1) * 3 = 9
'''


def reversePolishNotation(tokens):
    # Write your code here.
    # O(n) time | O(n) space
    operators = {
        '+': lambda x, y: x + y,
        '-': lambda x, y: x - y,
        '*': lambda x, y: x * y,
        '/': lambda x, y: int(x / y),
    }

    stack = []

    for tok in tokens:
        if tok in "+-*/":
            n1 = stack.pop()
            n2 = stack.pop()

            res = operators[tok](n2, n1)
            stack.append(res)
        else:
            stack.append(int(tok))

    return stack[-1]


import unittest


class TestProgram(unittest.TestCase):
    def test_case_1(self):
        self.assertEqual(reversePolishNotation(["2", "1", "+", "3", "*"]), 9)


if __name__ == "__main__":
    unittest.main()
