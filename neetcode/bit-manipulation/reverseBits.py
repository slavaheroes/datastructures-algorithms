class Solution:
    def reverseBits(self, n: int) -> int:
        # O(1) time, space 
        res = 0
        d = 0
        while n:
            bit = n & 1
            n = n >> 1
            if bit:
                res += 2**(31-d)
            d += 1
        return res
        
        
# Reference solution 
class Solution:
    def reverseBits(self, n: int) -> int:
        # O(1) time, space
        res = 0
        for i in range(32):
            bit = n&1
            n >>= 1
            res = (res<<1) | bit
        return res

        