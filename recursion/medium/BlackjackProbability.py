'''
In the game of blackjack, the dealer must draw cards until the sum of the values of their cards is greater than or equal to target-4.
For example, in tradiotal blackjack, the dealer must draw cards until the sum of the values of their cards is greater than or equal to 17,
at which point they can stop drawing cards. If the dealer draws a card that brings their total above the target, the lose (bust).

Write a function that returns the probability that the dealer will bust if their starting hand sum is startingHand.

Sample input:
target = 21
startingHand = 12

Sample output:
0.268
'''


def blackjackProbability(target, startingHand):
    # Write your code here.
    # O(target-startingHand) time & space
    if startingHand >= (target - 4):
        return 0.0

    prev_probas = []
    for num in range(target - 5, startingHand - 1, -1):
        curr = 1 - ((target - num) / 10)
        if curr < 0.0:
            curr = 0.0
        for p in prev_probas:
            curr += 0.1 * p

        prev_probas.append(curr)
        if len(prev_probas) > 10:
            prev_probas.pop(0)

    return prev_probas[-1]


import unittest


class TestBlackjackProbability(unittest.TestCase):
    def test_sample_input(self):
        self.assertEqual(round(blackjackProbability(21, 12), 3), 0.268)


if __name__ == '__main__':
    unittest.main()
