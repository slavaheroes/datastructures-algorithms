export default {
  "pattern": "Prefix & suffix",
  "problem": "For each position, return the product of every other value without division, in linear time.",
  "example": "Input: [1, 2, 3, 4]\nOutput: [24, 12, 8, 6]",
  "insight": "Everything except the current value equals the product to its left multiplied by the product to its right.",
  "steps": [
    "Write exclusive left products into the result: [1, 1, 2, 6].",
    "Walk backward with a running suffix product starting at 1.",
    "Multiply each result by its suffix before adding the current value to that suffix, producing [24, 12, 8, 6]."
  ],
  "complexity": "Both solutions take O(n) time. The first stores prefix and suffix arrays, using O(n) extra space. The reference solution uses O(1) auxiliary space excluding output. Arithmetic is treated as constant-cost under the problem constraints.",
  "pitfall": "Update output before incorporating the current value into the prefix or suffix. Zeros and negative numbers work without special cases."
};
