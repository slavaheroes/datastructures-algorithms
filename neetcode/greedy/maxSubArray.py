class Solution:
    def maxSubArray(self, nums: List[int]) -> int:
        # Time O(n), Space O(1)
        maxsum = float('-inf')
        curr_sum = 0

        for i in range(len(nums)):
            curr_sum += nums[i]
            maxsum = max(curr_sum, maxsum)
            if curr_sum < 0:
                curr_sum = 0
        return maxsum
        