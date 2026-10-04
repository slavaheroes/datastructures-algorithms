export default {
  "pattern": "Set membership",
  "problem": "Determine whether any integer appears more than once in an array.",
  "example": "Input: [1, 2, 3, 1]\nOutput: True",
  "insight": "A set remembers what you have seen, so each new value needs only a membership check.",
  "steps": [
    "Begin with an empty set.",
    "Insert 1, 2, and 3 because each is new.",
    "The final 1 is already present; return True. If the loop finishes, return False."
  ],
  "complexity": "O(n) expected time and O(n) extra space, using expected O(1) hash-set operations.",
  "pitfall": "Check before inserting. Empty and single-element arrays have no duplicates."
};
