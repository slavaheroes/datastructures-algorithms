export default {
  "pattern": "Sequence starts",
  "problem": "Find the length of the longest consecutive run of integer values. Values need not be adjacent in the input.",
  "example": "Input: [100, 4, 200, 1, 3, 2]\nOutput: 4 (the run 1, 2, 3, 4)",
  "insight": "Start counting only where the predecessor is missing. Each number then participates in one forward scan, despite the nested loop.",
  "steps": [
    "Put values into a set, removing duplicates.",
    "4, 3, and 2 have predecessors, so skip starting scans there.",
    "1 starts a run through 2, 3, and 4; 100 and 200 start one-element runs. The maximum is 4."
  ],
  "complexity": "O(n) expected time and O(n) extra space. Inner scans visit each distinct value at most once.",
  "pitfall": "Iterate over the set, not the input: duplicate starts could repeat long scans. An empty array returns 0."
};
