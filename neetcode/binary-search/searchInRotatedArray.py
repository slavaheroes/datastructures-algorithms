class Solution:
    def search(self, nums: List[int], target: int) -> int:
        # O(log n) time | O(1) space
        
        l, r = 0, len(nums)-1

        while r>=l:
            mid = (r+l)//2

            if nums[mid] == target:
                return mid
            elif nums[mid] > nums[r]:
                # left side is sorted
                if nums[l] <= target and target < nums[mid]:
                    r = mid - 1
                else:
                    l = mid + 1
            else:
                # right side is sorted
                if nums[mid] < target and target <= nums[r]:
                    l = mid + 1
                else:
                    r = mid - 1

        return -1 