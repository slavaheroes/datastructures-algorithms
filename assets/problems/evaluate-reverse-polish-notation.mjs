export default {
  "pattern": "Operand stack",
  "problem": "Evaluate a valid postfix expression with integer operands and +, -, *, /. Division truncates toward zero.",
  "example": "tokens = ['2', '1', '+', '3', '*']\nOutput: 9\n(2 + 1) * 3 = 9",
  "insight": "An operator comes after both operands. Push numbers; when an operator appears, pop the right operand first and the left operand second, then push the result.",
  "steps": [
    "Push 2 and 1: stack = [2, 1].",
    "Read +: pop right = 1 and left = 2, then push 3.",
    "Push the next 3: stack = [3, 3]. Read * and push 9.",
    "Return the single remaining value. For division, divide absolute values with // and restore the sign to truncate toward zero without using floats."
  ],
  "complexity": "O(n) time and O(n) extra space for n tokens under the problem's bounded-integer arithmetic model.",
  "pitfall": "Operand order matters for subtraction and division. Python's // rounds negative results down: -7 // 3 is -3, while this problem requires -2. Input is a valid expression with no division by zero."
};
