# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

class Codec:
    
    # Encodes a tree to a single string.
    def serialize(self, root: Optional[TreeNode]) -> str:
        # O(n) time and O(h) space

        def dfs(root, res):
            if not root:
                res.append("N")
                return 
            
            res.append(str(root.val))
            dfs(root.left, res)
            dfs(root.right, res)
        
        res = []
        dfs(root, res)

        return ",".join(res)

        
    # Decodes your encoded data to tree.
    def deserialize(self, data: str) -> Optional[TreeNode]:
        # O(n) time, O(h) space
        
        i = 0

        def dfs(res):
            nonlocal i
            if res[i]=="N":
                i += 1
                return None
            node = TreeNode(int(res[i]))
            i += 1
            node.left = dfs(res)
            node.right = dfs(res)
            return node
        
        res = data.split(",")

        return dfs(res)


