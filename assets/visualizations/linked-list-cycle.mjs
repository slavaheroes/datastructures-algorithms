import {mountSequencePlayback, numbers, integer, escape} from './sequence-playback.mjs';

export function mountCycle(root) {
  return mountSequencePlayback(root, {
    id: 'floyd',
    description: 'Follow the actual next links, including the tail’s return edge. Standard mode detects the cycle, then demonstrates the entry proof. The saved-source mode follows the one-node fast-pointer offset and stops at detection.',
    inputs: [{key: 'values', label: 'Node values in next order', value: '[0,1,2,3,4,5,6,7]'}, {key: 'entry', label: 'Tail links to index (−1 for no cycle)', value: '5', type: 'number'}],
    hint: 'Up to 16 integer-valued nodes, from −999 to 999. Values may repeat; indices identify nodes. Entry must be −1 or a valid node index. Use [] and −1 for an empty list.',
    legend: 'Arrows are next links. S = slow, F = fast; after reset H starts at head and M starts at the meeting point. Entry and meeting nodes have labeled outer rings.',
    parse: raw => {
      const values = numbers(raw.values);
      if (values.length > 16) throw Error('Use at most 16 nodes.');
      return {values, entry: integer(raw.entry, -1, values.length - 1, 'Entry index')};
    },
    modes: [{label: 'Standard Floyd + cycle-entry proof', trace: input => cycleTrace(input, false)}, {label: 'Saved Python source: fast starts at head.next', trace: input => cycleTrace(input, true)}],
    render: renderCycle
  });
}

function cycleTrace({values, entry}, offset) {
  const frames = [], n = values.length;
  const next = index => index === null ? null : index + 1 < n ? index + 1 : entry < 0 ? null : entry;
  let slow = n ? 0 : null, fast = offset ? next(slow) : slow, round = 0, meeting = null, phase = 'Detection', steps = 0;
  const cycleLength = entry < 0 ? 0 : n - entry;
  const save = message => {
    const b = meeting === null || entry < 0 ? null : meeting - entry;
    const c = b === null ? null : (cycleLength - b) % cycleLength;
    frames.push({slow, fast, meeting, phase, message,
      stats: [['Phase', phase], ['S / H index', slow ?? 'None'], ['F / M index', fast ?? 'None'], ['Detection rounds', round], ['Head → entry (a)', entry < 0 ? '—' : entry], ['Cycle length (L)', cycleLength || '—'], ['Entry → meeting (b)', b ?? '—'], ['Shortest meeting → entry (c)', c ?? '—'], ...(phase === 'Find entry' ? [['Moves after reset', steps]] : [])],
      detail: meeting !== null && !offset ? `a = ${entry}, b = ${b}, L = ${cycleLength}. a + b = ${entry + b} = ${(entry + b) / cycleLength} × L. Shortest return c = ${c}; a = c + ${(entry - c) / cycleLength} × L.` : ''
    });
  };
  save(offset ? 'Initialize slow at head and fast at head.next, matching the saved Python source.' : 'Initialize both pointers at head. Move before comparing them for cycle detection.');
  if (!n) { save('Empty list. Return false.'); return frames; }
  if (offset) {
    while (slow !== null && fast !== null && slow !== fast) {
      slow = next(slow); fast = next(next(fast)); round++;
      save(`Round ${round}: move slow one link and fast two links (or to None).`);
    }
    if (fast === null) save('Fast reached None. Return false: no cycle.');
    else { meeting = slow; save('The pointers meet. Return true. This source only detects a cycle; use standard mode for the reset-to-head proof.'); }
    return frames;
  }
  while (fast !== null && next(fast) !== null) {
    slow = next(slow); fast = next(next(fast)); round++;
    save(`Round ${round}: slow has traveled ${round} edges; fast has traveled ${2 * round}.`);
    if (slow === fast) { meeting = slow; break; }
  }
  if (meeting === null) { save('Fast or its next link is None. Return false: no cycle.'); return frames; }
  save(`Meeting at node ${meeting}. Fast traveled ${round} more edges than slow: ${round / cycleLength} complete cycle lap(s). A cycle exists.`);
  phase = 'Find entry'; slow = 0;
  save(`Reset H to head. Keep M at meeting node ${meeting}. Both now move one edge per round.`);
  while (slow !== fast) {
    slow = next(slow); fast = next(fast); steps++;
    save(`Move ${steps} after reset: H is at node ${slow}, M is at node ${fast}.`);
  }
  save(`Both pointers meet at entry node ${entry} after ${steps} moves. The walk from the meeting node may include full laps. Return this node in the entry-finding extension.`);
  return frames;
}

function renderCycle(frame, {values, entry}) {
  const width = Math.max(480, values.length * 88 + 48), x = i => 46 + i * 88, y = 94;
  let drawing = '<defs><marker id="floyd-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor"/></marker></defs>';
  values.forEach((value, i) => {
    if (i < values.length - 1) drawing += `<path class="cycle-edge" d="M ${x(i) + 24} ${y} H ${x(i + 1) - 26}" marker-end="url(#floyd-arrow)"/>`;
    const labels = [i === frame.slow ? (frame.phase === 'Find entry' ? 'H' : 'S') : '', i === frame.fast ? (frame.phase === 'Find entry' ? 'M' : 'F') : ''].filter(Boolean);
    drawing += `<circle ${i === frame.slow ? 'data-follow' : ''} class="cycle-node" cx="${x(i)}" cy="${y}" r="22"/>`;
    if (i === entry) drawing += `<circle class="cycle-entry" cx="${x(i)}" cy="${y}" r="27"/>`;
    if (i === frame.meeting) drawing += `<circle class="cycle-meeting" cx="${x(i)}" cy="${y}" r="31"/>`;
    drawing += `<text x="${x(i)}" y="${y + 4}">${value}</text><text class="cycle-pointer" x="${x(i)}" y="35">${labels.join(' / ')}</text><text x="${x(i)}" y="56">#${i}</text><text x="${x(i)}" y="143">${i === entry ? 'entry' : ''}</text><text x="${x(i)}" y="160">${i === frame.meeting ? 'meeting' : ''}</text>`;
  });
  if (values.length && entry >= 0) {
    const lastX = x(values.length - 1), entryX = x(entry);
    drawing += `<path class="cycle-edge cycle-return" d="M ${lastX + 23} ${y} C ${lastX + 58} ${y}, ${lastX + 45} 203, ${lastX} 203 H ${entryX} C ${entryX - 42} 203, ${entryX - 40} 118, ${entryX - 17} 112" marker-end="url(#floyd-arrow)"/><text x="${(lastX + entryX) / 2}" y="227">tail.next → #${entry}</text>`;
  } else if (values.length) drawing += `<text x="${x(values.length - 1)}" y="194">next → None</text>`;
  else drawing += '<text x="240" y="100">Empty list: head = None</text>';
  const text = `Nodes in next order: ${values.map((v, i) => `node ${i}, value ${v}`).join('; ') || 'none'}. Tail links to ${entry < 0 ? 'None' : 'node ' + entry}. ${frame.message}`;
  return `<div class="svg-scroll"><svg class="cycle-svg" style="min-width:${width}px" viewBox="0 0 ${width} 245" role="img" aria-label="${escape(text)}">${drawing}</svg></div>${frame.detail ? `<p class="cycle-equation">${escape(frame.detail)}</p>` : ''}`;
}
