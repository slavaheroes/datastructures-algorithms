class Solution:
    def generateParenthesis(self, n: int) -> List[str]:
        # The number of valid strings is the Catalan number

        # Space: O(n) recursion, res =  O(2^(2n) / sqrt(n))
        # Time: O(2^(2n) / sqrt(n))

        res = []

        def backtrack(curr, n_open, n_closed):

            if n_open>n or n_closed>n_open:
                return

            if len(curr)==2*n:
                res.append("".join(curr))
                return
            
            curr.append("(")
            backtrack(curr, n_open+1, n_closed)
            curr.pop()
            curr.append(")")
            backtrack(curr, n_open, n_closed+1)
            curr.pop()
            
        backtrack([], 0, 0)

        return res
        