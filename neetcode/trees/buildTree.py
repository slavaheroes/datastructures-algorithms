# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

class Solution:
    
    def buildTree(self, preorder: List[int], inorder: List[int]) -> Optional[TreeNode]:
        # O(n) time and space 

        indices = {v:i for i, v in enumerate(inorder)}
        pi = 0

        def buildTree_(preorder, inorder, l, r):
            if l>r:
                return None

            nonlocal indices, pi

            root = TreeNode(preorder[pi])
            pi += 1

            idx = indices[root.val]
            
            root.left = buildTree_(preorder, inorder, l, idx-1)
            root.right = buildTree_(preorder, inorder, idx+1, r)

            return root


        return buildTree_(preorder, inorder, l=0, r=len(inorder)-1)