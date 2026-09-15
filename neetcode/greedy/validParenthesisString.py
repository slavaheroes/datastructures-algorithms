class Solution:
    def checkValidString(self, s: str) -> bool:
        # O(n) time and space
        
        stars = []
        stack = []

        for i, ch in enumerate(s):
            if ch=="*":
                stars.append(i)
            elif ch=="(":
                stack.append(i)
            else:
                # ) 
                if stack:
                    stack.pop()
                elif stars:
                    stars.pop()
                else:
                    return False

        while stack:
            if (not stars) or (stack.pop() > stars.pop()):
                return False
            
        
        return True

# Reference solution
class Solution:
    def checkValidString(self, s: str) -> bool:
        # O(n) time, O(1) space
        count1 = 0
        count2 = 0

        for i, ch in enumerate(s):
            if ch=='(':
                count1 += 1
                count2 += 1
            elif ch==')':
                count1 -= 1
                count2 -= 1
            else:
                count1 += 1
                count2 -= 1

            if count2<0:
                count2=0
        
            if count1<0:
                return False
        
        return count2==0