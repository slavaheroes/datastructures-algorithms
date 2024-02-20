def mergeOverlappingIntervals(intervals):
    # Write your code here.
    # O(nlogn) | O(1)
    intervals.sort(key=lambda x: x[0])
    
    i = 0
    while i<len(intervals)-1:
        a, b = intervals[i]
        c, d = intervals[i+1]

        if b>=c:
            intervals[i][1] = max(b, d)
            intervals.pop(i+1)
        else:
            i += 1
    
    return intervals
