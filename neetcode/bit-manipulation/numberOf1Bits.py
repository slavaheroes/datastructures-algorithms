class Solution:
    def hammingWeight(self, n: int) -> int:
        # O(1) time, space because we have 32 bits
        # But: time is O(number of bits), often written as O(log n)
        count = 0
        while n:
            count += (n&1)
            n = n >> 1
        return count

class Solution:
    def hammingWeight(self, n: int) -> int:
        # O(1) time, space because we have 32 bits
        # But: time is O(number of bits), often written as O(log n)
        
        count = 0
        while n:
            n = n & (n-1)
            count += 1

        return count
        