export default {
  id: 'merge', label: 'Merge sort',
  explanation: 'Split into halves, sort each half, then merge by repeatedly taking the smaller front value. All cases O(n log n) time; O(n) auxiliary space. Stable because ties come from the left half first.',
  code: {
    title: 'Merge sort', language: 'Python', returnLine: 22,
    source: `def merge_sort(values):
    def sort_range(low, high):
        if high - low < 2:
            return
        middle = (low + high) // 2
        sort_range(low, middle)
        sort_range(middle, high)
        left = values[low:middle]
        right = values[middle:high]
        i = j = 0
        index = low
        while i < len(left) or j < len(right):
            if j >= len(right) or (i < len(left) and left[i] <= right[j]):
                next_value = left[i]
                i += 1
            else:
                next_value = right[j]
                j += 1
            values[index] = next_value
            index += 1
    sort_range(0, len(values))
    return values`
  },
  sort({values, countComparison, record, write}) {
    const calls = [];
    function mergeSort(low, high) {
      calls.push(`sort_range(${low}, ${high})`);
      const bounds = [['low', low], ['high', high], ['call stack', calls.join(' → ')]];
      const activeRange = Array.from({length: high - low}, (_, offset) => low + offset);
      if (high - low < 2) {
        record(`Range [${low}, ${high}) has ${high - low} values. Return from this base case.`, activeRange, {
          codeLines: [3, 4], operation: 'Return from base case', variables: bounds
        });
        calls.pop(); return;
      }
      const middle = Math.floor((low + high) / 2);
      record(`Split range [${low}, ${high}) at middle = ${middle}.`, activeRange, {
        codeLines: [3, 5], operation: 'Split range', variables: [...bounds, ['middle', middle]]
      });
      record(`Sort the left half [${low}, ${middle}) first.`, activeRange, {
        codeLines: [6], operation: 'Recurse into left half', variables: [...bounds, ['middle', middle]]
      });
      mergeSort(low, middle);
      record(`The left half is sorted. Sort the right half [${middle}, ${high}).`, activeRange, {
        codeLines: [7], operation: 'Recurse into right half', variables: [...bounds, ['middle', middle]]
      });
      mergeSort(middle, high);
      const left = values.slice(low, middle), right = values.slice(middle, high);
      record('Both halves are sorted. Copy them into temporary left and right arrays.', activeRange, {
        codeLines: [8, 9], operation: 'Copy sorted halves', variables: [...bounds, ['middle', middle], ['left', left], ['right', right]]
      });
      let i = 0, j = 0, index = low;
      const state = (extra = []) => [...bounds, ['middle', middle], ['left', left], ['right', right], ['i', i], ['j', j], ['index', index], ...extra];
      record(`Set both temporary-array pointers to 0 and the destination index to ${low}.`, [index], {
        codeLines: [10, 11], operation: 'Initialize merge pointers', variables: state()
      });
      while (i < left.length || j < right.length) {
        const takeLeft = j >= right.length || (i < left.length && left[i] <= right[j]);
        if (i < left.length && j < right.length) {
          countComparison();
          record(`Merge: compare ${left[i]} and ${right[j]} from the temporary halves. ${takeLeft ? 'Take the left value; ties also come from the left.' : 'Take the smaller right value.'}`, [index], {
            codeLines: [12, 13], operation: 'Compare temporary fronts', variables: state([['take left condition', takeLeft]])
          });
        } else {
          record(`${i >= left.length ? 'The left half is exhausted, so take from the right.' : 'The right half is exhausted, so take from the left.'} No value comparison is needed.`, [index], {
            codeLines: [12, 13], operation: 'Use remaining half', variables: state([['take left condition', takeLeft]])
          });
        }
        let next;
        if (takeLeft) {
          next = left[i]; i++;
          record(`Take ${next} from the left half and advance i to ${i}.`, [index], {
            codeLines: [14, 15], operation: 'Take from left', variables: state([['next_value', next]])
          });
        } else {
          next = right[j]; j++;
          record(`Take ${next} from the right half and advance j to ${j}.`, [index], {
            codeLines: [16, 17, 18], operation: 'Take from right', variables: state([['next_value', next]])
          });
        }
        write(index, next, {codeLines: [19], operation: 'Write merged value', variables: state([['next_value', next]])});
        index++;
        record(`Advance the destination index to ${index}.`, [], {
          codeLines: [20], operation: 'Advance destination', variables: state([['next_value', next]])
        });
      }
      record(`Both temporary halves are exhausted. Range [${low}, ${high}) is now sorted.`, activeRange, {
        codeLines: [12], operation: 'Finish merge', variables: state()
      });
      calls.pop();
    }
    record(`Call sort_range(0, ${values.length}) to sort the complete array. high is exclusive.`, [], {
      codeLines: [21], operation: 'Start merge sort', variables: [['low', 0], ['high', values.length]]
    });
    mergeSort(0, values.length);
  }
};
