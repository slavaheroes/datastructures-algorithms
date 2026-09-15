class Solution:
    def mergeTriplets(self, triplets: List[List[int]], target: List[int]) -> bool:
        # O(n) time, O(1) space
        
        isValid = [False, False, False]
        at, bt, ct = target

        for a, b, c in triplets:
            if a>at or b>bt or c>ct:
                continue
            
            if a==at:
                isValid[0] = True
            
            if b==bt:
                isValid[1] = True
            
            if c==ct:
                isValid[2] = True
            
        
        
        return all(isValid)
        