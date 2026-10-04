"""Serve the staged site locally without retaining outdated browser assets."""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import argparse
import socket

SITE = Path(__file__).resolve().parents[1] / '_site'


class PreviewHandler(SimpleHTTPRequestHandler):
    extensions_map = {
        **SimpleHTTPRequestHandler.extensions_map,
        '.mjs': 'text/javascript',
        '.js': 'text/javascript',
        '.css': 'text/css',
    }

    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()

    def send_head(self):
        # A tab may still send validators from an earlier preview server.
        if 'If-Modified-Since' in self.headers:
            del self.headers['If-Modified-Since']
        return super().send_head()


class PreviewServer(ThreadingHTTPServer):
    def server_bind(self):
        # Windows otherwise permits several HTTP servers to share one address.
        if hasattr(socket, 'SO_EXCLUSIVEADDRUSE'):
            self.allow_reuse_address = False
            self.socket.setsockopt(socket.SOL_SOCKET, socket.SO_EXCLUSIVEADDRUSE, 1)
        super().server_bind()


def serve():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--port', type=int, default=8000)
    args = parser.parse_args()
    if not (SITE / 'index.html').is_file():
        parser.error('Build first: uv run --no-project python scripts/build.py')
    handler = partial(PreviewHandler, directory=str(SITE))
    with PreviewServer(('127.0.0.1', args.port), handler) as server:
        print(f'Local preview: http://localhost:{args.port} (browser caching disabled)', flush=True)
        try:
            server.serve_forever()
        except KeyboardInterrupt:
            pass


if __name__ == '__main__':
    serve()
