class Solution:
    def subsetsWithDup(self, nums: List[int]) -> List[List[int]]:
        # Time: O(nlogn) + O(n*2^n)
        # Space: O(n) extra, res = O(n*2^n)

        nums.sort() # nlogn time
        res = []

        def backtrack(i, curr_list, curr_sum):
            res.append(curr_list.copy())

            if i==len(nums):
                return

            for j in range(i, len(nums)):

                if j>i and nums[j-1]==nums[j]:
                    continue

                curr_list.append(nums[j])
                backtrack( j+1, curr_list, curr_sum+nums[j])
                curr_list.pop()
        
        backtrack(0, [], 0)
        return res
        