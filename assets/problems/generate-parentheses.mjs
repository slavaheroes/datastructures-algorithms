export default {
  "pattern": "Backtracking with a stack",
  "problem": "Generate every valid string containing n pairs of parentheses. The current list of characters acts as a stack while exploring choices.",
  "example": "n = 3\nOutput: ['((()))', '(()())', '(())()', '()(())', '()()()']",
  "insight": "Build a string one character at a time, exploring ( before ). Reject a branch as soon as it opens more than n pairs or closes more pairs than it has opened. Pop each choice to restore the prefix before exploring its sibling.",
  "steps": [
    "Start with curr = [], n_open = 0, and n_closed = 0.",
    "Append ( and recurse. For n = 3, the first complete valid branch is ((())).",
    "Every recursive call first rejects n_open > n or n_closed > n_open. A valid prefix of length 2*n is joined into a result string.",
    "Pop the character after returning, then try ). Continue until all valid branches have been collected."
  ],
  "complexity": "Let C_n be the nth Catalan number, the number of valid strings. O(n*C_n) time and O(n) auxiliary space for the current prefix and recursion; O(n*C_n) space including output. Since C_n is Θ(4^n / n^(3/2)), output size is Θ(4^n / sqrt(n)).",
  "pitfall": "This existing implementation tries both characters and prunes invalid choices inside the recursive call. Always pop after each recursive branch. The source is kept in its original backtracking directory, although this lesson belongs to Stacks in NeetCode 150."
};
