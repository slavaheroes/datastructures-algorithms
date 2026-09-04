class Solution:
    def maxProfit(self, prices: List[int]) -> int:
        maxPrice = 0
        i, j = 0, 1

        while j<len(prices):
            
            if prices[j]>prices[i]:
                maxPrice = max(maxPrice, prices[j]-prices[i])
                j += 1
            else:
                i = j
                j += 1
        
        return maxPrice
        