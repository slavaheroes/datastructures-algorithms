class Solution:
    def myPow(self, x: float, n: int) -> float:
        # O(logN) time, O(1) space
        
        if x==1 or x==0:
            return x
        if n==0:
            return 1

        if x==-1:
            return x if n%2==1 else -x

        res = x
        degree = abs(n)
        while degree>1:
            if degree%2==1:
                res = res*x
            res *= x
            x *= x
            degree = degree//2
        
        return res if n>0 else 1/res
        