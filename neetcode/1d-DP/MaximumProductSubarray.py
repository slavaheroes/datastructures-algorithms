class Solution:
    def maxProduct(self, nums: List[int]) -> int:
        # O(n) time, O(1) space
        res = float('-inf')
        minProd, maxProd = 1, 1

        for n in nums:
            minProd, maxProd = min(n,minProd*n, maxProd*n),\
                               max(n, minProd*n, maxProd*n)
            
            res = max(maxProd, res)
            
        return res
        