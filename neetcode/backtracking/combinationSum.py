class Solution:
    def combinationSum(self, nums: List[int], target: int) -> List[List[int]]:
        # m = min(nums), D = t/m (max depth)
        # Space: O(D) in recursion, res = n^D
        # Time: O(D * n^(D+1))
        # Can be optimized without sum and copy: O(n^(D+1))
        # +1 because sum > target check in the child node

        res = []
        def backtrack(i, curr_list):
            if sum(curr_list)==target:
                res.append(curr_list.copy())
                return

            if sum(curr_list) > target:
                return
            
            for j in range(i, len(nums)):
                curr_list.append(nums[j])
                backtrack(j, curr_list)
                curr_list.pop()
        
        backtrack(0, [])
        return res