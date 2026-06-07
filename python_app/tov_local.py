"""Local Python launcher for Tales of Visteria.

Run this file from PyCharm or a terminal to review the current docs build at a
localhost URL. It intentionally uses only the Python standard library.
"""

from __future__ import annotations

import argparse
import contextlib
import html
import functools
import http.server
import os
from pathlib import Path
import socket
import socketserver
import sys
import webbrowser


PROJECT_ROOT = Path(__file__).resolve().parents[1]
DOCS_ROOT = PROJECT_ROOT / "docs"
DEFAULT_HOST = "127.0.0.1"
DEFAULT_PORT = 8123
TWINE_STORY_PATH = Path.home() / "Documents" / "Twine" / "Stories" / "Tales of Visteria.html"


class TalesRequestHandler(http.server.SimpleHTTPRequestHandler):
    """Serve docs/ with no-cache headers and a friendly root redirect."""

    def end_headers(self) -> None:
        self.send_header("Cache-Control", "no-store, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    def do_GET(self) -> None:
        if self.path in ("", "/"):
            self.send_response(302)
            self.send_header("Location", "/review/")
            self.end_headers()
            return
        if self.path == "/review/":
            self.write_review_page()
            return
        super().do_GET()

    def log_message(self, format: str, *args: object) -> None:
        sys.stdout.write("[local] " + (format % args) + "\n")

    def write_review_page(self) -> None:
        app_version = read_app_version()
        rows = [
            ("Game script", PROJECT_ROOT / "docs" / "assets" / "app.js"),
            ("English text", PROJECT_ROOT / "docs" / "assets" / "data" / "en.json"),
            ("Spanish text", PROJECT_ROOT / "docs" / "assets" / "data" / "es.json"),
            ("Twine export", TWINE_STORY_PATH),
            ("Local project notes", PROJECT_ROOT / "LOCAL_TOV_PROJECT_NOTES.md"),
            ("Python launcher", Path(__file__).resolve()),
        ]
        file_rows = "\n".join(
            "<tr><th>{}</th><td><code>{}</code></td><td>{}</td></tr>".format(
                html.escape(label),
                html.escape(str(path)),
                "Found" if path.exists() else "Missing",
            )
            for label, path in rows
        )
        body = f"""<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Tales of Visteria Local Review</title>
    <style>
      :root {{
        color-scheme: dark;
        --bg: #171310;
        --panel: #211a16;
        --text: #f2dfc5;
        --muted: #c9a983;
        --accent: #923a3a;
        --line: #49312b;
      }}
      body {{
        margin: 0;
        font-family: Georgia, "Times New Roman", serif;
        background: var(--bg);
        color: var(--text);
      }}
      main {{
        max-width: 960px;
        margin: 0 auto;
        padding: 40px 20px;
      }}
      h1, h2 {{
        margin: 0 0 12px;
      }}
      p {{
        color: var(--muted);
        line-height: 1.5;
      }}
      .actions {{
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        margin: 24px 0;
      }}
      a.button {{
        background: var(--accent);
        color: white;
        padding: 12px 16px;
        border-radius: 6px;
        text-decoration: none;
        font-weight: bold;
      }}
      section {{
        border-top: 1px solid var(--line);
        margin-top: 28px;
        padding-top: 24px;
      }}
      table {{
        width: 100%;
        border-collapse: collapse;
        background: var(--panel);
      }}
      th, td {{
        border-bottom: 1px solid var(--line);
        padding: 10px;
        text-align: left;
        vertical-align: top;
      }}
      code {{
        color: #ffd9a8;
        word-break: break-all;
      }}
      .version {{
        color: white;
        background: #34231f;
        border: 1px solid var(--line);
        border-radius: 999px;
        display: inline-block;
        padding: 5px 10px;
      }}
    </style>
  </head>
  <body>
    <main>
      <h1>Tales of Visteria Local Review</h1>
      <p class="version">Current local app version: {html.escape(app_version)}</p>
      <p>Use this page as the PyCharm-friendly launch point for reviewing and playing the local build.</p>
      <div class="actions">
        <a class="button" href="/en/">Play English</a>
        <a class="button" href="/es/">Play Spanish</a>
        <a class="button" href="/beta/en/">Private Beta English</a>
        <a class="button" href="/beta/es/">Private Beta Spanish</a>
        <a class="button" href="/assets/app.js">View app.js</a>
        <a class="button" href="/assets/data/en.json">View English JSON</a>
      </div>
      <section>
        <h2>Review Files</h2>
        <table>
          <tbody>
            {file_rows}
          </tbody>
        </table>
      </section>
      <section>
        <h2>Notes</h2>
        <p>The browser game still uses local browser storage for guest saves. This server disables caching so local changes are easier to review.</p>
      </section>
    </main>
  </body>
</html>"""
        encoded = body.encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(encoded)))
        self.end_headers()
        self.wfile.write(encoded)


