import {escape, integer, mountSequencePlayback} from './sequence-playback.mjs';

const LIMIT = 16;

function immutable(value) {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.values(value).forEach(immutable);
    Object.freeze(value);
  }
  return value;
}

// Positive means a should be nearer the root than b.
const minOrder = (a, b) => b - a;
const maxOrder = (a, b) => a - b;
const taskOrder = (a, b) => a[0] - b[0] || (a[1] > b[1] ? 1 : a[1] < b[1] ? -1 : 0);

function siftDown(heap, start, order) {
  let index = start;
  while (2 * index + 1 < heap.length) {
    let child = 2 * index + 1;
    if (child + 1 < heap.length && order(heap[child + 1], heap[child]) > 0) child++;
    if (order(heap[child], heap[index]) <= 0) break;
    [heap[index], heap[child]] = [heap[child], heap[index]];
    index = child;
  }
}

function heapify(heap, order) {
  for (let index = Math.floor(heap.length / 2) - 1; index >= 0; index--) siftDown(heap, index, order);
}

function push(heap, value, order) {
  heap.push(value);
  let index = heap.length - 1;
  while (index > 0) {
    const parent = Math.floor((index - 1) / 2);
    if (order(heap[index], heap[parent]) <= 0) break;
    [heap[index], heap[parent]] = [heap[parent], heap[index]];
    index = parent;
  }
}

function pop(heap, order) {
  const value = heap[0], last = heap.pop();
  if (heap.length) { heap[0] = last; siftDown(heap, 0, order); }
  return value;
}

function heapPanel(title, values, label, active = false) {
  if (!values.length) return `<section class="heap-lesson-panel"><h4>${escape(title)}</h4><p class="heap-lesson-empty">Empty heap</p><p class="heap-lesson-array-text">Array: []</p></section>`;
  const depth = Math.floor(Math.log2(values.length));
  const width = Math.max(320, 2 ** depth * 64), height = 110 + depth * 84;
  const positions = values.map((_, index) => {
    const level = Math.floor(Math.log2(index + 1));
    return {x: width * (index - (2 ** level - 1) + 0.5) / 2 ** level, y: 44 + level * 84};
  });
  const edges = values.slice(1).map((_, offset) => {
    const child = positions[offset + 1], parent = positions[Math.floor(offset / 2)];
    return `<line x1="${parent.x}" y1="${parent.y}" x2="${child.x}" y2="${child.y}"/>`;
  }).join('');
  const nodes = values.map((value, index) => {
    const position = positions[index], text = label(value);
    return `<g class="heap-lesson-node ${index === 0 ? 'heap-lesson-root' : ''} ${active && index === 0 ? 'heap-lesson-active' : ''}" transform="translate(${position.x} ${position.y})"><circle r="25"/><text y="5">${escape(text)}</text><text class="heap-lesson-index" y="42">${index === 0 ? '0 · root' : index}</text></g>`;
  }).join('');
  const array = values.map((value, index) => `<li class="${index === 0 ? 'heap-lesson-root' : ''}"><span>${index === 0 ? '0 · root' : index}</span><strong>${escape(label(value))}</strong></li>`).join('');
  const description = `${title}. Heap array in index order: ${values.map(label).join(', ')}. Root: ${label(values[0])}.`;
  return `<section class="heap-lesson-panel"><h4>${escape(title)}</h4><div class="svg-scroll heap-lesson-tree-scroll"><svg class="heap-lesson-tree" viewBox="0 0 ${width} ${height}" style="min-width:${width}px" role="img" aria-label="${escape(description)}">${edges}${nodes}</svg></div><div class="svg-scroll"><ol class="heap-lesson-array" aria-label="${escape(`${title}, heap array with indices`)}">${array}</ol></div></section>`;
}

function taskInput(fields) {
  const text = fields.tasks.trim();
  let tasks;
  if (text.startsWith('[')) {
    try { tasks = JSON.parse(text); }
    catch { throw Error('Enter uppercase tasks as AAABBB or a JSON array such as ["A","A","B"].'); }
  } else tasks = [...text];
  if (!Array.isArray(tasks) || tasks.length > LIMIT || tasks.some(task => typeof task !== 'string' || !/^[A-Z]$/.test(task))) {
    throw Error(`Use at most ${LIMIT} single uppercase letters A–Z, such as AAABBB. An empty task list is allowed.`);
  }
  return {tasks, cooldown: integer(fields.cooldown, 0, 8, 'Cooldown n')};
}

