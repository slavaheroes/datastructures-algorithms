# Data structures and algorithms

A personal study site with data structure visualizations, sorting, heaps, graph algorithms, and NeetCode Python explanations. Hosted on GitHub Pages.

## Environment

Install [uv](https://docs.astral.sh/uv/getting-started/installation/), then run:

```sh
uv python install 3.14
uv venv --python 3.14
uv run --no-project python -c "import heapq; a = [2, 7, 3]; heapq.heapify_max(a); print(a)"
```

`.python-version` selects Python 3.14, which provides public max-heap functions including `heapify_max`. The repo intentionally has no pyproject.toml, Makefile, pre-commit, or Python dependencies. uv manages the interpreter and `.venv`; no dependency lockfile is needed. Existing practice files remain in `algoexpert/` and `neetcode/`; some depend on coding-platform-provided names and are not standalone modules.

## Local preview

```sh
uv run --no-project python scripts/build.py
uv run --no-project python scripts/serve.py
```

Open [localhost:8000](http://localhost:8000). Serve over HTTP, rather than opening index.html as a file, because lessons use fetch. The frontend uses vanilla HTML/CSS/JavaScript; no npm install or compilation is needed. The site uses system fonts and has no external frontend dependencies.

The local preview disables browser caching so rebuilt scripts and styles load after a refresh. If an already-open tab still uses an earlier preview, press Ctrl+F5 once to reload all assets. Build again after editing website files, since the server serves `_site/`.

Each build adds a content-based version query to the staged scripts and styles, including nested imports. The lesson loader uses the same version for its catalog, problem modules, and Python source URLs. This prevents a new page from reusing earlier deployment assets while keeping the original source paths and Python contents intact. GitHub Pages can cache the HTML itself for ten minutes; after an update, use Cmd+Shift+R in Chrome on Mac or Ctrl+Shift+R on Windows/Linux to reload an already-open page. Clearing cookies does not clear cached files or the current tab’s loaded lesson list.

## Pages and visualizer modules

`#data-structures` opens an overview with links to Trees, Graphs, and Union Find. Each has a separate workspace at `#data-structures/trees`, `#data-structures/graphs`, and `#data-structures/union-find`. `#algorithms` lists Merge and Quick Sort, Heap, and six standalone graph algorithm workspaces. Sorting and Heap use `#algorithms/merge-sort`, `#algorithms/quick-sort`, and `#algorithms/heap`. Previous `#sorting`, `#algorithms/sorting`, and `#algorithms/bubble-sort` links redirect to Merge Sort. Removed DFS cycle detection, Multi-source BFS, and `#algorithms/pathfinding-comparison` workspace links redirect to the Algorithms overview; related NeetCode lessons remain available. `#structures` redirects to Trees.

`assets/app.mjs` handles routing and loads page modules on demand. `assets/pages/data-structures.mjs` and `assets/pages/algorithms.mjs` list their sections, while `assets/pages/sections.mjs` builds the common page layout. Each tool mounts on its first visit; only the selected tool is attached to the page. Visualizers keep their state when switching tools or pages, and playback pauses when leaving a tool.

Tree and graph modules live in `assets/data-structures/trees/` and `assets/data-structures/graphs/`. Each folder separates input logic (`model.mjs`), markup (`template.mjs`), rendering (`view.mjs`), and controls (`visualizer.mjs`). Shared input validation and DOM helpers live in `assets/shared/`. CSS is split by feature in `assets/styles/`, imported through `assets/styles.css`.

To add a data structure section, create its visualizer module with a mount function accepting a container, then add an entry to the appropriate page's `sections` array. A mount function can return `{deactivate()}` to pause timers when leaving the tool. Future sections can be added without changing the router or existing visualizers.

Sorting modules live in `assets/sorting/`. Merge and Quick Sort each have their own file in `assets/sorting/algorithms/`, including their display name, complexity explanation, and `sort(trace)` function. `availableSortingAlgorithms` in `assets/sorting/registry.mjs` controls the visible workspaces. The full trace registry retains Bubble Sort for existing consumers and CI checks, but the website no longer offers its workspace. Each workspace uses the shared sorting visualizer with a fixed algorithm and its own playback state. `trace.mjs` records comparisons, swaps, writes, and snapshots for shared playback. `assets/algorithms.mjs` retains the original exported functions for existing consumers and CI checks.

Heap modules live in `assets/heap/`. The Heap workspace shows a complete binary tree and its indexed array together. Choose a min heap or max heap, then step through `heapify`, `heappush`, or `heappop` with up to 16 values. Playback highlights comparisons and swaps, supports Back and Reset, and pauses when leaving the workspace. Finish the current operation before starting another so the next operation uses its completed result. The explanations distinguish O(n) bottom-up heap construction from O(log n) insertion and removal; heap order does not imply a sorted array.

The sorting, Heap, and standalone graph workspaces include Python code with numbered lines, the current operation, and variable values for the selected playback step. The diagram and code advance together with Play, Step, Back, and Reset. Code appears beside the diagram on wide screens and below it on narrow screens; its own scroll area follows the active line. Sorting code lives with each sorting algorithm, and heap code in `assets/heap/code.mjs` follows the selected operation and min/max mode. `assets/shared/algorithm-code.mjs` renders the shared panel. The Python listings describe the visualized implementations; heap sifts remain a teaching implementation rather than the exact internal moves of Python’s heapq.

The code panel uses Python syntax colors and wraps long statements by default; Wrap lines switches to the original horizontal layout. Array values and recursion stacks occupy the full state area so their contents remain readable. Active line numbers stay tied to the source statements when a statement wraps across multiple display rows.

## Graph algorithms

Algorithms includes six standalone graph workspaces, each with an explanation, ordered steps, complexity, editable examples, and Python code synchronized with the diagram and state table:

- `#algorithms/kahn-topological-sort`: indegrees, the ready queue, dependency ordering, and nodes blocked by a cycle.
- `#algorithms/dijkstra`: nonnegative weighted shortest paths, tentative and finalized distances, predecessor edges, and stale priority-queue entries.
- `#algorithms/bellman-ford`: repeated edge relaxation, early stopping, negative edges, and reachable negative-cycle detection. An unreachable negative cycle does not invalidate the source's result.
- `#algorithms/prim`: an undirected minimum spanning tree, its candidate edges, and total weight. Disconnected input reports that no spanning tree exists.
- `#algorithms/union-find`: union by size, recursive path compression, parent-pointer forests, component sizes, and redundant connections. The same tool is also available under Data structures.
- `#algorithms/hierholzer`: directed Eulerian trails, unused edges, the traversal stack, and the reverse route. Degree, start, and connectivity checks explain invalid inputs.

Each graph has 1–16 nodes labeled 0 through n − 1, including isolated nodes, and up to 64 input edges. Edges are JSON pairs or weighted triples; parallel edges and self-loops retain separate IDs. Weights are integers from −999 to 999, with negative weights rejected by Dijkstra. Load a preset or edit the graph and sources, then use Play/Pause, Back, Step, Reset, speed, or the step slider. Graph as text preserves the numbered adjacency entries for dense examples. Playback pauses when changing workspaces or hiding the browser tab, and invalid input keeps the last accepted visualization.

`assets/graph-algorithms/` separates definitions and traces (`traversal.mjs`, `weighted.mjs`, `connectivity.mjs`) from input validation, diagram rendering, shared playback, and the registry. The standalone Python listings describe these teaching implementations; related NeetCode lessons continue to load the original practice files unchanged. Priority queues are displayed in sorted priority order, not as internal heap arrays. Complexity excludes the snapshots stored for playback.

## NeetCode lessons

The site covers 112 problems across 14 topics: all nine Arrays & Hashing, seven Stacks, five Two Pointers, six Sliding Window, eleven Linked List, fifteen Trees, seven Binary Search, three Tries, seven Heap, nine Backtracking, thirteen Graphs, six Advanced Graphs, six Intervals, and eight Greedy problems. The remaining NeetCode 150 categories are not yet lessons on the site. `#practice` shows the topic browser with each topic collapsed and its problem count visible; choose a topic to expand its problems. No lesson is selected or imported automatically. Selecting a problem opens its lesson beside the topic list on wide screens. All topics returns to the collapsed browser. Each problem has its own link, such as `#practice/largest-rectangle-in-histogram`, and its own JavaScript module in `assets/problems/`. Direct lesson links open their selected topic. Approach starts expanded; Steps, Python solution, Notes, and optional visualizations can be expanded independently.

While reading a lesson, Hide topics gives the lesson the full width, and Show topics brings the list back. The header’s moon icon switches to night colors; the sun icon switches to light colors. Night uses charcoal surfaces with blue accents and amber operation highlights. The choice is saved locally; without a saved choice the site follows the system color preference.

`assets/problems.json` lists each problem's category, module, and original Python source path. Edit the explanation in the problem's module. Python source is fetched directly from its listed `neetcode/` file when the Python solution section opens; the build copies that exact file into `_site/`. Generate Parentheses reuses `neetcode/backtracking/generateParenthesis.py`.

For a problem-specific visualization, export `mountVisualization(root)` from that problem's module. Mount its controls and drawing inside `root`, and return a cleanup function to stop timers and remove external event listeners when navigating away. The shared lesson renderer in `assets/lessons.mjs` adds a collapsible Visualization section automatically. Largest Rectangle in Histogram, Container With Most Water, and Trapping Rain Water demonstrate this hook with custom heights and step, play/pause, and reset controls. The water lessons own their algorithm snapshots and share controls and SVG drawing through `assets/visualizations/height-playback.mjs`. Trapping Rain Water includes both source implementations with a solution-version selector.

All six Sliding Window lessons and Linked List Cycle have editable examples with Play/Pause, Back, Step, Reset, and speed controls. `assets/visualizations/sequence-playback.mjs` owns their controls and cleanup; `sliding-window.mjs` and `linked-list-cycle.mjs` own the traces. Longest Substring Without Repeating Characters and Sliding Window Maximum offer both source versions. Floyd's visualization separates the saved detection implementation from standard initialization and the cycle-entry phase. Its proof explains equality modulo cycle length, including extra laps. Playback pauses when the disclosure closes, the tab becomes hidden, or the lesson changes.

Reorder List, Remove Nth Node From End, and Permutation in String have new source files in their respective `neetcode/` categories. Existing practice solutions remain unchanged. Lesson explanations describe every stored version, including platform assumptions and source-specific complexity differences.

Lowest Common Ancestor of a BST, Binary Tree Level Order Traversal, Construct Binary Tree from Preorder and Inorder Traversal, and Binary Tree Maximum Path Sum have editable tree examples and playback in `assets/visualizations/tree-lessons.mjs`. Tree inputs use compact level order with `null` for missing children, and allow up to 16 actual nodes. Other Trees lessons link to the Trees data structure visualizer. Invert Binary Tree adds the missing source at `neetcode/trees/invertTree.py`; the other tree sources are unchanged.

Find Minimum in Rotated Sorted Array and Median of Two Sorted Arrays have editable array examples in `assets/visualizations/binary-search.mjs`. Their traces show the shrinking search interval and the two-array partition boundaries respectively, following the listed Python implementations. Both use the shared lesson playback controls and pause when leaving the lesson or closing the visualization.

Word Search II has an editable board and word list in `assets/visualizations/trie-lessons.mjs`. Playback follows trie prefixes, marks the current board path, rejects cell reuse, restores visited cells during backtracking, and shows found words. Task Scheduler and Find Median from Data Stream use `assets/visualizations/heap-lessons.mjs`: the former shows the ready max heap, cooldown queue, and execution timeline; the latter shows the lower max heap, upper min heap, rebalancing, and median after each insertion. These visualizations use the shared lesson playback controls and pause when their disclosure closes or the lesson changes.

Kth Largest Element in an Array adds the missing source at `neetcode/heap/kthLargestElement.py`. The remaining Tries and Heap lessons load the original repository solutions unchanged, including their Python 3.14 max-heap calls.

Backtracking, Graphs, Advanced Graphs, Intervals, and Greedy lessons load the existing Python sources unchanged. The following 17 lessons add editable step-by-step visualizations, using the same playback controls and cleanup as the earlier lessons:

- Backtracking: Combination Sum and N-Queens, in `assets/visualizations/backtracking-lessons.mjs`.
- Graphs: Rotting Oranges, Course Schedule II, Redundant Connection, and Word Ladder, in `assets/visualizations/graph-lessons.mjs`.
- Advanced Graphs: Reconstruct Itinerary, Alien Dictionary, Cheapest Flights Within K Stops, and Min Cost to Connect All Points, in `assets/visualizations/advanced-graph-lessons.mjs`.
- Intervals: Non-overlapping Intervals, Meeting Rooms II, and Minimum Interval to Include Each Query, in `assets/visualizations/interval-lessons.mjs`.
- Greedy: Jump Game II, Gas Station, Partition Labels, and Valid Parenthesis String, in `assets/visualizations/greedy-lessons.mjs`.

Visualizations show source-specific state, including pruning, queues, disjoint sets, topological ordering, heap candidates, and interval boundaries. Version selectors compare multiple saved implementations where present. Input bounds and trace limits keep searches small enough for playback; errors leave the last accepted example available. The Jump Game II lesson describes a limitation of the first saved implementation and compares it with the reference frontier solution. Graph examples accept at most 16 distinct nodes, including isolated courses. No NeetCode Python solutions are executed by the site build.
