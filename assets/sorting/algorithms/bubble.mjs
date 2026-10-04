export default {
  id: 'bubble', label: 'Bubble sort',
  explanation: 'Compare adjacent values and swap out-of-order pairs. Each pass moves the largest remaining value to the end. Best O(n) with early exit; average/worst O(n²) time; O(1) auxiliary space. Stable.',
  sort({values, compare, swap}) {
    for (let end = values.length - 1; end > 0; end--) {
      let changed = false;
      for (let i = 0; i < end; i++) {
        compare(i, i + 1);
        if (values[i] > values[i + 1]) { swap(i, i + 1); changed = true; }
      }
      if (!changed) break;
    }
  }
};
