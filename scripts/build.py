"""Stage only public files for GitHub Pages."""
from pathlib import Path
from hashlib import sha256
import json
import re
import shutil
from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / '_site'


def content_version(problems):
    paths = {ROOT / 'index.html', Path(__file__).resolve()}
    paths.update(path for path in (ROOT / 'assets').rglob('*') if path.is_file())
    paths.update(ROOT / problem['source'] for problem in problems)
    digest = sha256()
    for path in sorted(paths):
        digest.update(path.relative_to(ROOT).as_posix().encode('utf-8') + b'\0')
        digest.update(path.read_bytes() + b'\0')
    return digest.hexdigest()[:16]


def version_asset_references(version):
    # A query on an entry script does not propagate to its imported modules.
    # Rewrite every local dependency in the staged copy, leaving sources intact.
    javascript = re.compile(r'''\b(?:from\s+|import\s*\(?\s*)(?P<quote>['"])(?P<url>\.[^'"]+)(?P=quote)''')
    css = re.compile(r'''url\(\s*(?P<quote>['"]?)(?P<url>[^'"\s)]+)(?P=quote)\s*\)''')
    html = re.compile(r'''\b(?:src|href)=(?P<quote>['"])(?P<url>assets/[^'"]+)(?P=quote)''')

    def rewrite(path, pattern):
        def replace(match):
            value = match.group('url')
            parts = urlsplit(value)
            if parts.scheme or parts.netloc or not parts.path:
                return match.group(0)
            target = (path.parent / parts.path).resolve()
            if not target.is_relative_to(OUTPUT) or not target.is_file():
                return match.group(0)
            query = [(key, value) for key, value in parse_qsl(parts.query, keep_blank_values=True) if key != 'v']
            query.append(('v', version))
            updated = urlunsplit(('', '', parts.path, urlencode(query), parts.fragment))
            start = match.start('url') - match.start()
            end = match.end('url') - match.start()
            return match.group(0)[:start] + updated + match.group(0)[end:]

        path.write_text(pattern.sub(replace, path.read_text(encoding='utf-8')), encoding='utf-8')

    rewrite(OUTPUT / 'index.html', html)
    for path in (OUTPUT / 'assets').rglob('*'):
        if path.suffix in ('.js', '.mjs'):
            rewrite(path, javascript)
        elif path.suffix == '.css':
            rewrite(path, css)


def build():
    problems = json.loads((ROOT / 'assets/problems.json').read_text(encoding='utf-8'))
    version = content_version(problems)
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
    for problem in problems:
        source = ROOT / problem['source']
        destination = OUTPUT / problem['source']
        destination.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(source, destination)
    version_asset_references(version)
    print(f'Staged site and {len(problems)} solutions in {OUTPUT} (assets {version})')


if __name__ == '__main__':
    build()
