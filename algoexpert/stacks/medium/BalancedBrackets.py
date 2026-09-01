'''
Write a function that takes in a string made up of brackets ((, [, {, ), ], and }) and other optional characters.
The function should return a boolean representing whether the string is balanced with regards to brackets.

A string is said to be balanced if it has as many opening brackets of a certain type as it has closing brackets of that type and if no bracket is unmatched.
Note that an opening bracket can't match a corresponding closing bracket that comes before it, and similarly,
a closing bracket can't match a corresponding opening bracket that comes after it.

Sample Input: string = "([])(){}(())()()"
Sample Output: True
'''


def balancedBrackets(string):
    # Write your code here.
    # O(n) time & space
    stack = []

    for s in string:
        if s in '({[':
            stack.append(s)
        elif s in ')}]':
            if len(stack) == 0:
                return False
            s_ = stack.pop(-1)
            if not ((s == ')' and s_ == '(') or (s == ']' and s_ == '[') or (s == '}' and s_ == '{')):
                return False
    return len(stack) == 0


import unittest


class TestProgram(unittest.TestCase):
    def test_case_1(self):
        self.assertEqual(balancedBrackets("([])(){}(())()()"), True)

    def test_case_2(self):
        self.assertEqual(balancedBrackets("([])(){}(()())()()"), True)

    def test_case_3(self):
        self.assertEqual(balancedBrackets("([])(){}(())()("), False)

    def test_case_4(self):
        self.assertEqual(balancedBrackets("([])(){}(())()())"), False)

    def test_case_5(self):
        self.assertEqual(balancedBrackets("([])(){}(())()()("), False)

    def test_case_6(self):
        self.assertEqual(balancedBrackets("(((((({{{{{[[[[[([)])]]]]]}}}}}))))))"), False)

    def test_case_7(self):
        self.assertEqual(balancedBrackets("()[]{}{"), False)

    def test_case_8(self):
        self.assertEqual(balancedBrackets("(((((({{{{{[[[[[([[[[{{{{{([)])]]]]]}}}}}]]]]))))))"), False)

    def test_case_9(self):
        self.assertEqual(balancedBrackets("()[]{}{}"), True)

    def test_case_10(self):
        self.assertEqual(balancedBrackets("(((((({{{{{[[[[[([)])]]]]]}}}}}))))))"), False)


if __name__ == '__main__':
    unittest.main()
