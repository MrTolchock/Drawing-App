# Typography and input guide

Use two locally bundled families throughout the game. Their roles apply to the forest, Waldspiele, Malatelier, settings, dialogs and retained historical activities.

| Role | Family / weight | Size and use |
| --- | --- | --- |
| Interface text | Andika 400 | 16 px base, line height 1.5; instructions, prose and help |
| Controls and card names | Andika 700 | Usually 17–20 px; action labels, game names and settings groups |
| Supporting text | Andika 400 | 14–15 px; dates, short explanations and version label |
| Menu / section headings | Baloo 2 700 | Page titles 22–32 px, sections 21–28 px; line height at least 1.25 |
| Learning content | Andika 400 / 700 | Prompts, reading words, syllables, numerals, answer tiles and tracing labels; existing larger task-specific sizes remain |
| Learning page titles | Andika 700 | 21–28 px; includes the picture name above the colouring canvas |
| Brand wordmark | Baloo 2 800 | The Farbtupf wordmark is the sole heavier display exception |

Puzzle headings, completion messages and explanations retain Andika. A dialog title that is a word to read uses `.modal-title.read`; ordinary dialog titles use Baloo 2. Emoji brushes use the platform's symbol font, and handwriting models use their authored stroke paths. Neither is an additional interface family. Do not use serif headings or outlines/shadows to style ordinary text.

## Implementation

`css/base.css` owns `--type-body`, `--type-heading` and `--type-learning`, with the historical `--font` and `--read` aliases. `css/typography.css`, loaded last, applies the shared roles and responsive size tokens. `--wb-display` and `--wb-read` are compatibility aliases for older Waldbuch components. Components use these tokens rather than declaring their own font stacks. Use only the supplied Andika 400/700 weights; avoid unsupported intermediate weights. Fonts are preloaded and included in the offline cache.

New screens should use the shared topbar and role classes. Learning screens inherit the learning family for their whole task. Keep words legible, avoid artificial letter spacing, and preserve syllable bows and existing letter-case preferences. Enlarged learning letters/numbers are intentional; controls do not imitate them.

## Input behaviour

Every semantic button uses the same app-wide touch delegate in `js/ui/play.js`. A primary finger release activates its original button only if it stayed within 14 px and ends over that button. Scrolling, cancellation, a disabled/replaced button or a second finger cancels activation. Only the matching browser compatibility click is consumed; a fresh gesture is immediately available. Mouse and keyboard activation stay native. Drawing/tracing and authored drag/drop retain their own pointer handlers; handled gestures set `fkPlayHandled`. Backdrop dismissal consumes its own gesture through `FK.ui.eatClick(event)`.

Allow native controls and links to handle slight finger movement; the page-level touch guard must not cancel their clicks. Pictures and SVG decorations inside buttons belong to that button's hit area. Do not add per-screen click cooldowns or a second touch-release handler to ordinary buttons.

The parent gate asks adults to enter the multiplication result using a numeric keyboard. Wrong or empty answers stay in the dialog, announce an error and can be corrected immediately. Closing and reopening works without a hidden delay. Enter and the **Öffnen** button submit the same form.

## Review

Run `node tests/input-typography-browser.cjs` against the local server. It checks native emulated touch with small movements, rapid repeats, scroll/cancel behaviour, modal dismissal, parent-gate retry, mouse/keyboard and computed font roles. `tests/gameplay-interactions-browser.cjs` additionally delays a native click with a busy rendering frame and verifies one route command per tap. Review 390 × 844 and 1024 × 900 screenshots against the preserved visual references. Chromium emulation does not replace physical iPhone/iPad Safari checks.
