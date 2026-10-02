class Solution:
    def maxCoins(self, nums: List[int]) -> int:
        nums = [1] + nums + [1]
        
        def foo(nums):
            if len(nums) == 2:
                return 0
            
            maxCoins = 0
            for i in range(1, len(nums)-1):
                maxCoins = max(
                    maxCoins,
                    nums[i-1]*nums[i]*nums[i+1] + foo(nums[:i] + nums[i+1:])
                )
            
            return maxCoins
        
        return foo(nums)

class Solution:
    def maxCoins(self, nums: List[int]) -> int:
        # O(N^2) space
        # O(N^3) time
        
        n = len(nums)
        nums = [1] + nums + [1]
        dp = [[0]*(n+2) for _ in range(n+2)]


        for left in range(n, 0, -1):
            for right in range(left, n+1):
                val = 0

                # print(left, right, nums[left:right+1])

                for k in range(left, right+1):
                    candidate = (
                        dp[left][k-1] + 
                        nums[left-1]*nums[k]*nums[right+1] +
                        dp[k+1][right]

                    )
                    val = max(val, candidate)

                dp[left][right] = val

        # for r in dp:
        #     print(r)

        return dp[1][n]
