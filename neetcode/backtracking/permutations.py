class Solution:
    def permute(self, nums: List[int]) -> List[List[int]]:
        # Space: O(n) recursion, res=O(n*n!)  
        # Time: O(n*n!)
        res = []

        def backtrack(path, curr):
            if len(curr) == len(nums):
                res.append(curr.copy())
                return
            
            for i in range(len(nums)):
                if i not in path:
                    curr.append(nums[i])
                    path.add(i)
                    backtrack(path, curr)
                    path.discard(i)
                    curr.pop()
        
        backtrack(set(), [])
        return res
        
        