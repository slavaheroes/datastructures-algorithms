# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right


class Solution:
    maxDiam = 0
    
    def diameterOfBinaryTree(self, root: Optional[TreeNode], rec_depth=0) -> int:
        # O(n) time, O(h) space where h is height
        
        if not root:
            return 0
        
        left_height = self.diameterOfBinaryTree(root.left, rec_depth+1)
        right_height = self.diameterOfBinaryTree(root.right, rec_depth+1)

        diam = left_height + right_height
        self.maxDiam = max(self.maxDiam, diam)

        if rec_depth==0:
            return self.maxDiam
        

        return 1 + max(left_height, right_height)
        

        