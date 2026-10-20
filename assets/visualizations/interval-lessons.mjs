import {escape, integer, mountSequencePlayback} from './sequence-playback.mjs';

function intervalsInput(text, closed = false) {
  if (text.length > 1600) throw Error('Keep the interval input under 1,600 characters.');
  let intervals;
  try { intervals = JSON.parse(text); } catch { throw Error('Enter JSON intervals such as [[1,3],[2,4]].'); }
  if (!Array.isArray(intervals) || intervals.length > 16 || intervals.some(pair => !Array.isArray(pair) || pair.length !== 2 || pair.some(n => !Number.isInteger(n) || n < -20 || n > 50) || (closed ? pair[0] > pair[1] : pair[0] >= pair[1]))) {
    throw Error(`Use at most 16 intervals with integer endpoints from −20 to 50 and start ${closed ? '≤' : '<'} end.`);
  }
  return intervals.map((pair, id) => ({start: pair[0], end: pair[1], id}));
}

const compare = (a, b) => a[0] - b[0] || a[1] - b[1];
function push(heap, item) {
  heap.push(item);
  let i = heap.length - 1;
  while (i > 0) {
    const parent = Math.floor((i - 1) / 2);
    if (compare(heap[parent], heap[i]) <= 0) break;
    [heap[parent], heap[i]] = [heap[i], heap[parent]]; i = parent;
  }
}
function pop(heap) {
  const item = heap[0], last = heap.pop();
  if (heap.length) {
    heap[0] = last;
    let i = 0;
    while (2 * i + 1 < heap.length) {
      let child = 2 * i + 1;
      if (child + 1 < heap.length && compare(heap[child + 1], heap[child]) < 0) child++;
      if (compare(heap[i], heap[child]) <= 0) break;
      [heap[i], heap[child]] = [heap[child], heap[i]]; i = child;
    }
  }
  return item;
}
function snapshot(frames, message, state) {
  // All state is data: cloning keeps earlier steps independent of later mutations.
  frames.push(Object.freeze({message, ...JSON.parse(JSON.stringify(state))}));
}

function nonOverlapTrace(input) {
  const intervals = [...input.intervals].sort((a, b) => a.start - b.start || a.end - b.end), frames = [], removed = [], kept = [];
  let current = null, end = null, removals = 0;
  const save = message => snapshot(frames, message, {intervals, removed, kept, current, cursor: end, stats: [['Removed', removals], ['Retained end', end ?? '—'], ['Kept intervals', kept.length]]});
  save('Sort intervals by start, then end. Touching endpoints are compatible.');
  if (!intervals.length) { save('No intervals need removal. The source assumes nonempty input; this empty visualization returns 0.'); return frames; }
  kept.push(intervals[0].id); end = intervals[0].end; current = intervals[0].id;
  save(`Keep [${intervals[0].start}, ${end}] as the first candidate.`);
  for (const interval of intervals.slice(1)) {
    current = interval.id;
    if (end > interval.start) {
      removals++;
      const previous = kept[kept.length - 1];
      if (interval.end < end) { removed.push(previous); kept[kept.length - 1] = interval.id; end = interval.end; }
      else removed.push(interval.id);
      save(`Overlap: remove one of the two candidates, keep the smaller ending time ${end}, and increment removals to ${removals}.`);
    } else {
      kept.push(interval.id); end = interval.end;
      save(`Start ${interval.start} is at least the retained end. Keep this interval and move curr_end to ${end}.`);
    }
  }
  current = null; save(`Return ${removals}: these removals leave ${kept.length} compatible intervals.`);
  return frames;
}

