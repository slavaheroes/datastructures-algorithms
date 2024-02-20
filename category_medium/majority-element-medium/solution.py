def majorityElement(array):
    # Write your code here.
    # O(n) | O(1)
    maj_elem = array[0]
    count = 1
    for i in range(1, len(array)):
        if array[i] == maj_elem:
            count += 1
        else:
            count -= 1

        if count < 0:
            count = 1
            maj_elem = array[i]

        
    return maj_elem


assert majorityElement([3, 2, 3]) == 3