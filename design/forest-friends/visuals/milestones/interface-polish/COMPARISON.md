# Matching navigation, woodland map and shared settings

Build: app/cache 8.3.0, 8 November 2026, based on 720274c. Chromium with software rendering at 1024 × 900 and 390 × 844 CSS pixels. The unified painted Waldspiele catalogue remains intact. All 14 frozen visual reference files are preserved; this milestone records the owner's requested replacement of the earlier mixed toolbar and schematic map.

| State | Evidence | Result and intentional changes |
| --- | --- | --- |
| Toolbar in the den | [Tablet](den-1024.jpg), [phone](den-390.jpg) | Four matching painted objects: map, envelope, open book and wooden gear. Equal cream tiles centre the artwork. The book is balanced on its spine; the separate navigation speaker is gone. |
| Shared settings | [Tablet](settings-1024.jpg), [phone](settings-390.jpg) | Both the forest and Waldspiele enter the same gated screen. Forest sounds, music, effects, timer, letter case and local data controls live together. Settings shows one clock, pauses elapsed play time and has no automatic-speech toggle. |
| Picture map | [Tablet](map-1024.jpg), [phone](map-390.jpg) | A new painted woodland, with paths, recognizable homes and the brook/bridge, replaces the schematic background. Six matching portrait targets remain visible, separated and at least 48 × 48. A leaf-sealed letter marks the invited friend. |
| Pending delivery | [Tablet](courier-map-1024.jpg), [phone](courier-map-390.jpg) | The postal rabbit has a matching painted portrait and a separate destination when a letter is due. Selecting him routes to his actual reachable position. He is not a puzzle host. |
| Puzzle help | [Explanation control](puzzle-explanation-1024.jpg) | One explicit Spiel erklären action. Navigation, letters, examples, task changes and feedback do not speak automatically; no scored reading answer is read aloud. |
| Forest | [World toolbar](forest-1024.jpg) | The matching controls sit over the existing forest. Golden leaf objects, counter and collection effects are removed; the letter arrow and roaming mailman remain. |

The new runtime images are `interface-icons.webp`, `picture-map.webp` and `mailman-portrait.webp`. They were generated from the preserved `characters-v1.png` style reference and converted to WebP; the character sheet and previous artwork remain unchanged. Toolbar objects use a four-cell transparent sheet. Map friend portraits reuse the existing high-resolution picture-letter sheet, while the new rabbit portrait matches his postal role.

Forest audio is generated locally with Web Audio: stereo wind, changing leaf rustle, flowing water and varied bird phrases. It starts after a gesture, softens in the den, quietens during requested explanations and mutes while hidden. It makes no external audio requests. Old speech and collected-leaf fields remain readable, without restoring narration or collection functionality.

Validation covers all model/content/save suites; interface tests with actual destination travel and measured audio output, muting, background silence and offline restoration; timer modes and foreground-only timing; the complete painted library; the saved new/original puzzle letter loop and mailman map; and retained den/colouring/gallery behaviour. These are software-browser checks, not physical-device or child-observation results.
