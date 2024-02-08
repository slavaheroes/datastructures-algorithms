def nonConstructibleChange(coins):
    # Write your code here.
    coins.sort()
    
    change = 0
    for coin in coins:

        if coin > (change+1):
            break
        change = change + coin
            
    return change+1

print(nonConstructibleChange([5, 7, 1, 1, 2, 3, 22]))
# answer: 20