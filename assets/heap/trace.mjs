import {HEAP_LIMIT, comesBefore, heapViolations, validateHeapArray} from './model.mjs';
import {heapCode} from './code.mjs';

// Show a conventional bottom-up heapify and sift-up / sift-down operations.
// These snapshots explain the heap property rather than CPython's exact moves.
export function heapTrace(input, mode, operation = 'heapify', value) {
  validateHeapArray(input);
  if (!['min', 'max'].includes(mode)) throw Error('Choose a min heap or a max heap.');
  if (!['heapify', 'heappush', 'heappop'].includes(operation)) throw Error('Choose a heap operation.');
  if (operation !== 'heapify' && heapViolations(input, mode).length) throw Error('Finish heapify before pushing or popping.');
  if (operation === 'heappush' && !Number.isSafeInteger(value)) throw Error('Enter a safe integer to push.');
  if (operation === 'heappush' && input.length === HEAP_LIMIT) throw Error(`A heap can contain up to ${HEAP_LIMIT} values. Pop a value before pushing another.`);
  if (operation === 'heappop' && !input.length) throw Error('The heap is empty. Push a value before popping.');
  const values = [...input], frames = [];
  const {lines} = heapCode(mode, operation);
  let comparisons = 0, swaps = 0, removed = null;
  const order = mode === 'max' ? 'largest' : 'smallest';
  const before = mode === 'max' ? 'greater than' : 'less than';
  const snapshot = (message, active, kind, keys, label, locals = []) => {
    frames.push({
      values: [...values], message, active: [...active], kind, comparisons, swaps, removed,
      codeLines: keys.map(key => lines[key]), operation: label,
      variables: [['heap', [...values]], ['len(heap)', values.length], ...(removed === null ? [] : [['removed', removed]]), ...locals]
    });
  };
  const swap = (first, second, key, label, locals) => {
    [values[first], values[second]] = [values[second], values[first]];
    swaps++;
    snapshot(`Swap indices ${first} and ${second}: ${values[first]} moves toward the root, and ${values[second]} moves down.`, [first, second], 'swap', [key], label, locals);
  };

  function siftDown(start) {
    let parent = start;
    snapshot(`Enter sift-down with parent index ${parent} (${values[parent]}).`, [parent], 'select', ['siftDefine', 'siftParent'], 'Start sift-down', [['start', start], ['parent', parent]]);
    while (true) {
      const left = 2 * parent + 1, right = left + 1;
      let best = parent;
      const locals = () => [['start', start], ['parent', parent], ['left', left], ['right', right], ['best', best]];
      snapshot(`For parent index ${parent}, calculate left index ${left} and right index ${right}. Start with the parent as the best candidate.`, [parent], 'inspect', ['siftLoop', 'siftLeft', 'siftRight', 'siftBest'], 'Find child indices', locals());
      if (left < values.length) {
        comparisons++;
        const candidate = best;
        const preferred = comesBefore(values[left], values[best], mode);
        if (preferred) best = left;
        snapshot(`Compare index ${candidate} (${values[candidate]}) with its left child at index ${left} (${values[left]}). ${preferred ? `The child is ${before} the parent; choose it as the candidate.` : 'Keep the parent as the candidate.'}`, [candidate, left], 'compare', ['siftCompareLeft', ...(preferred ? ['siftChooseLeft'] : [])], preferred ? 'Choose left child' : 'Compare left child', locals());
      }
      if (right < values.length) {
        comparisons++;
        const candidate = best;
        const preferred = comesBefore(values[right], values[best], mode);
        if (preferred) best = right;
        snapshot(`Compare candidate index ${candidate} (${values[candidate]}) with the right child at index ${right} (${values[right]}). ${preferred ? `Choose index ${right}, the ${order} candidate.` : `Keep index ${candidate} as the ${order} candidate.`}`, [candidate, right], 'compare', ['siftCompareRight', ...(preferred ? ['siftChooseRight'] : [])], preferred ? 'Choose right child' : 'Compare right child', locals());
      }
      if (best === parent) {
        snapshot(`Index ${parent} (${values[parent]}) satisfies the parent order with its children. This sift-down is complete.`, [parent], 'settled', ['siftStop', 'siftReturn'], 'Return from sift-down', locals());
        return;
      }
      swap(parent, best, 'siftSwap', 'Swap down', locals());
      parent = best;
      snapshot(`Continue sift-down from index ${parent}, where the displaced value ${values[parent]} now sits.`, [parent], 'select', ['siftMove'], 'Move down', locals());
    }
  }

  if (operation === 'heapify') {
    const lastParent = Math.floor(values.length / 2) - 1;
    snapshot(lastParent >= 0 ? `Heapify the input in place. Leaf nodes already satisfy the heap property; start at the last parent, index ${lastParent}.` : values.length ? 'The only value already satisfies the heap property. There are no parents to sift down.' : 'The input is empty. Heapify leaves it empty.', [], 'start', ['heapifyDefine', 'heapifyLastParent', ...(lastParent < 0 ? ['heapifyLoop'] : [])], 'Find the last parent', [['last_parent', lastParent]]);
    for (let parent = lastParent; parent >= 0; parent--) {
      snapshot(`Sift down the subtree rooted at index ${parent} (${values[parent]}). Its child subtrees are already heaps.`, [parent], 'select', ['heapifyLoop', 'heapifyCall'], 'Call sift-down', [['last_parent', lastParent], ['start', parent]]);
      siftDown(parent);
    }
    snapshot(`Heapify complete. ${values.length ? `The root, ${values[0]}, is the ${order} value. The rest of the array is not necessarily sorted.` : 'The heap is empty.'}`, [], 'done', ['heapifyReturn'], 'Return None', [['last_parent', lastParent], ['return', 'None']]);
  } else if (operation === 'heappush') {
    snapshot(`Push ${value} into the completed ${mode} heap. First append it to the end of the array.`, [], 'start', ['pushDefine'], `Start heappush${mode === 'max' ? '_max' : ''}`, [['value', value]]);
    values.push(value);
    let child = values.length - 1;
    snapshot(`Append ${value} at index ${child}. The complete tree gains its next available position.`, [child], 'append', ['pushAppend', 'pushChild'], 'Append the value', [['value', value], ['child', child]]);
    while (child > 0) {
      const parent = Math.floor((child - 1) / 2);
      const locals = () => [['value', value], ['child', child], ['parent', parent]];
      comparisons++;
      const preferred = comesBefore(values[child], values[parent], mode);
      snapshot(`Compare new value ${values[child]} at index ${child} with parent ${values[parent]} at index ${parent}. ${preferred ? `The child is ${before} the parent, so swap upward.` : 'The parent order is satisfied; stop here.'}`, [parent, child], 'compare', ['pushLoop', 'pushParent', 'pushCompare', ...(!preferred ? ['pushStop'] : [])], preferred ? 'Compare child and parent' : 'Stop sift-up', locals());
      if (!preferred) break;
      swap(parent, child, 'pushSwap', 'Swap up', locals());
      child = parent;
      snapshot(`Continue sift-up from index ${child}, where the pushed value ${value} now sits.`, [child], 'select', ['pushMove'], 'Move up', locals());
    }
    snapshot(`Heappush complete. ${value} is in the heap, and ${values[0]} is at the root.`, [], 'done', ['pushReturn'], 'Return None', [['value', value], ['child', child], ['return', 'None']]);
  } else {
    snapshot(`Pop the root of the completed ${mode} heap. The return value will be ${values[0]}.`, [0], 'start', ['popDefine', 'popEmpty'], 'Check for an empty heap');
    removed = values[0];
    if (values.length === 1) {
      snapshot(`Save root ${removed} as the return value. This is the only value in the heap.`, [0], 'remove', ['popSave', 'popSingle'], 'Save the only root');
      values.pop();
      snapshot(`Remove the only value, ${removed}. The heap is now empty.`, [], 'remove', ['popOnlyRemove'], 'Remove the only value');
    } else {
      const last = values.length - 1;
      snapshot(`Save root ${removed} as the return value. The last value, ${values[last]} at index ${last}, will replace the root next.`, [0, last], 'remove', ['popSave', 'popSingle'], 'Save the root');
      const lastValue = values.pop();
      values[0] = lastValue;
      snapshot(`Replace the root with ${values[0]} and remove the last array position. Sift the replacement down to restore parent order.`, [0], 'replace', ['popTail', 'popReplace'], 'Replace the root', [['last', lastValue]]);
      snapshot('Call sift-down from index 0 to restore the parent order.', [0], 'select', ['popCall'], 'Call sift-down', [['last', lastValue]]);
      siftDown(0);
    }
    snapshot(`Heappop complete. Return ${removed}. ${values.length ? `The new root is ${values[0]}.` : 'The heap is empty.'}`, [], 'done', [input.length === 1 ? 'popOnlyReturn' : 'popReturn'], 'Return the removed root', [['return', removed]]);
  }
  return {frames, result: [...values], removed, mode, operation};
}
