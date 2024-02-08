def optimalFreelancing(jobs):
    # Write your code here.
    # sort
    if len(jobs)==0:
        return 0

    jobs = sorted(jobs, key=lambda d: -d['payment'], reverse=False)
    days = [0 for _ in range(7)]
    for job in jobs:
        deadline = job['deadline']
        payment = job['payment']
        for d in range(deadline-1, -1, -1):
            if d>6:
                continue
            if days[d] == 0:
                days[d] = payment
                break
    return sum(days) 

assert optimalFreelancing([{'deadline': 1, 'payment': 1},
                           {'deadline': 2, 'payment': 1},
                           {'deadline': 2, 'payment': 2}]) == 3