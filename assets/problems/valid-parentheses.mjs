export default {
  "pattern": "Matching pairs",
  "problem": "Given a string containing only (), [], and {}, determine whether every bracket closes the most recently opened matching bracket.",
  "example": "s = '([])'\nOutput: True\ns = '([)]'\nOutput: False",
  "insight": "The last bracket opened must be the first closed. A stack preserves this order; a map tells you which opening bracket each closing bracket needs.",
  "steps": [
    "Read (: push it. Read [: push it above (.",
    "Read ]: pop [ and check that they match.",
    "Read ): pop ( and check the match. Return True because the stack is empty.",
    "Return False immediately if a closing bracket finds an empty stack or the wrong opening bracket. Unclosed brackets also make the final result False."
  ],
  "complexity": "O(n) time and O(n) extra space for a string of n brackets. Each bracket is pushed or popped at most once.",
  "pitfall": "Counting opening and closing brackets is insufficient: ([)] has balanced counts but the wrong order. This implementation assumes the input contains only the six bracket characters."
};
