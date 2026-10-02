class Solution:
    def rob(self, nums: List[int]) -> int:
        # O(N) time and space
        # Hint: max(nums[i] + dfs(i + 2), dfs(i + 1)) 
        n = len(nums)
        memo = [0] * (n+2)

        for i in range(n-1, -1, -1):
            memo[i] = max(nums[i]+memo[i+2], memo[i+1])
        
        return memo[0]
        