class Solution:
    def isHappy(self, n: int) -> bool:
        # O(logN) time, O(logN) space
        seen = set()
        num = sum([int(ch)**2 for ch in str(n)])
        while True:
            if num==1:
                break
            
            if num in seen:
                return False
            
            seen.add(num)
            num = sum([int(ch)**2 for ch in str(num)])
        
        return True

# Reference solution
class Solution:
    def isHappy(self, n: int) -> bool:
        # O(logN) time, O(1) space
        
        slow, fast = n, self.sumOfSquares(n)
        power = lam = 1

        while slow != fast:
            if power == lam:
                slow = fast
                power *= 2
                lam = 0
            fast = self.sumOfSquares(fast)
            lam += 1
        return True if fast == 1 else False

    def sumOfSquares(self, n: int) -> int:
        output = 0

        while n:
            digit = n % 10
            digit = digit ** 2
            output += digit
            n = n // 10
        return output