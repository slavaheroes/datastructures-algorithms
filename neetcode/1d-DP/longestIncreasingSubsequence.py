class Solution:
    def lengthOfLIS(self, nums: List[int]) -> int:
        # O(n^2) time
        # O(n) space

        n = len(nums)
        dp = [1] * n
        dp[-1] = 1

        for i in range(n-1, -1, -1):
            for j in range(i, n):
                if nums[i] < nums[j]:
                    dp[i] = max(
                        1+dp[j], dp[i]
                    )
        
        return max(dp)