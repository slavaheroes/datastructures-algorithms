class Solution:
    def findMin(self, nums: List[int]) -> int:
        
        # O(log n) time | O(1) space
        l, r = 0, len(nums)-1

        while r>l:
            mid = (l+r)//2

            if nums[mid] > nums[r]:
                l = mid + 1
            else:
                r = mid 

        return nums[l]
        