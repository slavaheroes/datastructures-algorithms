export default {
  "pattern": "Complement lookup",
  "problem": "Return two distinct indices whose values sum to the target. The standard problem guarantees one answer; this function returns [] if none exists.",
  "example": "nums = [2, 7, 11, 15], target = 9\nOutput: [0, 1]",
  "insight": "For value x, the only useful partner is target − x. Store earlier values and their indices.",
  "steps": [
    "2 needs 7. Nothing is stored yet; record 2 → 0.",
    "7 needs 2, which is already stored at index 0.",
    "Return [0, 1]. Looking up before inserting prevents using an index twice."
  ],
  "complexity": "O(n) expected time and O(n) extra space.",
  "pitfall": "Return indices, not values. [3, 3] with target 6 is valid; a lone 3 cannot pair with itself."
};
