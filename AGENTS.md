# Project goals

Build a simple personal study website for data structures, algorithms, and Python solution explanations. Deploy the static website to GitHub Pages.

## Style and preferences

- Use plain, direct wording and a simple layout.
- No product branding, invented site names, marketing copy, slogans, decorative hero illustrations, or roadmap banners.
- Use descriptive names such as Trees and graphs, Sorting, and NeetCode 150.
- The user has already validated existing NeetCode solutions on NeetCode. Do not add or run tests for those solutions, rewrite them to satisfy local tests, or duplicate them in a lessons/ directory.

## Scope

- Home page describing the site and linking to its available sections.
- One or multiple trees built from compact level-order arrays (null marks missing children). Accept a single array or nested arrays such as [[1,2,3],[4,null,5]], display every tree, and allow manual insertion into a selected tree. Limit each tree to 16 actual nodes, excluding null placeholders.
- Directed and undirected graphs built from integer edge lists or binary adjacency matrices, plus manual nodes and edges. Limit each graph to 16 distinct nodes, including isolated nodes; enforce the same limit for input and manual additions.
- Step-by-step Bubble, Merge, and Quick Sort with playback, reset, and complexity explanations.
- All nine NeetCode 150 Arrays & Hashing problems with original explanations, examples, Python solutions, and complexity analysis.
- Future work: heaps and Dijkstra versus Bellman–Ford, followed by the remaining NeetCode 150 categories. Do not imply these are implemented yet.

## Implementation

Use dependency-free HTML, CSS, and JavaScript with relative asset paths compatible with a GitHub Pages repository subpath. Preserve existing practice solutions in algoexpert/ and neetcode/. Load website code directly from neetcode/ files using the source paths in assets/problems.json. The build copies those exact files into the same relative paths in _site/. Keep explanations consistent with the actual implementations, including multiple solution versions. Missing problems may be added directly to neetcode/array-hashing/.

Use uv to install Python 3.14 and create .venv, without pyproject.toml, Makefile, or pre-commit. Python 3.14 provides public heapq max-heap functions, including heapify_max. Build with `uv run --no-project python scripts/build.py`. CI can check JavaScript visualizer logic and syntax; do not test the NeetCode Python solutions. Respect the user's request not to run additional testing for this task.

CI validates pushes and pull requests. Only the default branch deploys to GitHub Pages after validation. Publish only the staged _site directory; never the virtual environment or repository metadata.
