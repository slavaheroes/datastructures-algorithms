def findThreeLargestNumbers(array):
    # Write your code here.
    threeLargest = [float('-inf') for _ in range(3)]

    for val in array:
        if val>threeLargest[0]:
            threeLargest.pop(0)
            for i in range(2):
                if val<threeLargest[i]:
                    threeLargest.insert(i, val) 
                    break
            else:
                threeLargest.insert(i+1, val)
            
    return threeLargest