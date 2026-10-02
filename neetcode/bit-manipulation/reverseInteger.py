class Solution:
    def reverse(self, x: int) -> int:
        # O(1) time, space
        
        MAX = 2147483647
        res = 0
        sign = 1 if x>=0 else -1
        limit_digit = 7 if sign == 1 else 8

        x *= sign

        while x:
            if res > MAX//10:
                return 0
            
            digit = x % 10

            if res==MAX//10 and digit > limit_digit:
                return 0

            res = res*10 + digit
            x = x // 10
        
        return sign*res
        