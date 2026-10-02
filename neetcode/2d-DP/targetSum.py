class Solution:
    def findTargetSumWays(self, nums: List[int], target: int) -> int:
        # S = sum(nums)
        # Time: n*S
        # Space: S

        memo = {0: 1}
        
        for i in range(len(nums)):
            temp = {}

            for k, v in memo.items():
                for n in [nums[i], -nums[i]]:
                    nk = k + n
                    temp[nk] = temp.get(nk, 0) + v

            memo = temp
        
        return memo[target] if target in memo else 0
        