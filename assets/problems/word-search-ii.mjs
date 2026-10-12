import {mountWordSearch} from '../visualizations/trie-lessons.mjs';

export default {
  pattern: 'Trie prefixes with board backtracking',
  problem: 'Find the candidate words that can be formed by moving between horizontally or vertically adjacent board cells. A cell may be used at most once in one word path. Return each found word once.',
  example: 'board = [["o","a","a","n"], ["e","t","a","e"], ["i","h","k","r"], ["i","f","l","v"]]\nwords = ["oath", "pea", "eat", "rain"]\nOutput: ["oath", "eat"]',
  insight: 'Insert all candidate words into one PrefixTree and store each word’s input index at its terminal node. Start DFS from every board cell. Follow a board letter only when the current trie node has that child, so a path stops as soon as it cannot be a candidate prefix. The visited set prevents cell reuse within the current path.',
  steps: [
    'Build the trie. Set is_end and index on each word’s final node, then start results and visited as empty collections.',
    'For each starting cell in row-major order, call dfs(root, row, column, visited). Return immediately for an out-of-bounds coordinate or a cell already in visited.',
    'If the board letter is an existing trie child, move to that child and add the cell to visited. Otherwise return without exploring neighbors.',
    'At a word ending, set node.is_end = False and append words[node.index]. This stops later paths from adding the same word again; it leaves the trie edges intact.',
    'Recursively visit up, down, left, then right. After all four calls return, remove the current cell from visited so other paths can use it.',
    'In the example, o → a → t → h finds oath. Later, e → a → t finds eat. Neither pea nor rain has a valid board path.'
  ],
  complexity: 'Let S be the total candidate character count, M × N the board size, and L the longest word length. Building the trie takes O(S) time and space. A loose search bound is O(MN · 4 · 3^(L − 1)) for nonempty words: at most four first moves and at most three subsequent moves without revisiting the previous cell; trie prefix checks often stop much earlier. Auxiliary space is O(S + min(L, MN)) for the trie, visited path, and recursion, excluding the returned words. Playback snapshots use additional space outside this algorithmic bound.',
  pitfall: 'visited belongs to the current DFS path, so discard each cell on backtracking. This source clears terminal flags after finding words; it does not remove trie nodes or stop searching after every word is found. It assumes a nonempty rectangular board. Duplicate candidate strings share one terminal node, whose index is overwritten by the last duplicate; the word is still returned only once.'
};

export const mountVisualization = mountWordSearch;
