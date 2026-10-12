import {mountTaskScheduler} from '../visualizations/heap-lessons.mjs';

export const mountVisualization = mountTaskScheduler;

export default {
  pattern: 'Ready max-heap and cooldown queue',
  problem: 'Schedule uppercase-letter tasks on one CPU. Each task takes one interval, and identical letters must have at least n intervals between executions. Return the shortest total time, including idle intervals.',
  example: 'tasks = ["A","A","A","B","B","B"], n = 2\nOne schedule: B, A, idle, B, A, idle, B, A\nOutput: 8',
  insight: 'Choose the ready task with the largest remaining count so frequent tasks start cooling down early. The source stores (remaining count, letter) tuples in a max-heap and records unfinished tasks in a FIFO cooldown queue. Equal counts favor the lexicographically larger letter. When no task is ready, it jumps directly to the earliest cooldown release instead of iterating through idle intervals.',
  steps: ['Count each letter and heapify (frequency, task) pairs with heapify_max. Start time at 0.', 'If the ready heap is nonempty, pop its largest tuple, execute that task, and decrement its remaining count. Append (time, remaining count, task) to cooldowns only if more executions remain.', 'After that execution, return the front cooldown entry to the heap when time − its recorded time ≥ n. Then increment time; the released task can execute at the next interval.', 'If the ready heap is empty, remove the earliest cooldown entry, put it back in the heap, and set time to its recorded execution time + n + 1. Continue until both collections are empty.'],
  complexity: 'O(T) time and O(1) auxiliary space for T tasks drawn from the fixed alphabet A–Z. The heap and cooldown queue each contain at most 26 task types, and time jumps skip idle stretches. With A arbitrary task types, the corresponding bounds are O(T log(A + 1)) time and O(A) space.',
  pitfall: 'The queue stores the time a task last executed, not its next allowed time. A task executed at t becomes available at t + n + 1. The visualization follows the source’s tuple tie-breaking and time jumps; other optimal schedules can have a different letter order. The platform supplies heapq and deque.'
};
