'''
A company has hired N interns to each join one of N different teams. Each intern has ranked their preferences for which teams they wish to join, and each team has ranked their preferences for which interns they prefer.
Given these preferences, assign 1 intern to each team. These assignments should be "stable," meaning that there is no unmatched pair of an intern and a team such that both that intern and that team would prefer they be matched with each other.
In the case there are multiple valid stable matchings, the solution that is most optimal for the interns should be chosen (i.e. every intern should be matched with the best team possible for them).
Your function should take in 2 2-dimensional lists, one for interns and one for teams. Each inner list represents a single intern or team's preferences, ranked from most preferable to least preferable.
These lists will always be of length N, with integers as elements. 
Each of these integers corresponds to the index of the team/intern being ranked. 
Your function should return a 2-dimensional list of matchings in no particular order. 
Each matching should be in the format [internindex, teamindex].
'''

def stableInternships(interns, teams):
    # Write your code here.
    ans = {} # team: intern
    curr_choices = [0 for _ in range(len(interns))]
    free_interns = [i for i in range(len(interns))]
    teams = [ {team[t]: t for t in range(len(team))} for team in teams]

    
    while len(ans)!=len(teams):
        curr_i = free_interns.pop(0)
        choice = interns[curr_i][ curr_choices[curr_i] ]

        if choice in ans:
            # conflict
            prev_intern = ans[choice]
            
            if teams[choice][curr_i] > teams[choice][prev_intern]:
                curr_choices[curr_i] += 1
                free_interns.append(curr_i)
            else:
                free_interns.append(prev_intern)
                ans[choice] = curr_i
            
        else:
            ans[choice] = curr_i
            curr_choices[curr_i] += 1
    
    
    ans = [ [v, k] for k, v in ans.items()]
    
    return ans

# Time complexity: O(n^2)
# Space complexity: O(n)

