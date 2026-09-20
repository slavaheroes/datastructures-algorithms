class Solution:
    def letterCombinations(self, digits: str) -> List[str]:
        # Time: N*4^N
        # Space: O(N) recursion, N*4^N output 
        if not digits:
            return []

        combinations = {
            "2": "abc",
            "3": "def",
            "4": "ghi",
            "5": "jkl",
            "6": "mno",
            "7": "pqrs",
            "8": "tuv",
            "9": "wxyz"
        }

        res = []
        def backtrack(i, curr):
            if len(curr) == len(digits):
                res.append(curr)
                return
            
            for ch in combinations[digits[i]]:
                backtrack(i+1, curr+ch)
            
        backtrack(0, "")
        return res
        