class Solution:
    def solve(self, board: List[List[str]]) -> None:
        rows, cols = len(board), len(board[0])
        visited = set()
        cannot_surround = set()
        q = deque()

        for i in range(rows):
            for j in range(cols):
                if i==0 or i==rows-1 or j==0 or j==cols-1:
                    if board[i][j]=='O':
                        q.append((i, j))
        
        while q:
            i, j = q.popleft()
            if i<0 or j<0 or i==rows or j==cols:
                continue
            
            if (i,j) in visited or board[i][j]=='X':
                continue 
            
            visited.add((i, j))
            cannot_surround.add((i, j))
            for x, y in [(i+1, j), (i-1, j), (i,j+1), (i,j-1)]:
                q.append((x, y))
        
        for i in range(rows):
            for j in range(cols):
                if (i,j) not in cannot_surround:
                    board[i][j] = 'X'
                
        