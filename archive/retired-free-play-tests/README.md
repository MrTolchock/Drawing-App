# Browser checks for the earlier free-play interface

These scripts describe the pre-letter-limit UI, including a child Waldspiele gallery, unlimited letters, and optional timers. They are preserved as historical evidence and require the corresponding earlier Git snapshot to run.

Current entry points keep their old script names as aliases where useful. Acceptance now lives in:

- `tests/letter-sessions-browser.cjs`: actual parent controls, invitation-only child puzzles, five-task completions, courier, home route, sleeping game over, offline quota and parent-only restart.
- `tests/puzzle-review-browser.cjs`: the adult-only catalogue, every iteration in the actual renderer, approval/flagging, isolated previews, export/import, layout, audio/mute and offline records.

Model/content invariants for all puzzles remain in the active Node test suite. Historical screen and input checks outside this folder remain available for explicit compatibility investigation.
