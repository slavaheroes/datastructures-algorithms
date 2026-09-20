class Solution:
    def partition(self, s: str) -> List[List[str]]:
        # Time: O(n*2^n)
        # Space: O(n) recursion, res = O(n*2^n)

        def isPalindrom(i, j):
            l, r = i, j
            while r>l:
                if s[l] != s[r]:
                    return False
                l += 1
                r -= 1
            return True

        res = []                  

        def backtrack(i, curr):

            if i==len(s):
                res.append(curr.copy())
                return
            
            for j in range(i, len(s)):
                if isPalindrom(i, j):
                    curr.append(s[i:j+1])
                    backtrack(j+1, curr)
                    curr.pop()
            
        backtrack(0, [])

        return res
        