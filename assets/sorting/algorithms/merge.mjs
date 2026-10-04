export default {
  id: 'merge', label: 'Merge sort',
  explanation: 'Split into halves, sort each half, then merge by repeatedly taking the smaller front value. All cases O(n log n) time; O(n) auxiliary space. Stable because ties come from the left half first.',
  sort({values, countComparison, record, write}) {
    function mergeSort(low, high) {
      if (high - low < 2) return;
      const middle = Math.floor((low + high) / 2);
      mergeSort(low, middle);
      mergeSort(middle, high);
      const left = values.slice(low, middle), right = values.slice(middle, high);
      let i = 0, j = 0, index = low;
      while (i < left.length || j < right.length) {
        if (i < left.length && j < right.length) {
          countComparison();
          record(`Merge: compare ${left[i]} and ${right[j]} from the temporary halves.`, [index]);
        }
        const next = j >= right.length || (i < left.length && left[i] <= right[j]) ? left[i++] : right[j++];
        write(index++, next);
      }
    }
    mergeSort(0, values.length);
  }
};
