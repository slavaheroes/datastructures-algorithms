export default {
  pattern: 'Repeatedly remove the two largest values',
  problem: 'Smash the two heaviest stones until at most one remains. Equal stones both disappear; otherwise insert a stone whose weight is their difference. Return the final weight, or 0.',
  example: 'stones = [2,7,4,1,8,1]\n8 and 7 → 1; 4 and 2 → 2; 2 and 1 → 1\n1 and 1 disappear; final stone = 1\nOutput: 1',
  insight: 'A max-heap exposes the heaviest stone at its root without sorting again after every smash. The source uses Python 3.14 max-heap functions directly and heapifies stones in place. Every round removes two values and puts back at most one, so the number of stones decreases.',
  steps: ['Call heapify_max(stones) to organize the supplied list as a max-heap.', 'While at least two stones remain, call heappop_max twice to get the two heaviest.', 'If the weights differ, push max(x, y) − min(x, y) into the max-heap. Otherwise insert nothing.', 'Return the remaining root if the heap is nonempty; return 0 if every stone disappeared.'],
  complexity: 'O(n) heap construction followed by at most n − 1 rounds of O(log(n + 1)) heap work: O(n log(n + 1)) time. O(1) auxiliary space because the original stones list is the heap.',
  pitfall: 'The source mutates stones. Although the first popped value is at least the second, it explicitly calculates max and min before taking the difference. Do not mix min-heap heappush/heappop with this max-heap.'
};
