class Solution:
    def dailyTemperatures(self, temperatures: List[int]) -> List[int]:
        # O(n) time and space
        stack = []
        results = [0 for _ in range(len(temperatures))]

        for idx, temp in enumerate(temperatures):
            if stack:
                while stack and temp > stack[-1][0]:
                    _, i = stack.pop()
                    results[i] = idx-i
                
                stack.append((temp, idx))

            else:
                stack.append((temp, idx))
        
        return results

        