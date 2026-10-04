export const byId = (root, id) => root.querySelector(`#${id}`);
export const escape = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[char]));

export function guarded(errorElement, action) {
  errorElement.textContent = '';
  try { action(); } catch (error) { errorElement.textContent = error.message; }
}

export function integer(input) {
  const raw = input.value.trim(), value = Number(raw);
  if (!raw || !Number.isSafeInteger(value)) throw Error('Enter a safe integer in each numeric field.');
  return value;
}

export const svgNode = (x, y, value) => `<g class="node"><circle cx="${x}" cy="${y}" r="23"/><text x="${x}" y="${y}">${value}</text><title>Node ${value}</title></g>`;
