def minimumWaitingTime(queries):
    # Write your code here.
    queries.sort()

    curr_sum = 0
    query_sum = 0
    for i in range(1, len(queries)):
        query_sum += queries[i-1]
        curr_sum = curr_sum + query_sum # sum(queries[:i])
    return curr_sum

assert minimumWaitingTime([3, 2, 1, 2, 6]) == 17