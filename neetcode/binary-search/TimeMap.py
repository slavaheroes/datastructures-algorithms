class TimeMap:

    def __init__(self):
        self.data = {}
        

    def set(self, key: str, value: str, timestamp: int) -> None:
        # O(1) time
        if not key in self.data:
            self.data[key] = []
        self.data[key].append( (timestamp, value) ) 
        

    def get(self, key: str, timestamp: int) -> str:
        # O(log n) time
        # n is the number of timestamps for the key
        
        if not key in self.data:
            return ""
        
        vals = self.data[key]
        l, r = 0, len(vals) - 1
        ans = ""
        while r>=l:
            mid = (r+l) // 2
            if vals[mid][0] <= timestamp:
                ans = vals[mid][1]
                l = mid + 1
            else:
                r = mid - 1
        
        return ans
        
