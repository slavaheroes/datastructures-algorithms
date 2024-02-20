def bestSeat(seats):
    # Write your code here.
    start_max = 0
    end_max = 0

    current_start = 0
    for i in range(1, len(seats)):
        if seats[i]==1:
            if (i-current_start)>(end_max-start_max):
                start_max, end_max = current_start, i

            current_start = i
            
    if (start_max+1+end_max-1)//2 < 1:
        return -1

    return (start_max+1+end_max-1)//2
