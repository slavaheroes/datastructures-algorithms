class Solution:
    def findMedianSortedArrays(self, nums1: List[int], nums2: List[int]) -> float:
        # O(min(logN, logM)), O(1) space
        total = len(nums1) + len(nums2)
        half = total//2

        if len(nums1) > len(nums2):
            # to ensure that nums1 is always less
            nums1, nums2 = nums2, nums1
        
        l, r = 0, len(nums1)-1
        while True:
            i = (l+r)//2 
            j = half-i-2
            

            left1 = nums1[i] if i>-1 else float('-inf')
            right1 = nums1[i+1] if (i+1) < len(nums1) else float('inf')
            left2 = nums2[j] if j>-1 else float('-inf')
            right2 = nums2[j+1] if (j+1) < len(nums2) else float('inf')

            if left1 <= right2 and left2 <= right1:
                break
            elif left1 > right2:
                r = i - 1
            elif left2 > right1:
                l = i + 1
        
        if total%2==1:
            # odd
            return min(right1, right2)
        return (max(left1, left2) + min(right1, right2)) / 2