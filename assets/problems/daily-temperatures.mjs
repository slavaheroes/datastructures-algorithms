export default {
  "pattern": "Monotonic stack",
  "problem": "For each daily temperature, return how many days you must wait for a strictly warmer day. Return 0 where no warmer day follows.",
  "example": "temperatures = [73, 74, 75, 71, 69, 72, 76, 73]\nOutput: [1, 1, 4, 2, 1, 1, 0, 0]",
  "insight": "Keep unresolved (temperature, index) pairs in a stack with non-increasing temperatures. A warmer day resolves every colder pair at the top, so you never need to search forward from each day.",
  "steps": [
    "Initialize the result with zeros. Day 0 pushes (73, 0).",
    "Day 1 is 74: pop (73, 0) and set result[0] = 1 - 0. Push (74, 1). Day 2 similarly resolves day 1.",
    "Days 3 and 4 push 71 and 69. Day 5 at 72 pops both: day 4 waits 1 day and day 3 waits 2 days.",
    "Day 6 at 76 resolves day 5 and day 2. Days 6 and 7 stay unresolved, so their answers remain 0."
  ],
  "complexity": "O(n) time and O(n) extra space. Each day is pushed once and popped at most once, even though the code contains a nested while loop.",
  "pitfall": "An equal temperature is not warmer; the comparison is strictly >. Store indices as well as temperatures so each answer is the difference between day indices."
};