function meetingsHeapTrace(input) {
  const intervals = [...input.intervals].sort((a, b) => a.start - b.start), frames = [], heap = [], rooms = {};
  let current = null, cursor = null, nextRoom = 0;
  const save = message => snapshot(frames, message, {intervals, rooms, current, cursor, heap, columns: ['Heap index', 'End', 'Room'], rows: heap.map(([end, room], i) => [i, end, room + 1]), caption: 'Min-heap array · a reused room’s ending is temporarily removed before replacement', stats: [['Allocated rooms', nextRoom], ['Stored room endings', heap.length], ['Earliest stored end', heap[0]?.[0] ?? '—']]});
  save('Sort meetings by start time. The heap stores the last ending time assigned to each allocated room.');
  for (const interval of intervals) {
    current = interval.id; cursor = interval.start;
    let room;
    if (heap.length && interval.start >= heap[0][0]) {
      const reusable = pop(heap); room = reusable[1];
      save(`Meeting ${interval.id + 1} starts at ${interval.start}; pop end ${reusable[0]} and reuse room ${room + 1}.`);
    } else { room = nextRoom++; save(`No stored room ends by ${interval.start}. Allocate room ${room + 1}.`); }
    rooms[interval.id] = room; push(heap, [interval.end, room]);
    save(`Push end ${interval.end} for room ${room + 1}. The heap now tracks ${heap.length} allocated room${heap.length === 1 ? '' : 's'}.`);
  }
  current = null; cursor = null; save(`Return the final heap length, ${heap.length}. Old endings remain until their rooms are reused; heap length is the room count, not the number of currently active meetings.`);
  return frames;
}

function meetingsSweepTrace(input) {
  const intervals = input.intervals, frames = [], events = new Map();
  for (const interval of intervals) { events.set(interval.start, (events.get(interval.start) || 0) + 1); events.set(interval.end, (events.get(interval.end) || 0) - 1); }
  let active = 0, peak = 0, cursor = null;
  const times = [...events.keys()].sort((a, b) => a - b), processed = [];
  const save = message => snapshot(frames, message, {intervals, cursor, activeAtTime: cursor, columns: ['Time', 'Net change', 'Active after event'], rows: times.map(time => [time, `${events.get(time) > 0 ? '+' : ''}${events.get(time)}`, processed.find(item => item[0] === time)?.[1] ?? '—']), caption: 'Sweep events · starts +1 and ends −1 at the same time are combined', stats: [['Active after event', active], ['Maximum rooms', peak]]});
  save('Count +1 at each start and −1 at each end. Combine events with the same time, then sort the distinct times.');
  for (const time of times) { cursor = time; active += events.get(time); peak = Math.max(peak, active); processed.push([time, active]); save(`At time ${time}, apply net change ${events.get(time)}: active = ${active}; maximum = ${peak}. Ending and starting at the same time can share a room.`); }
  cursor = null; save(`Return ${peak}, the maximum simultaneous meeting count.`);
  return frames;
}

function minimumTrace(input) {
  const intervals = [...input.intervals].sort((a, b) => a.start - b.start || a.end - b.end), queries = input.queries.map((value, index) => ({value, index})).sort((a, b) => a.value - b.value || a.index - b.index);
  const frames = [], heap = [], answers = input.queries.map(() => -1), inserted = [], answered = [];
  let i = 0, cursor = null, current = null, queryIndex = null;
  const save = message => snapshot(frames, message, {intervals, inserted, cursor, current, queryIndex, answers, answered, queries: input.queries, heap, columns: ['Heap index', 'Length', 'Right end'], rows: heap.map(([length, end], index) => [index, length, end]), caption: 'Min-heap array · ordered by (inclusive length, right end)', stats: [['Next interval index', i], ['Current query', cursor ?? '—'], ['Smallest candidate', heap[0]?.[0] ?? '—']]});
  save('Sort intervals and (query, original index) pairs. Initialize all answers to −1.');
  for (const query of queries) {
    cursor = query.value; queryIndex = query.index; current = null;
    save(`Process query ${cursor} (original index ${query.index}). Add every interval whose left endpoint is at most the query.`);
    while (i < intervals.length && intervals[i].start <= cursor) {
      const interval = intervals[i++]; current = interval.id; inserted.push(interval.id); push(heap, [interval.end - interval.start + 1, interval.end]);
      save(`Push [${interval.start}, ${interval.end}] with inclusive length ${interval.end - interval.start + 1}. It has started; expiration is checked at the heap root.`);
    }
    current = null;
    while (heap.length && cursor > heap[0][1]) { const expired = pop(heap); save(`Pop the root (length ${expired[0]}, end ${expired[1]}): it ends before query ${cursor}. Expired entries below the root stay until exposed.`); }
    if (heap.length) answers[query.index] = heap[0][0];
    answered.push(query.index);
    save(heap.length ? `The root covers ${cursor}; write length ${heap[0][0]} to answer[${query.index}].` : `No covering interval remains. answer[${query.index}] stays −1.`);
  }
  cursor = null; queryIndex = null; save(`Return answers in original query order: ${JSON.stringify(answers)}.`);
  return frames;
}

