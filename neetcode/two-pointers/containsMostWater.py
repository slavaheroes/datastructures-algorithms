class Solution:
    def maxArea(self, heights: List[int]) -> int:
        # O(n) time, O(1) space
        answer = 0
        l, r = 0, len(heights)-1

        while l<r:
            h = min(heights[l], heights[r])
            answer = max(answer, h*(r-l))

            if heights[r] > heights[l]:
                l += 1
            else:
                r -= 1
        
        return answer
        