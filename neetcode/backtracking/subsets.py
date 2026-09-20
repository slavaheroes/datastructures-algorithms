class Solution:
    def subsets(self, nums: List[int]) -> List[List[int]]:
        # Time: O(n*2^n)
        # Space: O(n) extra space (recursion)

        res = [] # O(n*2^n)

        def backtrack(i, curr_list):
            # O(n) time for copy()
            res.append(curr_list.copy())

            for j in range(i, len(nums)):
                curr_list.append(nums[j])
                backtrack(j+1, curr_list)
                curr_list.pop()

        backtrack(0, [])

        return res
        