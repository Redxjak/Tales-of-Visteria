# Tales of Visteria Local Python App

This is a local-only Python launcher for reviewing the current browser build in PyCharm.

It uses only the Python standard library and serves the existing `docs/` app from localhost.

## Run

From the project root:

```powershell
python python_app\tov_local.py
```

Then open:

```text
http://127.0.0.1:8123/review/
```

Useful options:

```powershell
python python_app\tov_local.py --language es
python python_app\tov_local.py --port 9000
python python_app\tov_local.py --no-browser
```

In PyCharm, open `python_app/tov_local.py`, create a run configuration, and set any options in the Parameters field.

## Review Dashboard

The launcher opens `/review/` by default. From there you can:

- Play the English or Spanish game route.
- See the current app version from `docs/assets/app.js`.
- See quick local paths for the main game script, text data, Twine export, and project notes.
