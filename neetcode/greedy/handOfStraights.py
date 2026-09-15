class Solution:
    def isNStraightHand(self, hand: List[int], groupSize: int) -> bool:
        # O(nlogn) time, O(n) space
        hand.sort()
        freq = {}
        
        for i in range(len(hand)):
            freq[hand[i]] = freq.get(hand[i], 0) + 1
        
        for i in range(len(hand)):
            
            if freq[hand[i]] > 0:
                start = hand[i]
                for j in range(start, start+groupSize):
                    
                    if j in freq and freq[j] > 0:
                        freq[j] -= 1
                    else:
                        return False

        return True

# Reference Solution
from collections import Counter

class Solution:
    def isNStraightHand(self, hand: List[int], groupSize: int) -> bool:
        if len(hand) % groupSize != 0:
            return False

        count = Counter(hand)
        for num in hand:
            start = num
            while count[start - 1]:
                start -= 1
            while start <= num:
                while count[start]:
                    for i in range(start, start + groupSize):
                        if not count[i]:
                            return False
                        count[i] -= 1
                start += 1
        return True