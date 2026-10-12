export default {
  pattern: 'Find a row, then search within it',
  problem: 'Return whether target occurs in a nonempty rectangular matrix. Each row is sorted, and the first value of every row is greater than the last value of the preceding row.',
  example: 'matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3\nOutput: True',
  insight: 'A row’s first and last values tell you whether the target could be in that row. Binary search those row ranges, then binary search the selected row’s columns.',
  steps: ['Search rows with row_t and row_b. Compute mid and compare target with matrix[mid][0] and matrix[mid][-1].', 'Move upward when target is smaller than the row’s first value; move downward when it is larger than the row’s last value. Break when the target is within the row’s bounds.', 'Binary search matrix[mid] with l and r. Return True on an exact match.', 'Return False when the column search ends without a match.'],
  complexity: 'O(log m + log n) time and O(1) auxiliary space for m rows and n columns.',
  pitfall: 'The source does not check for an empty matrix or empty rows. If no row range contains target, it still searches the last inspected row instead of returning immediately; under the stated ordering guarantees that search returns False.'
};
