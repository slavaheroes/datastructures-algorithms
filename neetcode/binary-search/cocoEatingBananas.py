class Solution:
    def minEatingSpeed(self, piles: List[int], h: int) -> int:
        # O(nlogm) time, O(1) space
        import math

        def get_hours(lst, speed):
            ans = 0
            for l in lst:
                ans += math.ceil(l / speed)
            return ans

        l, r = 1, max(piles)
        res = r
        while r >= l:
            mid = (l+r)//2
            if get_hours(piles, mid) <= h:
                res = min(res, mid)
                r = mid - 1
            else:
                l = mid + 1
        
        return res
