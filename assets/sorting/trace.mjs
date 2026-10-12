export function createTrace(input) {
  const values = [...input], steps = [];
  let comparisons = 0, writes = 0;
  const snapshotValue = value => Array.isArray(value) ? value.map(snapshotValue) : value;
  function record(message, active = [], metadata = {}) {
    steps.push({
      values: [...values], active: [...active], message, comparisons, writes,
      codeLines: [...(metadata.codeLines || [])], operation: metadata.operation || 'Inspect',
      variables: (metadata.variables || []).map(([name, value]) => [name, snapshotValue(value)])
    });
  }
  return {
    values, steps, record,
    countComparison() { comparisons++; },
    compare(left, right, metadata = {}) {
      comparisons++;
      record(`Compare ${values[left]} and ${values[right]}.`, [left, right], {operation: 'Compare', ...metadata});
    },
    swap(left, right, metadata = {}) {
      if (left === right) {
        // Old callers skip self-swaps silently; mapped code steps explain the guard.
        if (metadata.codeLines?.length) record(`Both positions are ${left}. Keep ${values[left]} in place; no array writes are needed.`, [left], {operation: 'Keep in place', ...metadata});
        return;
      }
      [values[left], values[right]] = [values[right], values[left]];
      writes += 2;
      record(`Swap positions ${left} and ${right}.`, [left, right], {operation: 'Swap', ...metadata});
    },
    write(index, value, metadata = {}) {
      values[index] = value;
      writes++;
      record(`Write ${value} to position ${index} from the temporary halves.`, [index], {operation: 'Write', ...metadata});
    }
  };
}
