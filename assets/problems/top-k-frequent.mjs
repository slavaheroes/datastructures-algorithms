export default {
  "pattern": "Frequency buckets",
  "problem": "Return the k most frequent distinct integers. The standard problem guarantees a unique set of answers; output order does not matter.",
  "example": "nums = [1, 1, 1, 2, 2, 3], k = 2\nOutput: [1, 2]",
  "insight": "Frequency never exceeds input length. Use frequency as a bucket index instead of sorting values.",
  "steps": [
    "Count occurrences: 1 → 3, 2 → 2, 3 → 1.",
    "Place 1 in bucket 3, 2 in bucket 2, and 3 in bucket 1.",
    "Scan buckets from high to low, stopping after collecting k values."
  ],
  "complexity": "Bucket solution: O(n) expected time and O(n) space. Heap solution: O(n log k) time for k >= 2, O(n) for k = 1, and O(n) space including the frequency map.",
  "pitfall": "The bucket solution assumes the standard constraint 1 <= k <= the number of distinct values. Stop inside the bucket loop to return exactly k elements."
};
