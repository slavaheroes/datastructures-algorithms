export default {
  id: 'quick', label: 'Quick sort',
  explanation: 'Choose the last value as pivot, partition smaller values to its left, then sort both sides. Average O(n log n), worst O(n²) time (including sorted or equal inputs here). Recursive space: average O(log n), worst O(n). Not stable.',
  code: {
    title: 'Quick sort', language: 'Python', returnLine: 17,
    source: `def quick_sort(values):
    def sort_range(low, high):
        if low >= high:
            return
        pivot = values[high]
        position = low
        for j in range(low, high):
            if values[j] < pivot:
                if position != j:
                    values[position], values[j] = values[j], values[position]
                position += 1
        if position != high:
            values[position], values[high] = values[high], values[position]
        sort_range(low, position - 1)
        sort_range(position + 1, high)
    sort_range(0, len(values) - 1)
    return values`
  },
  sort({values, record, compare, swap}) {
    const calls = [];
    function quickSort(low, high) {
      calls.push(`sort_range(${low}, ${high})`);
      const bounds = [['low', low], ['high', high], ['call stack', calls.join(' → ')]];
      if (low >= high) {
        record(`Range [${low}, ${high}] has at most one value. Return from this base case.`, low === high ? [low] : [], {
          codeLines: [3, 4], operation: 'Return from base case', variables: bounds
        });
        calls.pop(); return;
      }
      const pivot = values[high];
      let position = low;
      const state = (j = null, extra = []) => [...bounds, ['pivot', pivot], ['position', position], ['j', j ?? '—'], ...extra];
      record(`Choose the last value, ${pivot}, as pivot. Set the boundary position to ${low}.`, [high], {
        codeLines: [5, 6], operation: 'Choose pivot and boundary', variables: state()
      });
      for (let j = low; j < high; j++) {
        const smaller = values[j] < pivot;
        compare(j, high, {
          codeLines: [7, 8], operation: 'Compare with pivot', variables: state(j, [['values[j]', values[j]], ['values[j] < pivot', smaller]])
        });
        if (smaller) {
          const samePosition = position === j;
          swap(position, j, {
            codeLines: samePosition ? [9] : [9, 10], operation: samePosition ? 'Keep smaller value in place' : 'Move smaller value left', variables: state(j)
          });
          position++;
          record(`Advance position to ${position}. All values before this boundary in the current range are smaller than the pivot.`, [], {
            codeLines: [11], operation: 'Advance partition boundary', variables: state(j)
          });
        }
      }
      const pivotAlreadyPlaced = position === high;
      swap(position, high, {
        codeLines: pivotAlreadyPlaced ? [12] : [12, 13], operation: pivotAlreadyPlaced ? 'Keep pivot in place' : 'Place pivot', variables: state(high - 1)
      });
      record(`Pivot ${pivot} is in its final position ${position}. Smaller values are to its left; values greater than or equal to it are to its right.`, [position], {
        codeLines: pivotAlreadyPlaced ? [12] : [13], operation: 'Partition complete', variables: state(high - 1)
      });
      record(`Sort the left range [${low}, ${position - 1}], excluding the pivot.`, [position], {
        codeLines: [14], operation: 'Recurse into left partition', variables: state(high - 1)
      });
      quickSort(low, position - 1);
      record(`The left range has returned. Sort the right range [${position + 1}, ${high}], excluding the pivot.`, [position], {
        codeLines: [15], operation: 'Recurse into right partition', variables: state(high - 1)
      });
      quickSort(position + 1, high);
      calls.pop();
    }
    record(`Call sort_range(0, ${values.length - 1}) to sort the complete array. high is inclusive.`, [], {
      codeLines: [16], operation: 'Start quick sort', variables: [['low', 0], ['high', values.length - 1]]
    });
    quickSort(0, values.length - 1);
  }
};
