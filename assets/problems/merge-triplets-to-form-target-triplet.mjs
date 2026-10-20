export default {
  pattern: 'Discard overshoots, then cover each target coordinate',
  problem: 'A merge replaces a triplet with the coordinate-wise maximum of two triplets. Decide whether repeated merges can produce target = [a,b,c]. Triplets may be selected independently; unused ones do not matter.',
  example: 'triplets = [[2,5,3],[1,8,4],[1,7,5]], target = [2,7,5]\nDiscard [1,8,4] because 8 exceeds target’s second coordinate.\nmax([2,5,3], [1,7,5]) = [2,7,5]\nOutput: True',
  insight: 'Maximum can only increase coordinates. A triplet with any coordinate beyond the target can never participate in a successful merge. Among the safe triplets, each target coordinate only needs one exact witness; merging all useful witnesses cannot overshoot.',
  steps: ['Unpack the three target coordinates and initialize isValid = [False, False, False].', 'Skip any triplet with a > target[0], b > target[1], or c > target[2].', 'For each remaining triplet, mark every coordinate that exactly equals its target value.', 'Return all(isValid). The source scans every triplet even if all three flags become True early.'],
  complexity: 'O(n) time for n triplets and O(1) auxiliary space: three target values and three flags. The source does not mutate triplets or target.',
  pitfall: 'A coordinate match on an unsafe triplet does not count. For example, matching the first coordinate cannot compensate for exceeding the second. The three flags may come from different safe triplets; they do not have to be supplied by one existing triplet. Inputs are assumed to have exactly three coordinates.'
};
