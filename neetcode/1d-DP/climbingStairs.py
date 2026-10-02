class Solution:
    def climbStairs(self, n: int) -> int:
        # O(1) space, O(n) time
        prev = 0
        curr = 1
        for i in range(1, n+1):
            tmp = curr + prev
            prev = curr
            curr = tmp
        return curr