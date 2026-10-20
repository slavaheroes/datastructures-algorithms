import {mountAlienDictionary} from '../visualizations/advanced-graph-lessons.mjs';

export const mountVisualization = mountAlienDictionary;

export default {
  pattern: 'First differing characters and Kahn topological sorting',
  problem: 'The words are sorted using an unknown alphabet. Return one character ordering consistent with those words, including every character that occurs. Return an empty string when the ordering is impossible.',
  example: 'words = ["wrt","wrf","er","ett","rftt"]\nOutput: "wertf"\nThe adjacent words imply t→f, w→e, r→t, and e→r.',
  insight: 'For each adjacent pair of words, only the first differing position establishes a character order. Store that directed edge once and count incoming edges. Characters with no incoming edges can appear next; removing their outgoing edges repeatedly produces a topological order.',
  steps: ['Create an empty neighbor set and zero indegree for every character, including characters that never participate in a comparison edge.', 'Compare adjacent words. If the earlier word is longer and starts with the entire later word, return "": no alphabet can make that prefix order valid.', 'At the first mismatch, add previousCharacter → currentCharacter unless that edge already exists, increment its destination indegree once, then stop comparing this pair.', 'Queue every zero-indegree character. Pop from the left into res, decrement each outgoing neighbor’s indegree, and queue a neighbor when its indegree becomes zero.', 'Return the joined result only if it contains every distinct character. Otherwise a directed cycle prevented a complete ordering, so return "".'],
  complexity: 'Let M be the total number of input characters, V the number of distinct characters, and E the number of distinct precedence edges. O(M + V + E) time and O(V + E) auxiliary space. With a fixed 26-letter alphabet the graph storage has a constant upper bound; describing it as V + E also explains how the method scales with a larger alphabet.',
  pitfall: 'Do not add constraints from positions after the first mismatch, and do not count a duplicate edge twice. A shorter word before its longer extension is valid; the opposite order is invalid. Multiple valid answers may exist. The Python source iterates neighbor sets, whose order is unspecified; the animation uses edge insertion order for repeatable playback. The saved method is named foreignDictionary.'
};
