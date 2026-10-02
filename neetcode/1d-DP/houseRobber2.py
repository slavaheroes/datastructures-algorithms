class Solution:
    def rob(self, nums: List[int]) -> int:
        # O(N) time, space
        # Hint: first-second_to_last, second-last 
        
        if len(nums)==1:
            return nums[0]

        n = len(nums)
        memo1 = [0] * (n+2)
        memo2 = [0] * (n+2)

        for i in range(n-1, -1, -1):
            if i != n-1:
                memo1[i] = max(nums[i] + memo1[i+2], memo1[i+1])
            if i != 0:
                memo2[i] = max(nums[i] + memo2[i+2], memo2[i+1]) 

        return max(memo1[0], memo2[1])
        