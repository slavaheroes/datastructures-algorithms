export function sortBars(frame) {
  const low = Math.min(0, ...frame.values), high = Math.max(1, ...frame.values), span = high - low;
  return frame.values.map((value, index) => `<div class="bar ${frame.active.includes(index) ? 'active' : ''}" style="height:${18 + (value - low) / span * 80}%"><span>${value}</span></div>`).join('');
}
