class Solution:
    def trap(self, height: List[int]) -> int:
        # O(n) time, O(n) space
        n = len(height)
        prefix = [0 for _ in range(n)]
        suffix = [0 for _ in range(n)]

        for i in range(1, n):
            prefix[i] = max(prefix[i-1], height[i-1])
        
        for j in range(n-2, -1, -1):
            suffix[j] = max(suffix[j+1], height[j+1])

        answer = 0

        for i in range(1, n-1):
            answer += max(0, min(suffix[i], prefix[i]) - height[i] )

        return answer
            
# Reference Solution
# O(n) time, O(1) space

class Solution:
    def trap(self, height: List[int]) -> int:
        if not height:
            return 0

        l, r = 0, len(height) - 1
        leftMax, rightMax = height[l], height[r]
        res = 0
        while l < r:
            if leftMax < rightMax:
                l += 1
                leftMax = max(leftMax, height[l])
                res += leftMax - height[l]
            else:
                r -= 1
                rightMax = max(rightMax, height[r])
                res += rightMax - height[r]
        return res

        