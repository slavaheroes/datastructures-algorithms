export const NODE_LIMIT = 16;

export function numberArray(text, max = 64) {
  const data = JSON.parse(text);
  if (!Array.isArray(data) || data.length > max || !data.every(Number.isSafeInteger)) throw Error(`Use a JSON array of up to ${max} safe integers.`);
  return data;
}