function timeline(frame) {
  const values = frame.intervals.flatMap(interval => [interval.start, interval.end]);
  if (frame.queries) values.push(...frame.queries);
  if (frame.cursor !== null && frame.cursor !== undefined) values.push(frame.cursor);
  const min = Math.min(0, ...values), max = Math.max(min + 1, ...values), width = 760, left = 94, span = width - left - 30;
  const x = value => left + (value - min) / (max - min) * span;
  const height = 64 + frame.intervals.length * 36;
  const rows = frame.intervals.map((interval, index) => {
    const removed = frame.removed?.includes(interval.id), kept = frame.kept?.includes(interval.id), current = frame.current === interval.id;
    const active = frame.activeAtTime !== null && frame.activeAtTime !== undefined && interval.start <= frame.activeAtTime && frame.activeAtTime < interval.end;
    const room = frame.rooms?.[interval.id], y = 45 + index * 36;
    const status = removed ? 'removed' : kept ? 'kept' : active ? 'active' : frame.inserted?.includes(interval.id) ? 'inserted' : '';
    return `<g class="ig-interval ${status} ${current ? 'current' : ''}" ${current ? 'data-follow' : ''}><text x="4" y="${y + 5}" class="ig-row-label">${interval.id + 1}${room !== undefined ? ` · R${room + 1}` : ''}</text><line x1="${x(interval.start)}" y1="${y}" x2="${x(interval.end)}" y2="${y}"/><circle cx="${x(interval.start)}" cy="${y}" r="4"/><circle cx="${x(interval.end)}" cy="${y}" r="4"/><text x="${x(interval.start)}" y="${y - 10}">${interval.start}</text>${interval.start === interval.end ? '' : `<text x="${x(interval.end)}" y="${y - 10}">${interval.end}</text>`}<title>Input interval ${interval.id + 1}: [${interval.start}, ${interval.end}]${room !== undefined ? `; room ${room + 1}` : ''}${status ? `; ${status}` : ''}</title></g>`;
  }).join('');
  const cursor = frame.cursor !== null && frame.cursor !== undefined ? `<g class="ig-cursor"><line x1="${x(frame.cursor)}" y1="16" x2="${x(frame.cursor)}" y2="${height - 8}"/><text x="${x(frame.cursor)}" y="12">${frame.cursor}</text></g>` : '';
  return `<section class="ig-panel"><h4>Intervals · rows retain input numbers</h4><div class="svg-scroll"><svg class="ig-timeline" viewBox="0 0 ${width} ${height}" style="min-width:${width}px" role="img" aria-label="${escape(frame.intervals.map(interval => `Interval ${interval.id + 1}: ${interval.start} to ${interval.end}${frame.removed?.includes(interval.id) ? ', removed' : frame.kept?.includes(interval.id) ? ', kept' : ''}`).join('; ') || 'No intervals')}">${rows}${cursor}</svg></div>${frame.intervals.length ? '' : '<p class="hint">No intervals</p>'}</section>`;
}
function render(frame) {
  const table = frame.rows ? `<section class="ig-panel height-table svg-scroll"><table><caption>${escape(frame.caption)}</caption><thead><tr>${frame.columns.map(column => `<th scope="col">${escape(column)}</th>`).join('')}</tr></thead><tbody>${frame.rows.map(row => `<tr>${row.map(value => `<td>${escape(value)}</td>`).join('')}</tr>`).join('')}</tbody></table>${frame.rows.length ? '' : '<p class="hint">Empty state</p>'}</section>` : '';
  const queries = frame.queries ? `<section class="ig-panel"><h4>Queries and answers · original order</h4><ol class="ig-chips">${frame.queries.map((query, index) => `<li class="${index === frame.queryIndex ? 'current' : ''}"><span>query[${index}] = ${query}</span><strong>${frame.answers[index] === -1 ? '−1' : frame.answers[index]}</strong><span>${frame.answered.includes(index) ? frame.answers[index] === -1 ? 'no covering interval' : 'answered' : 'not processed'}</span></li>`).join('')}</ol></section>` : '';
  return timeline(frame) + table + queries;
}

