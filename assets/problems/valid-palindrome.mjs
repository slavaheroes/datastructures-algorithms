export default {
  pattern: 'Skip and compare',
  problem: 'Determine whether a string reads the same forward and backward after ignoring non-alphanumeric characters and letter case.',
  example: "s = 'A man, a plan, a canal: Panama'\nOutput: True\ns = 'race a car'\nOutput: False",
  insight: 'Walk inward from both ends. Skip punctuation and spaces; when both pointers reach letters or digits, compare their lowercase forms. A mismatch is enough to reject the string.',
  steps: [
    'Start left at the first character and right at the last.',
    'Skip a non-alphanumeric left character, otherwise skip a non-alphanumeric right character.',
    'Compare the remaining characters after lowercasing. In the first example, A matches a, then m matches m, and so on.',
    'Move both pointers inward after a match. Return False on a mismatch or True when the pointers meet or cross.'
  ],
  complexity: 'O(n) time and O(1) auxiliary space under the standard ASCII input constraints. Each pointer moves in only one direction.',
  pitfall: 'Empty strings and strings containing only punctuation are palindromes after filtering. Digits count as alphanumeric. The implementation uses Python isalnum and lower directly; standard problem inputs are ASCII.'
};
