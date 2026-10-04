export default {
  id: 'quick', label: 'Quick sort',
  explanation: 'Choose the last value as pivot, partition smaller values to its left, then sort both sides. Average O(n log n), worst O(n²) time (including sorted or equal inputs here). Recursive space: average O(log n), worst O(n). Not stable.',
  sort({values, record, compare, swap}) {
    function quickSort(low, high) {
      if (low >= high) return;
      const pivot = values[high];
      let position = low;
      record(`Choose the last value, ${pivot}, as pivot.`, [high]);
      for (let j = low; j < high; j++) {
        compare(j, high);
        if (values[j] < pivot) swap(position++, j);
      }
      swap(position, high);
      record(`Pivot ${pivot} is in its final position ${position}.`, [position]);
      quickSort(low, position - 1);
      quickSort(position + 1, high);
    }
    quickSort(0, values.length - 1);
  }
};
