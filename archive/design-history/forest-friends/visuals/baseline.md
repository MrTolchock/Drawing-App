# Visual baseline and development comparison

**Recorded:** 7 November 2026.
**Baseline tag:** `codex/forest-friends-visual-v2`.
**Purpose:** Preserve the visual pass and measure the real game against it during development.

## What the user has endorsed

The user described the characters as great and the den as beautiful. Preserve the character silhouettes, Fuchs's green neckerchief, Waldkauz's warm expression, the den's composition and the warm woodland art direction. The user also required a more intuitive interface because children usually cannot read.

Version 2 addresses that navigation feedback. It is the current comparison target, with child usability and curriculum review still pending; it is not a claim that every control is understood or that the game is developed. Record future user feedback as a new revision.

## Preserved records

| Record | Stable reference | Use |
| --- | --- | --- |
| Version 1 | [review-v1.html](review-v1.html), original commit `6c45667` | Original visual pass; historical interface, superseded by version 2 |
| Version 2 | [review-v2.html](review-v2.html) | Frozen picture-led interface and sample interactions |
| Current review | [review.html](review.html) | Working entry point; may evolve in a later revision |
| Character sheet | [characters-v1.png](characters-v1.png) | Original Fuchs/Waldkauz reference, unchanged from version 1 |
| Den | [den-v1.png](den-v1.png) | Original home scene, unchanged from version 1 |
| Forest | [forest-v1.png](forest-v1.png) | Original central clearing, unchanged from version 1 |
| Reference screenshots | [baselines/v2](baselines/v2) | Fixed visual comparisons of the reviewed states |
| Integrity manifest | [baseline-manifest.json](baseline-manifest.json) | SHA-256 hashes of frozen HTML, art, prompts and screenshots |

Frozen HTML files share the versioned PNGs and repository fonts. Keep that directory structure when opening them. The version-1 snapshot matches the original committed file byte for byte. The tagged repository contains the fonts and every dependency needed for offline screen review.

Never overwrite a versioned snapshot, its referenced art, or its screenshot evidence to make a later implementation appear to match. When the design changes, add `review-v3.html` and a new screenshot directory, record the reason and update the comparison target. Keep previous references and the tag intact. Check integrity with `python3 design/forest-friends/visuals/check-baseline.py` from the repository root.

## Matching development views

Main reference viewport: **1024 × 900 CSS pixels**, browser scale 100%. Screenshots include the reviewer header around the game frame. For the real game, compare the game frame itself, with equivalent camera composition and content, rather than trying to reproduce the reviewer shell. The compact check uses **390 × 844**. These references are not physical-device performance tests.

| State | Reference image | Setup in the real game |
| --- | --- | --- |
| Home | [Home](baselines/v2/v2-home-1024.jpg) | Starter den, no purchased cushion, three nuts; doorway, table and bed available |
| Forest | [Forest route](baselines/v2/v2-forest-route-1024.jpg) | Central clearing with route to Maus; same principal landmarks |
| Picture map | [Map](baselines/v2/v2-map-1024.jpg) | Open map from forest; destinations shown by recognisable pictures |
| Counting | [Counting](baselines/v2/v2-count-1024.jpg) | Seven nuts, no selection, choices 6/7/8; check initially inactive |
| Demonstration | [Example](baselines/v2/v2-demo-1024.jpg) | Separate three-nut example with replayable speech; no answer to the scored task |
| Reading | [Reading](baselines/v2/v2-read-1024.jpg) | «Maus» with house/mouse/hat choices; target not pronounced automatically |
| Shop | [Shop](baselines/v2/v2-shop-1024.jpg) | Three nuts, unowned cushion selected, price of two visible nut tokens |
| Compact counting | [390-pixel layout](baselines/v2/v2-count-narrow390.jpg) | Same untouched counting state; controls at least 48 × 48, no horizontal overflow |

## Acceptance rubric

| Area | What development must preserve | How to check |
| --- | --- | --- |
| Characters | Warm rounded woodland appearance; Fuchs's colours, tail and neckerchief; Waldkauz's facial discs and readable wings | Compare front/side/back model renders and in-world scale with the original sheet. The generated sheet is visual guidance, not exact mesh geometry. |
| Den | Cosy root walls, clear doorway, bed, drawing table, open furnishing space and soft daylight | Compare a matched still from the 3D camera to the den reference; keep functional furnishings as separate objects. |
| Forest | Central home tree, nearby smaller shop tree, clear sandy paths, visible brook/crossing and layered woodland depth | Compare matched camera composition; verify landmarks remain legible while moving. |
| Intuitive navigation | Tap actual places and objects; friends shown as portraits; no required written menu or explanatory paragraph | Walk through door → friend → task → shop → home with spoken/visual guidance. Merely replacing words with unexplained symbols does not pass. |
| Puzzle instructions | Replayable speech and a visual worked example on different content | Watch a first-use demonstration, retry it, and return to the untouched scored task. |
| Literacy boundary | Reading appears where it is the learning objective, not as a navigation requirement | Mute written UI labels in the walkthrough; keep the scored reading word and relevant numerals visible. Do not auto-speak the scored reading answer. |
| Feedback | Visible selection, non-punitive retry cue, spoken encouragement, recognisable completion and next action | Submit one wrong and one correct answer; verify unlimited correction without resource loss. |
| Shop | Item pictures, pictured prices, wallet comparison, explicit confirmation, clear ownership versus consumables | Preview/cancel, buy once, try duplicate ownership and insufficient resources, place cushion and consume an apple. |
| Access | Touch targets at least 48 × 48 CSS pixels, keyboard operation, meaningful accessibility names, non-colour cues and reduced motion | Inspect sizes and tab order; test with a child and accessibility support. Exact screen-reader reading-task adaptation remains an open design item. |
| Continuity | Real saved furniture, wallet and interrupted tasks survive refresh | Compare the same state before/after refresh. The disposable review intentionally resets and does not meet this production requirement itself. |

Keep a short comparison record for each implemented milestone: build/commit, tested viewport/device, matched reference image, new screenshot path, pass/needs-work per applicable rubric item, and any intentional deviation. Add side-by-side images or a diff where useful. Do not mark a milestone visually complete from a code review alone.

## Known limits of this baseline

This is an art and interaction target. The scenes are flat generated illustrations, not a 3D engine; portraits in small controls are schematic UI drawings. Continuous movement, final camera tuning, rigged models, production narration, five-task rounds, full content pools and durable saving remain implementation work. The frame's scene crop on a narrow viewport is not the final mobile 3D camera specification.

The original artwork has been preserved without regeneration or editing. Version 2 changed the interface layer. Teacher and child review may refine it further; use a new version to record those changes.
