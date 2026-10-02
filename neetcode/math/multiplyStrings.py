class Solution:
    def multiply(self, num1: str, num2: str) -> str:
        # Space: O(N+M)
        # Time: O(N*M)

        if "0" in [num1, num2]:
            return "0"

        n = len(num1)
        m = len(num2)

        ans = [0]*(n+m)

        for i in range(n-1, -1, -1):

            idx = n+m-1 - (n-1-i)
            digit_1 = int(num1[i])
            add_carry = 0
            mult_carry = 0

            for j in range(m-1, -1, -1):
                digit_2 = int(num2[j])
                res = digit_1 * digit_2 + mult_carry
                
                mult_digit = res % 10 
                mult_carry = res // 10

                ans[idx] = ans[idx]+mult_digit+add_carry
                add_carry = ans[idx]//10
                ans[idx] = ans[idx]%10

                idx -= 1
            
            ans[idx] = mult_carry + add_carry            
            
        for x in range(len(ans)):
            if ans[x]!=0:
                break
        
        return "".join([str(ans[i]) for i in range(x, len(ans))])


# Reference solution
class Solution:
    def multiply(self, num1: str, num2: str) -> str:
        # Reference solution: 
        
        # Space: O(N+M)
        # Time: O(N*M)

        n = len(num1)
        m = len(num2)

        ans = [0] * (n + m)

        for i in range(n - 1, -1, -1):
            for j in range(m - 1, -1, -1):
                digit_1 = int(num1[i])
                digit_2 = int(num2[j])

                p1 = i + j
                p2 = i + j + 1

                total = digit_1 * digit_2 + ans[p2]

                ans[p2] = total % 10
                ans[p1] += total // 10
        
        for x in range(len(ans)):
            if ans[x]!=0:
                break
        
        return "".join([str(ans[i]) for i in range(x, len(ans))])
        