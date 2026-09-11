# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

class Solution:
    ans = 0

    def goodNodes(self, root: TreeNode) -> int:
        # O(n) time
        # O(h) space

        def dfs(node, max_val=float('-inf')):
            if node.val >= max_val:
                self.ans += 1
            
            if node.left:
                dfs(node.left, max(node.val, max_val))
            
            if node.right:
                dfs(node.right, max(node.val, max_val))
        
        dfs(root)
        return self.ans