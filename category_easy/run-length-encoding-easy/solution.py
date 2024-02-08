def runLengthEncoding(string):
    # Write your code here.
    if len(string)==1:
        return '1' + string[0]
    
    output = ""
    
    curr_count = 1
    for i in range(0, len(string)-1):
        if curr_count == 10:
            output += '9' + string[i]
            curr_count = 1
                
        if string[i]!=string[i+1]:
            output += str(curr_count) + string[i]
            curr_count = 1
        else:
            curr_count += 1
            
    # run for the last letter
    while curr_count > 9:
        output = output + '9' + string[i+1]
        curr_count -= 9
        
    output = output + str(curr_count) + string[i+1]
    
    
    return output
            
assert runLengthEncoding("AAAAAAAAAAAAABBCCCCDD") == "9A4A2B4C2D"