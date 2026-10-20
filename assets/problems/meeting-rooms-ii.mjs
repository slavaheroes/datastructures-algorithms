import {mountMeetingRoomsII} from '../visualizations/interval-lessons.mjs';

export default {
  pattern: 'Reuse the earliest finishing room or sweep time events',
  problem: 'Return the minimum number of rooms needed to hold all meetings. A room can host another meeting at the exact time its previous meeting ends. The Python versions take Interval objects.',
  example: 'intervals = [(0,30),(5,10),(15,20)]\nRoom 1: (0,30)\nRoom 2: (5,10), then (15,20)\nOutput: 2',
  insight: 'The first version keeps one heap ending time per allocated room. If the earliest stored end is no later than the next start, reuse that room; otherwise allocate another. Its heap length never decreases across a whole meeting assignment, so the final length is the maximum room requirement. The reference counts starts and ends at each time and takes the maximum running count.',
  steps: ['Heap version: sort by start and initialize an empty min-heap.', 'For each meeting, pop one earliest ending time when start >= heap[0], then push this meeting’s end. Popping only one is sufficient because each new meeting uses exactly one room.', 'Return len(heap). Endings for other idle rooms may remain; the heap tracks allocated rooms rather than only active meetings.', 'Reference sweep: add +1 at each start and −1 at each end in a defaultdict. Sort its distinct times, add each combined delta to prev, and update the maximum res.', 'Return the maximum running count. Combining simultaneous events lets an ending meeting and a starting meeting use the same room.'],
  complexity: 'Both stored versions take O(n log(n + 1)) time and O(n) auxiliary space. The heap can contain n room endings; the sweep map has at most 2n times. Python sorting also needs up to O(n) temporary storage.',
  pitfall: 'The heap version sorts intervals in place; the sweep version does not. The source assumes valid positive-duration meetings and a judge environment providing Interval, heapq, and defaultdict as needed. Empty input returns 0 in both versions. A heap containing an end before the current start is not an error: that room is idle until reused.'
};

export const mountVisualization = mountMeetingRoomsII;