class ReusableThreadingHTTPServer(socketserver.ThreadingMixIn, http.server.HTTPServer):
    daemon_threads = True
    allow_reuse_address = True


def port_is_available(host: str, port: int) -> bool:
    with contextlib.closing(socket.socket(socket.AF_INET, socket.SOCK_STREAM)) as sock:
        sock.settimeout(0.25)
        return sock.connect_ex((host, port)) != 0


def choose_port(host: str, requested_port: int) -> int:
    if port_is_available(host, requested_port):
        return requested_port
    for port in range(requested_port + 1, requested_port + 50):
        if port_is_available(host, port):
            return port
    raise OSError(f"No open port found from {requested_port} to {requested_port + 49}.")


def read_app_version() -> str:
    app_path = DOCS_ROOT / "assets" / "app.js"
    try:
        text = app_path.read_text(encoding="utf-8")
    except OSError:
        return "unknown"
    marker = 'const VERSION = "'
    start = text.find(marker)
    if start < 0:
        return "unknown"
    start += len(marker)
    end = text.find('"', start)
    if end < 0:
        return "unknown"
    return text[start:end]


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Serve Tales of Visteria locally.")
    parser.add_argument("--host", default=DEFAULT_HOST, help="Host interface to bind.")
    parser.add_argument("--port", type=int, default=DEFAULT_PORT, help="Preferred port.")
    parser.add_argument(
        "--language",
        choices=("en", "es"),
        default="en",
        help="Language route for the direct play URL.",
    )
    parser.add_argument(
        "--no-browser",
        action="store_true",
        help="Start the server without opening the browser.",
    )
    parser.add_argument(
        "--strict-port",
        action="store_true",
        help="Fail if the requested port is unavailable instead of choosing the next open port.",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    if not DOCS_ROOT.exists():
        print(f"Could not find docs folder: {DOCS_ROOT}", file=sys.stderr)
        return 1

    port = args.port if args.strict_port else choose_port(args.host, args.port)
    handler = functools.partial(TalesRequestHandler, directory=str(DOCS_ROOT))

    try:
        server = ReusableThreadingHTTPServer((args.host, port), handler)
    except OSError as exc:
        print(f"Could not start local server on {args.host}:{port}: {exc}", file=sys.stderr)
        return 1

    url = f"http://{args.host}:{port}/{args.language}/"
    review_url = f"http://{args.host}:{port}/review/"
    print("Tales of Visteria local Python app")
    print(f"Serving: {DOCS_ROOT}")
    print(f"Review:  {review_url}")
    print(f"Play:    {url}")
    print("Press Ctrl+C to stop.")

    if not args.no_browser:
        webbrowser.open(review_url)

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping local server.")
    finally:
        server.server_close()
    return 0


if __name__ == "__main__":
    os.chdir(PROJECT_ROOT)
    raise SystemExit(main())
