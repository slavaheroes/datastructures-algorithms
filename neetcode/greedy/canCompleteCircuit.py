class Solution:
    def canCompleteCircuit(self, gas: List[int], cost: List[int]) -> int:
        # O(n) time, O(1) space

        sumGas, sumCost = 0, 0
        tank = 0
        start_pos = -1

        for i in range(len(gas)):
            if tank == 0:
                start_pos = i

            tank += gas[i]-cost[i]
            if tank < 0:
                tank = 0
            sumGas += gas[i]
            sumCost += cost[i]
        
        if sumGas < sumCost:
            return -1
        return start_pos
        