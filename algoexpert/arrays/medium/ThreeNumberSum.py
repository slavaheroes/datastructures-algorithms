def threeNumberSum(array, targetSum):
    # Write your code here.
    output = set()
    hash_t = {array[i]: i for i in range(len(array))}
    
    for i in range(len(array)):
        for j in range(i+1, len(array)):
            diff = targetSum - array[i] - array[j]
            if diff in hash_t and hash_t[diff] != i and hash_t[diff] != j:
                output.add(
                    tuple(sorted([array[i], array[j], diff]))
                )
                
    output = list(output)
    output.sort(key = lambda x: (x[0], x[1], x[2]))  
    
    return output