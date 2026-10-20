import {mountNonOverlappingIntervals} from '../visualizations/interval-lessons.mjs';

export default {
  pattern: 'On overlap, retain the earlier ending interval',
  problem: 'Return the fewest intervals to remove so the remaining intervals do not overlap. Here an interval ending at the next interval’s start is compatible with it.',
  example: 'intervals = [[1,2],[2,3],[3,4],[1,3]]\nRemove [1,3]; the remaining three intervals only touch.\nOutput: 1',
  insight: 'The eraseOverlapIntervals version sorts by start and keeps the end of the current retained candidate. An overlap requires one removal. Keeping whichever candidate ends earlier leaves at least as much room for every later interval, so choosing it cannot make the remaining schedule worse.',
  steps: ['Sort intervals. Initialize res = 0 and curr_end = intervals[0][1]. The source also prints the sorted list.', 'If curr_end > the next start, count one removal and set curr_end to the smaller of the two ends.', 'If there is no overlap, retain the next interval and replace curr_end with its end.', 'Return the removal count. The visualization tracks concrete kept and removed intervals; the Python reference stores only the count and retained end.'],
  complexity: 'O(n log(n + 1)) time, plus O(n) debug output from print(intervals). The greedy scan uses O(1) auxiliary state, while Python’s in-place sort can use O(n) temporary space. The source’s O(1) space comment omits sorting storage.',
  pitfall: 'This saved file first contains a minMeetingRooms implementation that computes a different result using a heap. The following Solution class defines eraseOverlapIntervals; that reference is the algorithm explained and visualized here. Both versions remain visible in the unchanged source. eraseOverlapIntervals assumes nonempty input and sorts it in place. Strict > makes touching endpoints compatible; this differs from Merge Intervals.'
};

export const mountVisualization = mountNonOverlappingIntervals;
