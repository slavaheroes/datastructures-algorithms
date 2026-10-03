"""Stage only public files for GitHub Pages."""
from pathlib import Path
import json
import shutil

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / '_site'


def build():
    # Fixed child path; refuse symlinks or junctions before recursive deletion.
    if OUTPUT.is_symlink() or (OUTPUT.exists() and OUTPUT.resolve() != ROOT / '_site'):
        raise RuntimeError('Refusing to replace a redirected output directory')
    if OUTPUT.exists():
        shutil.rmtree(OUTPUT)
    OUTPUT.mkdir()
    shutil.copy2(ROOT / 'index.html', OUTPUT / 'index.html')
    for folder in ('assets',):
        shutil.copytree(ROOT / folder, OUTPUT / folder, ignore=shutil.ignore_patterns('__pycache__', '*.pyc'))
    (OUTPUT / '.nojekyll').touch()
    problems = json.loads((OUTPUT / 'assets/problems.json').read_text(encoding='utf-8'))
    for problem in problems:
        source = ROOT / problem['source']
        destination = OUTPUT / problem['source']
        destination.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(source, destination)
    print(f'Staged site and {len(problems)} solutions in {OUTPUT}')


if __name__ == '__main__':
    build()
