def zeroSumSubarray(nums):
    # Write your code here.
    # O(n^2) | O(n)
    
    running_sum = {}

    for i in range(len(nums)):
        running_sum[i] = 0 #nums[i]
        for j in range(i+1):
            running_sum[j] += nums[i]
            if running_sum[j]==0:
                return True                
    return False
