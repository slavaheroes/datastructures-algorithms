class Solution:
    def largestRectangleArea(self, heights: List[int]) -> int:
        # O(n) time and space
        
        heights.append(0)
        stack = [[heights[0], 0]]
        
        maxArea = 0
        for i in range(1, len(heights)):
            start = i
            while stack and heights[i] < stack[-1][0]:
                h, j = stack.pop()
                maxArea = max(
                    maxArea, (i-j)*h
                )
                
                start = j
            
            stack.append([heights[i], start])

        return maxArea