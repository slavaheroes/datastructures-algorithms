class Solution:
    def jump(self, nums: List[int]) -> int:
        # O(n) time and space
        
        visited = {0:0}

        for i in range(len(nums)):
            if i not in visited:
                visited[i] = visited[i-1] + 1

            n_i = min(i + nums[i], len(nums)-1)

            if n_i in visited:
                visited[n_i] = min(
                    visited[i] + 1, visited[n_i]
                )
            else:
                visited[n_i] = visited[i] + 1
        
        return visited[len(nums)-1]
            
        

# Reference Solution       
class Solution:
    def jump(self, nums: List[int]) -> int:
        # O(n) time and O(1) space
        res = 0
        l, r = 0, 0
        
        while r < len(nums)-1:
            farthest = 0
            for i in range(l, r+1):
                farthest = max(farthest, nums[i]+i)

            l = r + 1
            r = farthest
            res += 1

        return res