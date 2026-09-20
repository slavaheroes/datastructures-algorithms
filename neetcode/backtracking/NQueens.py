class Solution:
    def solveNQueens(self, n: int) -> List[List[str]]:
        # Time: O(n*n!)
        # Space: O(n^2)
        res = []
        board = [["." for _ in range(n)] for _ in range(n)]

        cols = [True for _ in range(n)]
        posDiag = set()
        negDiag = set()

        def backtrack(r):

            if r==n:
                res.append(["".join(row) for row in board])
                return

            for c in range(n):
                if r+c in posDiag or r-c in negDiag:
                    continue

                if cols[c]:
                    cols[c] = False
                    board[r][c] = "Q"
                    posDiag.add(r+c)
                    negDiag.add(r-c)

                    backtrack(r+1)

                    board[r][c] = "."
                    cols[c] = True
                    posDiag.remove(r+c)
                    negDiag.remove(r-c)
            
        backtrack(0)

        return res
        