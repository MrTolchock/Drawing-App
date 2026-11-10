# Puzzle consistency — 10 November 2026

Working tree for app 8.10.0, based on `153458a`. This implements the user's puzzle-by-puzzle review; the frozen v2 reference and its fourteen integrity hashes remain unchanged.

The current [puzzle specification](../../../../../docs/PUZZLES.md) describes all 28 games and learning boundaries. Intentional departures from the frozen specimens: one smaller, consistently positioned host portrait; Andika throughout puzzles; no demonstration/help controls or duplicate success row; revised three-shape matrices and two-piece construction; manual explanation only; five tasks in every round; leaf/flower celebration. Historical economy and shop specimens remain archived references.

| State | 1024 × 900 | 390 × 844 | Assessment |
| --- | --- | --- | --- |
| Seven nuts | [Tablet](nuts-7-1024.jpg) | [Phone](nuts-7-390.jpg) | Compare frozen count fixture: whole board and answers visible, optional count marks, uniform font. |
| Twenty nuts | [Tablet](nuts-20-1024.jpg) | [Phone](nuts-20-390.jpg) | Stress case: five-wide rows and all answer tiles fit without horizontal overflow or needing vertical scrolling. |
| Maus word fixture | [Tablet](word-1024.jpg) | [Phone](word-390.jpg) | Compare frozen reading fixture: equal-sized crayon pictures, word not automatically narrated. |
| Rhyme with table picture | [Tablet](rhyme-1024.jpg) | [Phone](rhyme-390.jpg) | Missing vocabulary has matching crayon art; written rhyme choices stay visible. |
| Workshop | [Tablet](shapes-1024.jpg) | [Phone](shapes-390.jpg) | Completed model, active gap and orientation choices remain visible. |
| Syllable assembly | [Tablet](read-puzzle-1024.jpg) | [Phone](read-puzzle-390.jpg) | Picture, receiving syllable arcs, chips and one distractor. At least two syllables per task. |
| Colour reading | [Tablet](read-colours-1024.jpg) | [Phone](read-colours-390.jpg) | Matched crayon flowers; short reading sentence and uniform picture sizes. |
| Digit tracing | [Tablet](trace-numbers-1024.jpg) | [Phone](trace-numbers-390.jpg) | Same font/context/progress; single writing surface with visible start and direction. The legacy overflow/end panel is removed. |

Captured in an isolated Chromium profile with reduced motion and deterministic task fixtures, never by clearing player saves. `tests/puzzle-rounds-browser.cjs` checks all 28 menu routes at both viewports; its gameplay runs cover all five tasks for each game, retry, partial work, celebration and offline continuation. Tracing uses pointer events along the real stroke models; set `FARBTUPF_NATIVE_TOUCH=1` for the slower CDP touch stream. `tests/puzzle-navigation-browser.cjs` separately checks the real forest/courier return, leaving celebration immediately, reload and offline handover. The model suite passes all 17 files; later content/art checks also pass. These are browser emulation checks, not physical iPad/Safari or child testing.
