"""Verify frozen visual reference files without changing them."""
import hashlib
import json
from pathlib import Path

root = Path(__file__).resolve().parent
manifest = json.loads((root / "baseline-manifest.json").read_text())
failures = []
for entry in manifest["files"]:
    path = root / entry["path"]
    if not path.is_file():
        failures.append(f"Missing: {entry['path']}")
    elif hashlib.sha256(path.read_bytes()).hexdigest() != entry["sha256"]:
        failures.append(f"Changed: {entry['path']}")
if failures:
    raise SystemExit("\n".join(failures))
print(f"Visual baseline intact: {len(manifest['files'])} reference files.")