function schedulerTrace(input) {
  const counts = new Map(), ready = [], cooldowns = [], timeline = [], frames = [];
  for (const task of input.tasks) counts.set(task, (counts.get(task) || 0) + 1);
  let time = 0, selected = null, activeInterval = null;
  const add = message => frames.push(immutable({
    message, time, selected, activeInterval,
    ready: ready.map(item => [...item]), cooldowns: cooldowns.map(item => ({...item})), timeline: [...timeline],
    stats: [['time (source)', time], ['Elapsed CPU intervals', timeline.length], ['Ready task types', ready.length], ['Cooling task types', cooldowns.length], ['Executed tasks', timeline.filter(task => task !== 'idle').length]]
  }));
  add('Start time at 0. Count the remaining executions for each letter.');
  ready.push(...[...counts].map(([task, count]) => [count, task]));
  heapify(ready, taskOrder);
  add('Build the ready max-heap from (remaining count, letter) pairs. A larger letter wins a tie in counts.');
  while (ready.length || cooldowns.length) {
    activeInterval = null;
    if (!ready.length) {
      const waiting = cooldowns.shift();
      selected = `${waiting.task} × ${waiting.count}; available at ${waiting.last + input.cooldown + 1}`;
      add(`The ready heap is empty. Take ${waiting.task} from the front of cooldowns; its next allowed interval is ${waiting.last + input.cooldown + 1}.`);
      const before = time;
      time = waiting.last + input.cooldown + 1;
      while (timeline.length < time) timeline.push('idle');
      push(ready, [waiting.count, waiting.task], taskOrder);
      selected = null;
      add(`Jump time from ${before} to ${time}${time > before ? `, skipping idle interval${time - before === 1 ? '' : 's'} ${before}${time - before > 1 ? `–${time - 1}` : ''}` : ''}. Return ${waiting.task} to the ready heap; execute it on a later step.`);
    } else {
      const [count, task] = pop(ready, taskOrder), remaining = count - 1;
      selected = `${task} × ${count} → ${remaining} remaining`;
      activeInterval = time;
      timeline.push(task);
      add(`Pop ${task} × ${count} and execute ${task} during CPU interval ${time}. ${remaining} execution${remaining === 1 ? '' : 's'} remain for this task.`);
      if (remaining > 0) {
        cooldowns.push({last: time, count: remaining, task});
        add(`Append (${time}, ${remaining}, ${task}) to cooldowns. ${task} cannot execute again before interval ${time + input.cooldown + 1}.`);
      }
      if (cooldowns.length && time - cooldowns[0].last >= input.cooldown) {
        const available = cooldowns.shift();
        push(ready, [available.count, available.task], taskOrder);
        add(`Release ${available.task} from cooldowns after the current execution. It can be selected starting at interval ${time + 1}.`);
      }
      time++;
      selected = null;
      activeInterval = null;
      add(`Advance time to ${time}. ${ready.length || cooldowns.length ? 'Choose the next ready task, or jump to the next release.' : 'Both collections are now empty.'}`);
    }
  }
  add(`Return ${time}: ${input.tasks.length} task executions and ${time - input.tasks.length} idle intervals.`);
  return frames;
}

function renderScheduler(frame, input) {
  const queue = frame.cooldowns.length ? `<ol class="heap-lesson-cooldowns" aria-label="Cooldown queue, front first">${frame.cooldowns.map((item, index) => `<li><strong>${escape(item.task)} × ${item.count}</strong><span>${index === 0 ? 'front · ' : ''}last ran ${item.last}</span><span>available ${item.last + input.cooldown + 1}</span></li>`).join('')}</ol>` : '<p class="heap-lesson-empty">Empty queue</p>';
  const slots = frame.timeline.map((task, index) => `<li class="${task === 'idle' ? 'heap-lesson-idle' : ''} ${index === frame.activeInterval ? 'heap-lesson-active' : ''}" ${index === frame.timeline.length - 1 ? 'data-follow' : ''}><span>${index}</span><strong>${escape(task)}</strong>${index === frame.activeInterval ? '<span>current</span>' : ''}</li>`).join('');
  return `<div class="heap-lesson-layout">${heapPanel('Ready max-heap · remaining count × letter', frame.ready, ([count, task]) => `${task}×${count}`)}<section class="heap-lesson-panel"><h4>Cooldown queue · front to back</h4>${queue}<p class="hint">Available interval = last execution + n + 1. Entries are ordered by last execution time.</p>${frame.selected ? `<p class="heap-lesson-selected">Selected: ${escape(frame.selected)}</p>` : ''}</section></div><section class="heap-lesson-panel heap-lesson-timeline-panel"><h4>Execution timeline · zero-based CPU intervals</h4><div class="svg-scroll">${slots ? `<ol class="heap-lesson-timeline" aria-label="CPU intervals in execution order">${slots}</ol>` : '<p class="heap-lesson-empty">No interval has elapsed.</p>'}</div><p class="hint">The total duration is the number of slots, including idle. Source time advances after execution or jumps over an idle span.</p></section>`;
}

