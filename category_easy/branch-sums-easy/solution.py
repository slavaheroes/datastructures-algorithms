# This is the class of the input root. Do not edit it.
class BinaryTree:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None


def branchSums(root):
    # Write your code here.
    outputs = []
    
    def visit(tree, curr_sum):
        if tree.left is None and tree.right is None:
            outputs.append(curr_sum + tree.value)
            return
        if tree.left is None:
            visit(tree.right, curr_sum + tree.value)
            return
            
        if tree.right is None:
            visit(tree.left, curr_sum + tree.value)
            return

        # both of them not none
        visit(tree.left, curr_sum + tree.value)
        visit(tree.right, curr_sum + tree.value)    
        

    visit(root, 0)

    return outputs

    
