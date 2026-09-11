# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

class Solution:
    def maxPathSum(self, root: Optional[TreeNode]) -> int:
        # O(n) time and O(h) space

        maxsum = float('-inf')

        def dfs(root):
            nonlocal maxsum

            if not root:
                return float('-inf')
            
            val = root.val
            left = dfs(root.left)
            right = dfs(root.right)

            ret_val = max(val, val+left, val+right)
            curr_max = max(val+left+right, val, val+left, val+right)
            maxsum = max(maxsum, curr_max)

            return ret_val

        dfs(root)
        return maxsum

        