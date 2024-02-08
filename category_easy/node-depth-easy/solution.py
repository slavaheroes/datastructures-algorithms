def nodeDepths(root):
    # Write your code here.
    
    # bread first search
    sum_all = 0
    stack = [(root.left, 1), (root.right, 1)]

    while len(stack)!=0:
        node, level = stack.pop(0)
        if node is None:
            continue
        sum_all += level
        stack.append((node.left, level + 1))
        stack.append((node.right, level + 1))
    
    return sum_all
    

# This is the class of the input binary tree.
class BinaryTree:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None
