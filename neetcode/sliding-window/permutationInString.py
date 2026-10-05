class Solution:
    def checkInclusion(self, s1: str, s2: str) -> bool:
        # Lowercase English letters; compare two fixed-size count arrays.
        if len(s1) > len(s2):
            return False
        need, window = [0] * 26, [0] * 26
        for ch in s1:
            need[ord(ch) - ord('a')] += 1
        left = 0
        for right, ch in enumerate(s2):
            window[ord(ch) - ord('a')] += 1
            if right - left + 1 > len(s1):
                window[ord(s2[left]) - ord('a')] -= 1
                left += 1
            if right - left + 1 == len(s1) and window == need:
                return True
        return len(s1) == 0