export function mountTaskScheduler(root) {
  return mountSequencePlayback(root, {
    id: 'task-scheduler',
    description: 'Follow the Python solution’s ready heap, cooldown queue, and CPU timeline. The counter time uses zero-based intervals; the returned duration counts every executed or idle slot.',
    inputs: [{key: 'tasks', label: 'Tasks · uppercase letters or JSON array', value: 'AAABBB'}, {key: 'cooldown', label: 'Cooldown n', value: '2', type: 'number'}],
    hint: 'Use at most 16 tasks A–Z and a cooldown from 0 to 8. Examples: AAABBB or ["A","A","B"]. Empty input is allowed. Diagrams show valid heaps; Python’s internal array order may differ.',
    legend: 'Root label: next ready task by highest count, then descending letter. Current outline: just executed CPU interval. Dashed idle slots: no task could execute.',
    parse: taskInput, modes: [{label: 'Ready max-heap and cooldown queue', trace: schedulerTrace}], render: renderScheduler
  });
}

function medianInput(fields) {
  let values;
  try { values = JSON.parse(fields.values); }
  catch { throw Error('Enter a JSON array, such as [1,2,3].'); }
  if (!Array.isArray(values) || values.length > LIMIT || values.some(value => !Number.isInteger(value) || value < -999 || value > 999)) {
    throw Error(`Use at most ${LIMIT} integers from −999 to 999. An empty stream [] is allowed.`);
  }
  return {values};
}

function medianTrace(input) {
  const lower = [], upper = [], history = [], frames = [];
  let median = null, current = null, processed = 0, stage = 'Ready for insertion', pendingUpdate = false;
  const add = message => frames.push(immutable({
    message, lower: [...lower], upper: [...upper], history: history.map(item => ({...item})), median, current, processed, stage, pendingUpdate,
    stats: [['Inserted values', lower.length + upper.length], ['Lower / upper sizes', `${lower.length} / ${upper.length}`], [pendingUpdate ? 'Cached median · update pending' : 'Current median', median === null ? 'None · not available' : median], ['Operation', stage]]
  }));
  add('Both heaps are empty. The cached median is None; findMedian returns None before the first insertion.');
  for (let index = 0; index < input.values.length; index++) {
    const value = input.values[index];
    current = index;
    stage = `addNum(${value})`;
    add(`Read stream value ${value}. ${median === null ? 'This is the first insertion.' : `Compare it with the current median ${median}.`}`);
    if (median === null) {
      median = value;
      push(upper, value, minOrder);
      processed++;
      history.push({value, median});
      stage = 'First insertion complete';
      add(`Set median = ${value} and push ${value} into minHeap (the upper half). The first-number branch returns immediately.`);
      continue;
    }
    pendingUpdate = true;
    if (value > median) {
      stage = 'Choose upper min-heap';
      add(`${value} > cached median ${median}. Insert into minHeap, first making room if the upper half is larger.`);
      if (upper.length > lower.length) {
        const moved = pop(upper, minOrder);
        push(lower, moved, maxOrder);
        stage = 'Rebalance before insertion';
        add(`The upper heap was larger. Move its minimum ${moved} into the lower max-heap before inserting ${value}. The displayed cached median has not been updated yet.`);
      }
      push(upper, value, minOrder);
      stage = 'Push into upper min-heap';
      add(`Push ${value} into minHeap. Read the heap roots on the next step to refresh the cached median.`);
    } else {
      stage = 'Choose lower max-heap';
      add(`${value} ≤ cached median ${median}. Insert into maxHeap; equality follows this same lower-half branch.`);
      if (lower.length > upper.length) {
        const moved = pop(lower, maxOrder);
        push(upper, moved, minOrder);
        stage = 'Rebalance before insertion';
        add(`The lower heap was larger. Move its maximum ${moved} into the upper min-heap before inserting ${value}. The displayed cached median has not been updated yet.`);
      }
      push(lower, value, maxOrder);
      stage = 'Push into lower max-heap';
      add(`Push ${value} into maxHeap. Read the heap roots on the next step to refresh the cached median.`);
    }
    if (lower.length === upper.length) {
      median = (lower[0] + upper[0]) / 2;
      stage = 'Average both roots';
    } else {
      median = lower.length > upper.length ? lower[0] : upper[0];
      stage = 'Read larger heap root';
    }
    pendingUpdate = false;
    processed++;
    history.push({value, median});
    add(lower.length === upper.length ? `The heap sizes match. median = (${lower[0]} + ${upper[0]}) / 2 = ${median}. findMedian returns this stored value.` : `The ${lower.length > upper.length ? 'lower' : 'upper'} heap is larger by one. Its root is ${median}, so store median = ${median}.`);
  }
  current = null;
  stage = 'Stream complete';
  add(input.values.length ? `All ${input.values.length} values are inserted. findMedian returns ${median} without modifying either heap.` : 'The stream is empty. No numeric median is available; the source returns None.');
  return frames;
}

