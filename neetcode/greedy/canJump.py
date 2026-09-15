class Solution:
    def canJump(self, nums: List[int]) -> bool:
        # O(n) space, O(1) time
        maxPos = 0

        for i in range(len(nums)):
            if i > maxPos:
                return False
            
            maxPos = max(maxPos, nums[i]+i)
        
        return maxPos >= len(nums)-1
        


        