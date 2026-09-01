'''
Write a MinMaxStack class for a Min Max Stack. The class should support:
- Pushing and popping values on and off the stack.
- Peeking at the value at the top of the stack.
- Getting both the minimum and the maximum values in the stack at any given point in time.

All class methods, when considered independently, should run in constant time and with constant space.
'''


# Feel free to add new properties and methods to the class.
class MinMaxStack:

    def __init__(self):
        self.stack = []
        self.min_max = []

    def peek(self):
        # Write your code here.
        return self.stack[-1]

    def pop(self):
        # Write your code here.
        self.min_max.pop()
        return self.stack.pop()

    def push(self, number):
        # Write your code here.
        self.stack.append(number)
        self.min_max.append(
            (
                min(self.min_max[-1][0], number) if len(self.min_max) > 0 else number,
                max(self.min_max[-1][1], number) if len(self.min_max) > 0 else number,
            )
        )

    def getMin(self):
        # Write your code here.
        return self.min_max[-1][0]

    def getMax(self):
        # Write your code here.
        return self.min_max[-1][1]


if __name__ == "__main__":
    stack = MinMaxStack()
    stack.push(5)
    stack.push(7)
    stack.push(2)
    stack.push(8)
    stack.push(3)
    stack.push(1)

    assert stack.getMin() == 1
    assert stack.getMax() == 8
    assert stack.peek() == 1
    assert stack.pop() == 1
    stack.pop()
    stack.pop()
    assert stack.getMin() == 2
    assert stack.getMax() == 7

    print("OK")
