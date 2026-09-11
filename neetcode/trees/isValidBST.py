# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

class Solution:
    def isValidBST(self, root: Optional[TreeNode]) -> bool:
        # O(n) time and space

        inorder = []

        def dfs(node, res):
            if node:
                dfs(node.left, res)
                res.append(node.val)
                dfs(node.right, res)
        
        dfs(root, inorder)
        
        for i in range(1, len(inorder)):
            if inorder[i] <= inorder[i-1]:
                return False
        
        return True
        