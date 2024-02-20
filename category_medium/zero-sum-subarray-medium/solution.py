def zeroSumSubarray(nums):
    # Write your code here.
    # O(n^2) | O(n)
    
    running_sum = {}

    for i in range(len(nums)):
        running_sum[i] = 0 #nums[i]
        for j in range(i+1):
            running_sum[j] += nums[i]
            if running_sum[j]==0:
                print(running_sum)
                return True
        print(running_sum)
                
    return False

def zeroSumSubarray(nums):
    # Write your code here.
    # O(n) | O(n)
    running_sum = [0 for _ in range(len(nums))]

    for i in range(len(nums)):
        if nums[i]==0:
            return True
        running_sum[i] = nums[i] + running_sum[i-1]

    duplicates = set()
    for rn in running_sum:
        
        if rn in duplicates or rn==0:
            return True
        else:
            duplicates.add(rn)

    
    return False
