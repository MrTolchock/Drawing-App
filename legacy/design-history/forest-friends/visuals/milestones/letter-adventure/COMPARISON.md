# Picture letters and the rabbit mailman

Build: app/cache 8.0.0, 8 November 2026, integrated on parent commit abd337f (including the newer plush characters, golden forest and curled sleeping animation). Chromium with software rendering; 1024 × 900 and 390 × 844 CSS pixels. The current letter-adventure blueprint supersedes the historical shopping loop. Frozen reference artwork and the 14-file baseline integrity manifest remain unchanged.

| State | Evidence | Intended change |
| --- | --- | --- |
| Initial den | [Tablet](den-1024.jpg), [phone](den-390.jpg) | Closed wooden door and mail lid; an envelope remains on the inside floor until clicked. Its [normal-motion arrival](den-delivered-normal-motion.jpg) uses scene-relative slot coordinates, with an immediate accessible final state under reduced motion. |
| First letter | [Tablet](letter-1024.jpg), [phone](letter-390.jpg) | Large friend portrait and drawn unreadable handwriting. The letter is a navigation picture, not a decoding task. |
| Route to the friend | [Forest](arrow-to-squirrel-1024.jpg) | A gold in-world arrow and destination ring point along a walkable route; the player still chooses where to click. |
| Next delivery | [Tablet](mailman-1024.jpg), [phone](mailman-390.jpg) | Hase waits very near the fox after completion, wearing a postal cap and satchel. The arrow switches to him. The stall, shop destination and wallet are absent. |
| Next invitation | [Letter](next-letter-1024.jpg) | Clicking the nearby mailman opens a letter for a different friend and changes the route target. |

Validation includes the model/content/save suites, full letter-loop browser journey through a five-task new round and an original Reimzirkus round, standalone tracing and number-path completions, repeated-completion protection, letter/world reload continuity, offline relaunch, normal-motion delivery alignment, library/atelier persistence, and free bed sleep/Skip. Detailed test commands are in `docs/DEVELOPMENT.md`.

The preserved painted den, forest models, original puzzle artwork and new postal props form the implementation. The door is a scene-aligned SVG layer over the den painting; the postal rabbit and guidance arrow are 3D. These screenshots establish software-browser behaviour and layout, not physical iPad performance or child usability results.
