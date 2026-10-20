export default {
  pattern: 'Sort meetings and check consecutive overlaps',
  problem: 'Decide whether one person can attend every meeting. Each Interval object has start and end fields. Finishing a meeting exactly when another begins is allowed.',
  example: 'intervals = [(0,30),(5,10),(15,20)]\nThe meeting starting at 5 begins before the first one ends at 30.\nOutput: False\n\n[(0,5),(5,10)] → True',
  insight: 'After sorting by start, any conflict appears between neighboring meetings before the scan can accept the schedule. If every previous meeting finishes by the next start, the entire order is compatible.',
  steps: ['Sort the supplied Interval objects using x.start as the key.', 'Starting at index 1, compare prev.end with curr.start.', 'Return False as soon as prev.end > curr.start. Otherwise continue and return True after the loop.', 'An empty list or one meeting has no conflicting pair, so the source returns True.'],
  complexity: 'O(n log(n + 1)) time for sorting, followed by O(n) comparisons. The scan has O(1) state, but Python sorting can allocate O(n) temporary storage, so the full implementation has O(n) auxiliary space in the worst case.',
  pitfall: 'The saved source expects Interval objects, not [start,end] lists, and sorts the input in place. It assumes valid meeting ranges. Use a strict > comparison: replacing it with >= would incorrectly reject meetings that touch at a boundary.'
};
