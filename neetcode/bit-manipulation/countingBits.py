class Solution:
    def countBits(self, n: int) -> List[int]:
        # O(n) time and space
        res = [0] * (n+1)

        for i in range(1,n+1):
            res[i] = res[i>>1] + (i&1)
            
        return res
        