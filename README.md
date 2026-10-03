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
uv run --no-project python -m http.server 8000 --directory _site
```

Open [localhost:8000](http://localhost:8000). Serve over HTTP, rather than opening index.html as a file, because lessons use fetch. The frontend uses vanilla HTML/CSS/JavaScript; no npm install or compilation is needed. The site uses system fonts and has no external frontend dependencies.
