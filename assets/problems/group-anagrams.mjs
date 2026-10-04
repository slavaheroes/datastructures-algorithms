export default {
  "pattern": "Canonical keys",
  "problem": "Group lowercase English words that are anagrams. Output order does not matter.",
  "example": "['eat', 'tea', 'tan', 'ate', 'nat', 'bat']\n→ [['eat', 'tea', 'ate'], ['tan', 'nat'], ['bat']]",
  "insight": "Anagrams share a 26-entry letter-count vector. Turn it into an immutable tuple to use as a dictionary key.",
  "steps": [
    "Count letters into positions a through z.",
    "eat, tea, and ate share a key: one a, one e, and one t.",
    "Append words to the list for each key and return the lists."
  ],
  "complexity": "O(C + 26n) expected time for n words with C characters total. O(n) extra space in the fixed-alphabet model, including grouped references and keys; input strings are reused.",
  "pitfall": "This implementation assumes lowercase a–z. For arbitrary characters, choose a more general canonical key. Lists cannot be dictionary keys."
};
