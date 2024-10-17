'''
Imagine you have a set of cities that are laid out in a circle, connected by a circular road that runs clockwise.
Each city has a gas station that provides gallons of fuel, and each city is some distance away from the next city.

You have a car that can drive some number of miles per gallon of fuel, and your goal is to pick a starting city such that
you can fill up your car with that city's fuel, drive to the next city, refill up your car with that city's fuel, drive to the next city,
and so on and so forth until you return back to the starting city with 0 or more gallons of fuel left.

You will be given an array of the amount of fuel that each city provides, and the distance to the next city.
Your fuel tank always starts out empty, and you have a fixed number of miles per gallon.

You can assume there will only be one valid starting city, and you will be give at least two cities.
Write a function that returns the index of the starting city that will allow you to travel around the whole city and back to the starting city.

Sample Input:
    distances = [5, 25, 15, 10, 15]
    fuel = [1, 2, 1, 0, 3]
    mpg = 10
Sample Output:
    4
'''

# def validStartingCity(distances, fuel, mpg):
#     # Write your code here.
#     # Time O(n^2) | Space O(1)
#     distances = [i/mpg for i in distances]
#     fuel = [fuel[i]-distances[i] for i in range(len(fuel))]

#     for i in range(len(fuel)):
#         if fuel[i]<0:
#             continue

#         curr_sum = 0.0

#         for j in range(i, len(fuel)):
#             curr_sum += fuel[j]
#             if curr_sum < 0.0 and abs(curr_sum)>1e-8:
#                 break
#         else:
#             for j in range(0, i):
#                 curr_sum += fuel[j]
#                 if curr_sum < 0.0 and abs(curr_sum)>1e-8:
#                     break
#             else:
#                 return i
#     return -1


def validStartingCity(distances, fuel, mpg):
    # Write your code here.
    # O(n) | O(1)
    minGas = 0
    minCity = 0
    currGas = 0

    for i in range(1, len(fuel)):
        currGas += fuel[i - 1]
        currGas -= distances[i - 1] / mpg

        if currGas < minGas and abs(currGas - minGas) > 1e-8:
            minCity = i
            minGas = currGas

    return minCity


import unittest


class Test(unittest.TestCase):
    def test_case_1(self):
        self.assertEqual(validStartingCity([5, 25, 15, 10, 15], [1, 2, 1, 0, 3], 10), 4)


if __name__ == '__main__':
    unittest.main()
