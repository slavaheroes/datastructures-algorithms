export default {
  "pattern": "Frequency counting",
  "problem": "Determine whether two strings have exactly the same characters with the same multiplicities.",
  "example": "'anagram', 'nagaram' → True\n'rat', 'car' → False",
  "insight": "Order does not matter; counts do. A frequency map is a fingerprint of the characters.",
  "steps": [
    "Count each string's characters with Counter.",
    "Both anagram and nagaram contain three a characters and one each of n, g, r, and m.",
    "Compare the frequency maps; every count must agree."
  ],
  "complexity": "O(n + m) expected time and O(k) extra space for k distinct characters. With a fixed alphabet, space is O(1).",
  "pitfall": "Sets lose multiplicity: 'aab' and 'abb' are not anagrams. This implementation matches characters exactly, including case."
};
