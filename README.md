# Data structures and algorithms

A personal study site with data structure visualizations, sorting algorithms, and NeetCode Python explanations. Hosted on GitHub Pages.

## Available now

- Main page with links to trees, graphs, sorting, and NeetCode solutions.
- Binary trees from one compact level-order array or multiple arrays, such as `[[1,2,3],[4,null,5]]`. Each tree is displayed separately; select one to add nodes by parent and side. `[1,null,2,3]` places 3 under 2. Limit: 16 actual nodes per tree, excluding null placeholders. This is not heap-indexed storage or automatic BST insertion.
- Directed/undirected graphs from integer edge lists or binary adjacency matrices, with manual nodes, edges, and self-loops. Matrices label vertices from 0; undirected matrices must be symmetric. Limit: 16 distinct nodes, including isolated nodes, for both input and manual additions.
- Bubble, Merge, and Quick Sort with Play/Pause, Step, Reset, speed, and operation counts. Negative values are supported; bar heights are normalized and labels show actual values.
- All nine NeetCode 150 Arrays & Hashing lessons, including reasoning, examples, Python, complexity, and pitfalls. These are original explanations; the site is not affiliated with NeetCode.

Planned: heaps, Dijkstra versus Bellman–Ford, and the remaining NeetCode categories.

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
uv run --no-project python -m http.server 8000 --directory _site
```

Open [localhost:8000](http://localhost:8000). Serve over HTTP, rather than opening index.html as a file, because lessons use fetch. The frontend uses vanilla HTML/CSS/JavaScript; no npm install or compilation is needed. The site uses system fonts and has no external frontend dependencies.

## Validation

```sh
node --test tests/*.test.mjs
node --check assets/app.mjs
uv run --no-project python scripts/build.py
```

CI uses Node 24 for visualizer logic tests and JavaScript syntax checks. NeetCode solutions are not tested locally: existing solutions have already passed NeetCode. The website fetches the exact Python source from `neetcode/array-hashing/`, using the paths and explanations in `assets/problems.json`. There is no separate `lessons/` directory. The build copies these source files without changing them.

## GitHub Pages

In **Settings → Pages → Build and deployment**, select **GitHub Actions**. Push these changes to the default branch (`master` here). The workflow validates every push and pull request, stages only public assets in `_site/`, and deploys successful default-branch builds. Manual runs on the default branch can also deploy. Repository settings must allow Pages and Actions.

Expected URL after deployment: [slavaheroes.github.io/datastructures-algorithms/](https://slavaheroes.github.io/datastructures-algorithms/).

Relative asset URLs and hash routes support repository subpaths and refreshes without server rewrites. Deployment follows the official [GitHub Pages Actions workflow](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).
