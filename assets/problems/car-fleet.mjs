export default {
  "pattern": "Sorted arrival times",
  "problem": "Cars move toward a target and cannot pass. A car catching another joins its fleet and travels at that fleet's speed. Count fleets arriving at the target, including cars that meet exactly there.",
  "example": "target = 12\nposition = [10, 8, 0, 5, 3]\nspeed = [2, 4, 1, 1, 3]\nOutput: 3",
  "insight": "Sort cars from closest to farthest from the target and compute each car's free arrival time. A car behind joins the fleet ahead if its arrival time is no larger. A larger time starts a new fleet. The source includes both a running-time version and a stack version.",
  "steps": [
    "Sort (position, speed) pairs in descending position order: (10,2), (8,4), (5,1), (3,3), (0,1).",
    "Arrival times are 1, 1, 7, 3, and 12. The car at 8 merges with the fleet at 10 because 1 <= 1.",
    "Time 7 creates a second fleet. Time 3 merges with it. Time 12 creates the third fleet.",
    "The first solution tracks prevTime and fleets. The second pushes each arrival time and pops it when it is <= the previous fleet's time."
  ],
  "complexity": "Both versions take O(n log n) time for sorting and O(n) extra space for the copied pairs. The second version also uses an O(n) stack.",
  "pitfall": "Process cars from highest position to lowest. Equality also merges fleets. The first version assumes at least one car; the stack version returns 0 for an empty input. Standard inputs have distinct positions, positive speeds, and positions before the target."
};
