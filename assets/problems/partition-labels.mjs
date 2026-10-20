import {mountPartitionLabels} from '../visualizations/greedy-lessons.mjs';

export default {
  pattern: 'Extend a partition through every letter’s last occurrence',
  problem: 'Split a string into as many contiguous parts as possible so each letter appears in at most one part. Return the lengths of those parts.',
  example: 's = "ababcbacadefegdehijhklij"\nParts: "ababcbaca", "defegde", "hijhklij"\nOutput: [9,7,8]',
  insight: 'Once a letter enters a partition, that partition must extend through the letter’s last occurrence. Any new letters inside that extension can force its end farther right. Close at the first position satisfying every such requirement; closing later would reduce the number of parts unnecessarily.',
  steps: ['First version: map each letter to [first index, last index]. Start a partition from the first/last range of the letter at i.', 'Scan j from that start through the growing end, extending end with letters[s[j]][1]. Once j passes end, append end − start + 1 and resume at end + 1.', 'Reference: store only the last index for every letter. Maintain end and size in one left-to-right pass.', 'At each character, set end to the greater of its old value and the character’s last position, then increment size.', 'When i == end, append size and reset size to 0. Both versions return [] for an empty string.'],
  complexity: 'Both versions take O(n) expected time and O(u) auxiliary space for u distinct letters, excluding the result. The first version’s nested scan is still linear because committed partitions are disjoint. The result has at most n lengths. With a fixed lowercase alphabet, u ≤ 26, so dictionary storage is bounded.',
  pitfall: 'The first version can use a letter’s first index as the new start because every letter in an earlier completed partition also ends there; it cannot appear again in a later part. Extend the required end before deciding to close. Neither source version mutates the input string.'
};

export const mountVisualization = mountPartitionLabels;
