# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

class Solution:
    def rightSideView(self, root: Optional[TreeNode]) -> List[int]:
        # O(n) time and space
        # the rightmost from each level

        if not root:
            return []

        q = deque()
        q.append(root)

        answer = []

        while q:
            n_nodes = len(q) # in current level
            answer.append(q[-1].val) # rightmost

            for _ in range(n_nodes):
                node = q.popleft()
                if node.left:
                    q.append(node.left)
                if node.right:
                    q.append(node.right)

        
        return answer
        