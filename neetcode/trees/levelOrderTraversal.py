# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

class Solution:
    def levelOrder(self, root: Optional[TreeNode]) -> List[List[int]]:
        # O(n) time and space where n is number of nodes
        
        if not root:
            return []

        q = deque([(root, 0)])
        answer = []
        curr_level = 0

        while q:
            curr_level_values = []
            while q and q[0][1] == curr_level:
                node, level = q.popleft()
                curr_level_values.append(node.val)
                if node.left:
                    q.append((node.left, level+1))
                
                if node.right:
                    q.append((node.right, level+1))
            
            if len(curr_level_values) > 0:
                answer.append(curr_level_values)
            curr_level += 1
        
        return answer
