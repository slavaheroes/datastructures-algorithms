'''
MineSweeper is a game where an NxM board has mines hidden in some of the cells.
The goal is to create a function that takes a board and a cell and reveals the board until the cell is not a mine or a cell with a mine is revealed.

A cell is represented by a string that can be:
- "M" for a cell with a mine,
- "H" for a cell without a mine, but not revealed,
- "X" for a cell that has a mine and is revealed,
- "0-8" for a cell without a mine and the number of mines in the adjacent cells.

If the player clicks on a cell with a mine, the game is over and the function should return the board with all the mines revealed.
If the player clicks on a cell without a mine, the function should return the board with all the cells revealed until a cell with a mine is revealed.

Write a function that takes a board and a cell and returns the board after revealing the cells.

Input:
- board: A list of N lists of M strings representing the board.
- row: An integer representing the row of the cell to reveal.
- column: An integer representing the column of the cell to reveal.

[
["H", "H", "H", "H", "M"],
["H", "H", "M", "H", "H"],
["H", "H", "H", "H", "H"],
["H", "H", "H", "H", "H"]
], 3, 0

Output:

["0", "1", "H", "H", "M"],
["0", "1", "M", "2", "1"],
["0", "1", "1", "1", "0"],
["0", "0", "0", "0", "0"]

'''


def revealMinesweeper(board, row, column):
    # Write your code here.
    # O(n*m) time space
    step = [(0, 1), (0, -1), (1, 0), (-1, 0), (1, 1), (-1, -1), (1, -1), (-1, 1)]

    if board[row][column] == "M":
        board[row][column] = "X"
    elif board[row][column] == "H":
        curr = 0
        for dx, dy in step:
            if row + dx < 0 or column + dy < 0 or row + dx >= len(board) or column + dy >= len(board[0]):
                continue
            elif board[row + dx][column + dy] == "M":
                curr += 1

        board[row][column] = str(curr)
        if board[row][column] == '0':
            for dx, dy in step:
                if row + dx < 0 or column + dy < 0 or row + dx >= len(board) or column + dy >= len(board[0]):
                    continue
                elif board[row + dx][column + dy] == "H":
                    revealMinesweeper(board, row + dx, column + dy)

    return board


import unittest


class TestProgram(unittest.TestCase):
    def test_case_1(self):
        self.assertEqual(
            revealMinesweeper(
                [["H", "H", "H", "H", "M"], ["H", "H", "M", "H", "H"], ["H", "H", "H", "H", "H"], ["H", "H", "H", "H", "H"]], 3, 0
            ),
            [["0", "1", "H", "H", "M"], ["0", "1", "M", "2", "1"], ["0", "1", "1", "1", "0"], ["0", "0", "0", "0", "0"]],
        )


if __name__ == '__main__':
    unittest.main()