export function mountNonOverlappingIntervals(root) {
  return mountSequencePlayback(root, {id: 'non-overlapping-intervals', description: 'Follow the saved eraseOverlapIntervals reference solution: remove an overlap and retain the earlier ending candidate.', inputs: [{key: 'intervals', label: 'Intervals · JSON array', value: '[[1,2],[2,3],[3,4],[1,3]]'}], hint: 'Up to 16 intervals; integer endpoints −20 to 50; start < end. [] is shown as an empty extension because the source reads intervals[0].', legend: 'Filled green: kept. Dashed: removed. Orange: current interval. Vertical line: curr_end. Touching endpoints do not overlap.', parse: fields => ({intervals: intervalsInput(fields.intervals)}), modes: [{label: 'Keep the smaller end', trace: nonOverlapTrace}], render});
}
export function mountMeetingRoomsII(root) {
  return mountSequencePlayback(root, {id: 'meeting-rooms-ii', description: 'Compare the two stored versions: reuse rooms using a heap, or sweep combined start/end events.', inputs: [{key: 'intervals', label: 'Meetings · JSON [start,end] pairs', value: '[[0,30],[5,10],[15,20],[30,40]]'}], hint: 'Up to 16 meetings; integer endpoints −20 to 50; start < end. The Python source uses Interval objects; the diagram uses equivalent pairs. [] needs 0 rooms.', legend: 'Orange: current meeting. R1, R2, …: room assignment in heap mode. Green in sweep mode: active after the current event. A meeting ending at t can share a room with one starting at t.', parse: fields => ({intervals: intervalsInput(fields.intervals)}), modes: [{label: 'Heap of allocated room endings', trace: meetingsHeapTrace}, {label: 'Reference: event sweep', trace: meetingsSweepTrace}], render});
}
export function mountMinimumInterval(root) {
  return mountSequencePlayback(root, {id: 'minimum-interval-to-include-each-query', description: 'Process queries in sorted order. Add started intervals to the length heap, discard expired roots, then restore original query order.', inputs: [{key: 'intervals', label: 'Closed intervals · JSON array', value: '[[1,4],[2,4],[3,6],[4,4]]'}, {key: 'queries', label: 'Queries · JSON integer array', value: '[2,3,4,5]'}], hint: 'Up to 16 intervals and 16 queries; integer endpoints/queries −20 to 50; start ≤ end. Closed [4,4] has length 1. Empty lists are allowed.', legend: 'Orange: newly inserted interval or current query. Green: interval has entered the heap (it may later expire). Vertical line: current query. Heap rows show its actual array order.', parse: fields => { const intervals = intervalsInput(fields.intervals, true); if (fields.queries.length > 500) throw Error('Use at most 16 queries.'); let queries; try { queries = JSON.parse(fields.queries); } catch { throw Error('Queries must be a JSON array, such as [2,3,4,5].'); } if (!Array.isArray(queries) || queries.length > 16) throw Error('Use at most 16 queries.'); return {intervals, queries: queries.map(query => { if (typeof query !== 'number') throw Error('Queries must be integers.'); return integer(query, -20, 50, 'Query'); })}; }, modes: [{label: 'Sorted queries and a min-heap', trace: minimumTrace}], render});
}
