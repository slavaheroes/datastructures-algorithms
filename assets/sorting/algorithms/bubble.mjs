export default {
  id: 'bubble', label: 'Bubble sort',
  explanation: 'Compare adjacent values and swap out-of-order pairs. Each pass moves the largest remaining value to the end. Best O(n) with early exit; average/worst O(n²) time; O(1) auxiliary space. Stable.',
  code: {
    title: 'Bubble sort', language: 'Python', returnLine: 10,
    source: `def bubble_sort(values):
    for end in range(len(values) - 1, 0, -1):
        changed = False
        for i in range(end):
            if values[i] > values[i + 1]:
                values[i], values[i + 1] = values[i + 1], values[i]
                changed = True
        if not changed:
            break
    return values`
  },
  sort({values, compare, swap, record}) {
    if (values.length < 2) record('There are no adjacent pairs to compare. The pass loop is empty.', [], {
      codeLines: [2], operation: 'No passes needed', variables: [['len(values)', values.length]]
    });
    for (let end = values.length - 1; end > 0; end--) {
      let changed = false;
      const variables = (i = null, extra = []) => [['end', end], ['i', i ?? '—'], ['changed', changed], ...extra];
      record(`Start a pass through indices 0 to ${end}. Set changed = False.`, [], {
        codeLines: [2, 3], operation: 'Start pass', variables: variables()
      });
      for (let i = 0; i < end; i++) {
        const outOfOrder = values[i] > values[i + 1];
        compare(i, i + 1, {
          codeLines: [4, 5], operation: 'Compare adjacent values',
          variables: variables(i, [['values[i]', values[i]], ['values[i + 1]', values[i + 1]], ['values[i] > values[i + 1]', outOfOrder]])
        });
        if (outOfOrder) {
          swap(i, i + 1, {codeLines: [6], operation: 'Swap adjacent values', variables: variables(i)});
          changed = true;
          record('A swap occurred in this pass. Set changed = True.', [i, i + 1], {
            codeLines: [7], operation: 'Mark pass as changed', variables: variables(i)
          });
        }
      }
      if (!changed) {
        record('No swaps occurred. Every adjacent pair is already ordered, so stop the pass loop early.', [], {
          codeLines: [8, 9], operation: 'Early exit', variables: variables(end - 1)
        });
        break;
      }
      record(`This pass moved the largest remaining value to index ${end}. changed is True, so continue to the next pass.`, [end], {
        codeLines: [8], operation: 'Finish pass', variables: variables(end - 1)
      });
    }
  }
};
