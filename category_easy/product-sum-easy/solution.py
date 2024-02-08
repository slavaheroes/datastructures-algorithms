# Tip: You can use the type(element) function to check whether an item
# is a list or an integer.
def productSum(array):
    # Write your code here.

    def calculate(arr, level):
        sum = 0

        for elem in arr:
            if type(elem) == list:
                sum += calculate(elem, level+1)
            else:
                sum += elem
        return level*sum
    
    return calculate(array, level=1)


assert productSum([5, 2, [7, -1], 3, [6, [-13, 8], 4]]) == 12