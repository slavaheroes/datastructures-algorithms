class Solution:
    def carFleet(self, target: int, position: List[int], speed: List[int]) -> int:
        # O(nlogn) time 
        # # and O(n) space because of pos_speed 
        pos_speed = [(pos, spd) for pos, spd in zip(position, speed)]
        pos_speed.sort(reverse=True)

        prevTime = (target - pos_speed[0][0]) / pos_speed[0][1]
        
        fleets = 1
        for i in range(1, len(pos_speed)):
            pos, spd = pos_speed[i]
            t = (target-pos) / spd

            if t > prevTime:
                fleets += 1
                prevTime = t


        return fleets     
    
    
# Solution with Stack
class Solution:
    def carFleet(self, target: int, position: List[int], speed: List[int]) -> int:
        pair = [(p, s) for p, s in zip(position, speed)]
        pair.sort(reverse=True)
        stack = []
        for p, s in pair:  # Reverse Sorted Order
            stack.append((target - p) / s)
            if len(stack) >= 2 and stack[-1] <= stack[-2]:
                stack.pop()
        return len(stack)