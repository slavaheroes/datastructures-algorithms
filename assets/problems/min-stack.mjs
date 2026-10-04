export default {
  "pattern": "Prefix minimums",
  "problem": "Implement push, pop, top, and getMin for a stack. Each operation should take constant time under the usual dynamic-array model.",
  "example": "push(-2), push(0), push(-3)\ngetMin() -> -3\npop()\ntop() -> 0\ngetMin() -> -2",
  "insight": "Keep two stacks at the same depth. The value stack stores elements; the minimum stack stores the smallest value seen at every depth. Popping restores the previous minimum automatically.",
  "steps": [
    "Push -2: values = [-2], minimums = [-2].",
    "Push 0: values = [-2, 0], minimums = [-2, -2].",
    "Push -3: values = [-2, 0, -3], minimums = [-2, -2, -3]. getMin reads -3.",
    "Pop both stacks. The remaining top value is 0 and the remaining minimum is -2."
  ],
  "complexity": "O(1) amortized time for push and pop with Python lists, O(1) time for top and getMin, and O(n) extra space for n stored values.",
  "pitfall": "Record a minimum for every push, including duplicates. Pop both stacks together. The problem guarantees that pop, top, and getMin are called only on a nonempty stack."
};
