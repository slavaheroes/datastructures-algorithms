export function createTrace(input) {
  const values = [...input], steps = [];
  let comparisons = 0, writes = 0;
  function record(message, active = []) {
    steps.push({values: [...values], active, message, comparisons, writes});
  }
  return {
    values, steps, record,
    countComparison() { comparisons++; },
    compare(left, right) {
      comparisons++;
      record(`Compare ${values[left]} and ${values[right]}.`, [left, right]);
    },
    swap(left, right) {
      if (left === right) return;
      [values[left], values[right]] = [values[right], values[left]];
      writes += 2;
      record(`Swap positions ${left} and ${right}.`, [left, right]);
    },
    write(index, value) {
      values[index] = value;
      writes++;
      record(`Write ${value} to position ${index} from the temporary halves.`, [index]);
    }
  };
}
