# O(n) time and space
# Solution without division

class Solution:
    def productExceptSelf(self, nums: List[int]) -> List[int]:
        prefix = [1]
        suffix = [1]


        for i in range(len(nums)):
            prefix.append(prefix[i]*nums[i])
        
        for i in range(len(nums)-1, 0, -1):
            suffix.append(suffix[len(nums)-1-i]*nums[i])
        
        res = []

        for i in range(len(nums)):
            res.append(
                prefix[i] * suffix[len(nums)-1-i]
            )

        return res

# Reference solution
class Solution:
    def productExceptSelf(self, nums: List[int]) -> List[int]:
        res = [1] * (len(nums))

        prefix = 1
        for i in range(len(nums)):
            res[i] = prefix
            prefix *= nums[i]
        postfix = 1
        for i in range(len(nums) - 1, -1, -1):
            res[i] *= postfix
            postfix *= nums[i]
        return res