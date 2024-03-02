# Merging Linked Lists 

You're given two Linked Lists of potentially unequal length. These Linked Lists potentially merge at a shared intersection node. Write a function that returns the intersection node or returns None / null if there is no intersection.

Each LinkedList node has an integer value as well as a next node pointing to the next node in the list or to None / null if it's the tail of the list.

Note: Your function should return an existing node. It should not modify either Linked List, and it should not create any new Linked Lists.

### Sample Input
> linkedListone = 2 → 3 → 1 →> 4

> LinkedListTwo =8 -> 7->1-> 4

### Sample Output
> 1 → 4 // The lists intersect at the node with value 1