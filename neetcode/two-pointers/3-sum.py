class Solution:
    def threeSum(self, nums: List[int]) -> List[List[int]]:
        # Overall: O(n^2) time, O(1) space excluding answer

        # O(nlog(n))
        nums.sort()

        answer = set() # O(n) space

        # O(n^2) time
        for i in range(len(nums)):
            target = nums[i]
            j, k = 0, len(nums)-1

            while j<k:
                if j==i:
                    j+=1
                elif k==i:
                    k-=1
                else:
                    if nums[j]+nums[k]+nums[i]==0:
                        if nums[i] >= nums[k]:
                            minimal = nums[j]
                            maximal = nums[i]
                            middle = nums[k]
                        elif nums[i] <= nums[j]: 
                            minimal = nums[i]
                            maximal = nums[k]
                            middle = nums[j]
                        
                        answer.add(
                            ( minimal, middle, maximal )
                        )
                        j += 1
                        k -= 1
                    elif nums[j]+nums[k]+nums[i]>0:
                        k -=1
                    else:
                        j += 1
        
        return list(answer)


        
# Reference answer:
class Solution:
    def threeSum(self, nums: List[int]) -> List[List[int]]:
        res = []
        nums.sort()

        for i, a in enumerate(nums):
            if a > 0:
                break

            if i > 0 and a == nums[i - 1]:
                continue

            l, r = i + 1, len(nums) - 1
            while l < r:
                threeSum = a + nums[l] + nums[r]
                if threeSum > 0:
                    r -= 1
                elif threeSum < 0:
                    l += 1
                else:
                    res.append([a, nums[l], nums[r]])
                    l += 1
                    r -= 1
                    while nums[l] == nums[l - 1] and l < r:
                        l += 1

        return res