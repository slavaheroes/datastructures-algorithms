def arrayOfProducts(array):
    # Write your code here.
    # O(n) | O(1)
    allProd = 1
    num_zeros = 0
    for i in array:
        if i==0:
            num_zeros+=1
        else:
            allProd *= i
    
    if num_zeros>1:
        allProd = 0
        
    for i in range(len(array)):
        if array[i] != 0:
            if num_zeros==1:
                array[i]=0
            else:
                array[i] = allProd/array[i]
        else:
            if num_zeros==1:
                array[i] = allProd
          
    return array
