def missingNumbers(nums):
    # Write your code here.
    # O(n) | O(1)
    max_num = len(nums)+2
    all_sum = (max_num*(max_num+1))/2
    list_sum = sum(nums)
    avg_val = (all_sum-list_sum)/2

    small_part, large_part = 0, 0

    for i in range(len(nums)):
        if nums[i]<=avg_val:
            small_part += nums[i]
        else:
            large_part += nums[i]

    avg_val = int(avg_val)
    small_missing = (avg_val*(avg_val+1))/2 - small_part
    large_missing = all_sum - (small_part + small_missing + large_part)
    
    return [small_missing, large_missing]


def missingNumbers(nums):
    # Write your code here.
    nums.append(1)
    nums.append(1)

    for i in range(len(nums)-2):
        nums[abs(nums[i])-1] *= -1
            
    output = []  
    for i in range(len(nums)):
        if nums[i]>0:
            output.append(i+1)
            
    return output
