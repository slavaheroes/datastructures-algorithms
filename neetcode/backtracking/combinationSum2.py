class Solution:
    def combinationSum2(self, candidates: List[int], target: int) -> List[List[int]]:
        # Time: O(n log n) for the sort + O(n · 2ⁿ)
        # Space: O(min(n, D)) extrac space
        # res = S × min(n, D), where S <= 2^n
        candidates.sort()
        res = []
        
        def backtrack(nums, i, curr_list, curr_sum):
            if curr_sum==target:
                res.append(curr_list.copy())
                return

            if curr_sum > target or i==len(nums):
                return

            for j in range(i, len(nums)):

                if j>i and nums[j-1]==nums[j]:
                    continue

                curr_list.append(nums[j])
                backtrack(nums, j+1, curr_list, curr_sum+nums[j])
                curr_list.pop()
        
        backtrack(candidates, 0, [], 0)
        return res
        