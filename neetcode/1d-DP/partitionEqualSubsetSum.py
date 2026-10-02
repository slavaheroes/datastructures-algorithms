class Solution:
    def canPartition(self, nums: List[int]) -> bool:
        # O(n*t) time
        # O(n*t) space
        
        total = sum(nums)
        if total%2==1: return False

        target = total//2
        n = len(nums)

        dp = [[False] * (target + 1) for _ in range(n + 1)]

        for i in range(n+1):
            dp[i][0] = True

        for i in range(1, n+1):
            for t in range(1, target+1):
                if t >= nums[i-1]:
                    dp[i][t] = dp[i-1][t] or dp[i-1][t-nums[i-1]]

        return dp[-1][-1]
        

# Reference Solution
class Solution:
    def canPartition(self, nums: List[int]) -> bool:
        # O(n*t) time
        # O(t) space

        total = sum(nums)
        if total%2==1: return False

        target = total // 2
        dp = {0}
        n = len(nums)

        for i in range(n):

            temp = set()
            for t in dp:
                temp.add( nums[i] + t )
                temp.add(t)

                if target in temp: return True
            
            dp = temp
        
        return target in dp

        
        
        