class Solution:
    def exist(self, board: List[List[str]], word: str) -> bool:
        # S = len(word)
        # Space: O(S) recursion 
        # Time: O(N * M * 3 ^ S)

        N, M = len(board), len(board[0])
        output = False

        def dfs(i, j, ch_idx):
            nonlocal output

            if ch_idx==len(word):
                output = True
                return
            if i<0 or j<0 or i>=N or j>=M or board[i][j]=='#':
                return
            
            if board[i][j] == word[ch_idx]:
                ch_idx += 1
            else:
                return
            
            ch = board[i][j]
            board[i][j] = '#'
            for dx, dy in [(1,0), (-1, 0), (0, 1), (0, -1)]:
                x = i + dx
                y = j + dy
                dfs(x, y, ch_idx)

            board[i][j] = ch
        
        for i in range(N):
            for j in range(M):
                dfs(i, j, 0)

        return output
        