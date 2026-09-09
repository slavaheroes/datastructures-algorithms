# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

class Solution:
    res = True

    def isBalanced(self, root: Optional[TreeNode]) -> bool:
        # O(n) time, O(h) space where h is height
        
        def height(node):
            if not self.res:
                # stop search
                return -1

            if not node:
                return 0

            left_h = height(node.left)
            right_h = height(node.right)

            if abs(left_h - right_h) > 1:
                self.res = False
            
            return 1 + max(left_h, right_h)
        
        height(root)
        return self.res
        