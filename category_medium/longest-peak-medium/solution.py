def longestPeak(array):
    # Write your code here.
    # O(n) | O(1) 
    start_peak = None
    end_peak = None
    max_len = 0
    
    for i in range(len(array)-1):
        if array[i+1]>array[i]:
            if start_peak is None and end_peak is None:
                start_peak = i
            elif end_peak is not None:
                max_len = max(max_len, end_peak-start_peak+1)
                start_peak, end_peak = i, None
        elif array[i+1]==array[i]:
            if end_peak is not None and start_peak is not None:
                max_len = max(max_len, end_peak-start_peak+1)
            start_peak, end_peak = None, None
            
        else:
            if start_peak is not None and end_peak is None:
                end_peak = i + 1
            elif start_peak is not None and end_peak is not None:
                end_peak += 1
                
            if i==len(array)-2 and end_peak is not None:
                max_len = max(max_len, end_peak-start_peak+1)
        
    return max_len