function renderMedian(frame, input) {
  const values = input.values.map((value, index) => `<li class="${index < frame.processed ? 'heap-lesson-consumed' : ''} ${index === frame.current ? 'heap-lesson-active' : ''}" ${index === frame.current ? 'data-follow' : ''}><span>${index}</span><strong>${escape(value)}</strong><span>${index === frame.current ? 'current' : index < frame.processed ? 'inserted' : 'waiting'}</span></li>`).join('');
  const history = frame.history.length ? `<div class="height-table svg-scroll"><table><caption>Completed insertions and returned medians</caption><thead><tr><th scope="col">Insertion</th><th scope="col">Value added</th><th scope="col">findMedian</th></tr></thead><tbody>${frame.history.map((item, index) => `<tr><td>${index + 1}</td><td>${escape(item.value)}</td><td>${escape(item.median)}</td></tr>`).join('')}</tbody></table></div>` : '';
  const boundary = frame.lower.length && frame.upper.length ? `Lower root ${frame.lower[0]} ≤ upper root ${frame.upper[0]}.` : 'Both boundary roots become available after each half has a value.';
  return `<section class="heap-lesson-panel"><h4>Input stream · left to right</h4><div class="svg-scroll">${values ? `<ol class="heap-lesson-stream" aria-label="Input stream and insertion status">${values}</ol>` : '<p class="heap-lesson-empty">Empty stream</p>'}</div></section><div class="heap-lesson-layout">${heapPanel('maxHeap · lower half', frame.lower, String, frame.stage === 'Read larger heap root' && frame.lower.length > frame.upper.length)}${heapPanel('minHeap · upper half', frame.upper, String, frame.stage === 'Read larger heap root' && frame.upper.length > frame.lower.length)}</div><p class="heap-lesson-boundary">${escape(boundary)} ${frame.pendingUpdate ? 'The cached median still belongs to the previous completed insertion; update follows after the push.' : 'The heaps differ in size by at most one after each completed insertion.'}</p>${history}`;
}

export function mountMedianStream(root) {
  return mountSequencePlayback(root, {
    id: 'median-stream', description: 'Step through the source’s median-based insertion choice, transfer between heaps, and cached median update. The tree and array show the same heap values; neither array is a sorted list.',
    inputs: [{key: 'values', label: 'Stream values · JSON array', value: '[1,2,3,0,0,8]'}],
    hint: 'Use up to 16 integers from −999 to 999. Duplicate values are allowed. Use [] to inspect the empty stream. Diagrams show valid heaps; Python’s internal array order may differ.',
    legend: 'Root label: largest lower-half or smallest upper-half value. Current outline: value being inserted. Inserted label: completed insertion. Median history records values after updates.',
    parse: medianInput, modes: [{label: 'Median-based insertion with two heaps', trace: medianTrace}], render: renderMedian
  });
}
