// Keyed source rows keep playback highlights aligned with the displayed code.
export function heapCode(mode, operation) {
  if (!['min', 'max'].includes(mode) || !['heapify', 'heappush', 'heappop'].includes(operation)) {
    throw Error('Choose a heap type and operation.');
  }
  const suffix = mode === 'max' ? '_max' : '';
  const preferred = mode === 'max' ? '>' : '<';
  const ordered = mode === 'max' ? '<=' : '>=';
  const helper = [
    ['siftDefine', 'def _sift_down(heap, start):'],
    ['siftParent', '    parent = start'],
    ['siftLoop', '    while True:'],
    ['siftLeft', '        left = 2 * parent + 1'],
    ['siftRight', '        right = left + 1'],
    ['siftBest', '        best = parent'],
    ['siftCompareLeft', `        if left < len(heap) and heap[left] ${preferred} heap[best]:`],
    ['siftChooseLeft', '            best = left'],
    ['siftCompareRight', `        if right < len(heap) and heap[right] ${preferred} heap[best]:`],
    ['siftChooseRight', '            best = right'],
    ['siftStop', '        if best == parent:'],
    ['siftReturn', '            return'],
    ['siftSwap', '        heap[parent], heap[best] = heap[best], heap[parent]'],
    ['siftMove', '        parent = best']
  ];
  const operations = {
    heapify: [
      ['heapifyDefine', `def heapify${suffix}(heap):`],
      ['heapifyLastParent', '    last_parent = len(heap) // 2 - 1'],
      ['heapifyLoop', '    for start in range(last_parent, -1, -1):'],
      ['heapifyCall', '        _sift_down(heap, start)'],
      ['heapifyReturn', '    return None']
    ],
    heappush: [
      ['pushDefine', `def heappush${suffix}(heap, value):`],
      ['pushAppend', '    heap.append(value)'],
      ['pushChild', '    child = len(heap) - 1'],
      ['pushLoop', '    while child > 0:'],
      ['pushParent', '        parent = (child - 1) // 2'],
      ['pushCompare', `        if heap[child] ${ordered} heap[parent]:`],
      ['pushStop', '            break'],
      ['pushSwap', '        heap[parent], heap[child] = heap[child], heap[parent]'],
      ['pushMove', '        child = parent'],
      ['pushReturn', '    return None']
    ],
    heappop: [
      ['popDefine', `def heappop${suffix}(heap):`],
      ['popEmpty', '    if not heap:'],
      ['popRaise', '        raise IndexError("pop from an empty heap")'],
      ['popSave', '    removed = heap[0]'],
      ['popSingle', '    if len(heap) == 1:'],
      ['popOnlyRemove', '        heap.pop()'],
      ['popOnlyReturn', '        return removed'],
      ['popTail', '    last = heap.pop()'],
      ['popReplace', '    heap[0] = last'],
      ['popCall', '    _sift_down(heap, 0)'],
      ['popReturn', '    return removed']
    ]
  };
  const rows = [...operations[operation]];
  if (operation !== 'heappush') rows.push(['', ''], ['', ''], ...helper);
  return {
    title: `${operation}${suffix} (${mode} heap)`,
    language: 'Python',
    source: rows.map(([, source]) => source).join('\n'),
    lines: Object.fromEntries(rows.flatMap(([key], index) => key ? [[key, index + 1]] : []))
  };
}
