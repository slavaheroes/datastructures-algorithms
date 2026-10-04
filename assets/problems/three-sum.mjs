export default {
  pattern: 'Sorted anchor and opposing pointers',
  problem: 'Return all unique triplets of values that sum to zero, using three distinct indices. Output order does not matter.',
  example: 'nums = [-1, 0, 1, 2, -1, -4]\nOutput: [[-1, -1, 2], [-1, 0, 1]]',
  insight: 'The included reference solution sorts the array and fixes one value at a time. Search the remaining suffix with two pointers, moving left to increase the sum and right to decrease it. Skip repeated anchors and repeated left values to avoid duplicate triplets.',
  steps: [
    'Sort the example into [-4, -1, -1, 0, 1, 2]. The anchor -4 has no matching pair.',
    'Fix the first -1. The suffix pointers find -1 + -1 + 2 = 0; record [-1, -1, 2].',
    'Move both pointers inward. The next match is -1 + 0 + 1 = 0; record [-1, 0, 1].',
    'Skip the repeated -1 anchor. Stop when the anchor is positive because the remaining values cannot bring the sum back to zero.'
  ],
  complexity: 'Both versions scan O(n²) pairs after O(n log n) sorting. The reference scan uses O(1) working space, but Python sorting can use O(n) temporary space; result storage is O(k) for k triplets. The first version also stores triplets in a set, using O(k) space.',
  pitfall: 'Both versions sort the input in place. The first version searches the full array for each anchor and skips that anchor index; its triplet assembly handles only anchors at or outside the pair endpoints. The explanation above follows the included reference version, which searches only the suffix and skips duplicates explicitly.'
};
