export const HEAP_LIMIT = 16;

export function parseHeapArray(text) {
  let values;
  try { values = JSON.parse(text); }
  catch { throw Error('Use a JSON array of integers, such as [12,3,9,1,8,2,7].'); }
  validateHeapArray(values);
  return values;
}

export function validateHeapArray(values) {
  if (!Array.isArray(values) || values.length > HEAP_LIMIT || !values.every(Number.isSafeInteger)) {
    throw Error(`Use a JSON array of up to ${HEAP_LIMIT} safe integers. Use [] for an empty heap.`);
  }
}

export function comesBefore(left, right, mode) {
  return mode === 'max' ? left > right : left < right;
}

export function heapViolations(values, mode) {
  const violations = [];
  for (let child = 1; child < values.length; child++) {
    const parent = Math.floor((child - 1) / 2);
    if (comesBefore(values[child], values[parent], mode)) violations.push(child);
  }
  return violations;
}
