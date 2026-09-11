# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

class Solution:
    def kthSmallest(self, root: Optional[TreeNode], k: int) -> int:
        # O(h+k) time and O(h) space
        
        cnt = k
        res = -1

        def inorder(node):
            nonlocal cnt, res

            if not node or cnt==0:
                return 
            
            inorder(node.left)
            if cnt==0:
                return
            cnt -= 1
            if cnt==0:
                res = node.val
                return
            inorder(node.right)
        
        inorder(root)
        
        return res
        