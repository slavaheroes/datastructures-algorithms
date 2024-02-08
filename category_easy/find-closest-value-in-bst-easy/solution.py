def findClosestValueInBst(tree, target):
    # Write your code here.

    curr_dif = None
    curr_value = None

    while True:
        if tree.value == target:
            return tree.value
        
        if tree.left is None and target <= tree.value:
            if abs(tree.value - target) < curr_dif:
                return tree.value
            return curr_value
        elif tree.right is None and target >= tree.value:
            if abs(tree.value-target) < curr_dif:
                return tree.value
            return curr_value
        elif tree.left and target<=tree.value:
            if curr_value is None or curr_dif > abs(tree.value-target):
                curr_value = tree.value
                curr_dif = abs(tree.value-target)
            tree = tree.left
        elif tree.right and target >= tree.value:
            if curr_value is None or curr_dif > abs(tree.value-target):
                curr_value = tree.value
                curr_dif = abs(tree.value-target)
            tree = tree.right
            
    return None

# This is the class of the input tree. Do not edit.
class BST:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None