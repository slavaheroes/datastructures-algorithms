# Data structures and algorithms

A personal study site with data structure visualizations, sorting algorithms, and NeetCode Python explanations. Hosted on GitHub Pages.

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

## Pages and visualizer modules

`#data-structures` opens Data Structures Visualizer, with separate Trees and Graphs sections. `#algorithms` opens Algorithms, with a Sorting algorithms section. Section links such as `#data-structures/graphs` and `#algorithms/sorting` scroll directly to a tool. Previous `#structures` and `#sorting` links redirect to the corresponding sections.

`assets/app.mjs` handles routing and loads page modules on demand. `assets/pages/data-structures.mjs` and `assets/pages/algorithms.mjs` list their sections, while `assets/pages/sections.mjs` builds the common page layout. Visualizers keep their state when switching pages; playback pauses when leaving Algorithms.

Tree and graph modules live in `assets/data-structures/trees/` and `assets/data-structures/graphs/`. Each folder separates input logic (`model.mjs`), markup (`template.mjs`), rendering (`view.mjs`), and controls (`visualizer.mjs`). Shared input validation and DOM helpers live in `assets/shared/`. CSS is split by feature in `assets/styles/`, imported through `assets/styles.css`.

To add a data structure or algorithm section, create its visualizer module with a mount function accepting a container, then add an entry to the appropriate page's `sections` array. A mount function can return `{deactivate()}` to pause timers when leaving the page. Future sections can be added without changing the router or existing visualizers.

Sorting modules live in `assets/sorting/`. Bubble, Merge, and Quick Sort each have their own file in `assets/sorting/algorithms/`, including their display name, complexity explanation, and `sort(trace)` function. Add a module to `assets/sorting/registry.mjs` to make it appear in the selector. `trace.mjs` records comparisons, swaps, writes, and snapshots for shared playback. `assets/algorithms.mjs` retains the original exported functions for existing consumers and CI checks.

## NeetCode lessons

The site covers all nine Arrays & Hashing problems, all seven Stacks problems, and all five Two Pointers problems. The Problems panel and each category can be collapsed; hiding Problems gives the lesson the full width. Each problem has its own link, such as `#practice/largest-rectangle-in-histogram`, and its own JavaScript module in `assets/problems/`. Approach starts expanded; Steps, Python solution, Notes, and optional visualizations can be expanded independently.

`assets/problems.json` lists each problem's category, module, and original Python source path. Edit the explanation in the problem's module. Python source is fetched directly from its listed `neetcode/` file when the Python solution section opens; the build copies that exact file into `_site/`. Generate Parentheses reuses `neetcode/backtracking/generateParenthesis.py`.

For a problem-specific visualization, export `mountVisualization(root)` from that problem's module. Mount its controls and drawing inside `root`, and return a cleanup function to stop timers and remove external event listeners when navigating away. The shared lesson renderer in `assets/lessons.mjs` adds a collapsible Visualization section automatically. Largest Rectangle in Histogram, Container With Most Water, and Trapping Rain Water demonstrate this hook with custom heights and step, play/pause, and reset controls. The water lessons own their algorithm snapshots and share controls and SVG drawing through `assets/visualizations/height-playback.mjs`. Trapping Rain Water includes both source implementations with a solution-version selector.
