# Shared input and typography — 11 November 2026

App 9.0.1, based on GitHub main `4472f35`, including the expanded world and ten puzzle friends. The frozen den, character sheet and fourteen baseline files remain unchanged. See the [typography and input guide](../../../../../docs/TYPOGRAPHY.md).

| State | 1024 × 900 | 390 × 844 | Review |
| --- | --- | --- | --- |
| Settings | [Tablet](settings-1024.jpg) | [Phone](settings-390.jpg) | Baloo 2 page heading, Andika controls/prose; scrollable content and no horizontal overflow. |
| Colour reading | [Tablet](reading-1024.jpg) | [Phone](reading-390.jpg) | Andika throughout the task, including its title; large reading sentence and equal crayon flower choices. |
| Parent retry | — | [Phone](gate-retry-390.jpg) | The multiplication remains visible with editable input and a readable error; the submit button remains available. |
| Waldspiele | — | [Phone](games-390.jpg) | Baloo 2 menu title, Andika game names and host labels. Existing painted portraits and cards are retained. |

Compared with the frozen reading/counting specimens, the cream paper, woodland colours, pictured choices and clear reading text remain. Intentional differences follow the user's later puzzle review: five tasks, direct continuation, manual explanation, no demo/help controls and no duplicate success row. This revision adds consistent menu/learning type roles, removes remaining serif and unsupported-weight exceptions, and removes outlined page-title text. It changes no character or scene artwork.

Captured in an isolated Chromium profile with reduced motion. `tests/input-typography-browser.cjs` uses native emulated finger gestures with small movements, fast repeat taps, scrolling/cancellation, backdrop dismissal, mouse/keyboard and computed font checks. It checks empty/wrong/correct parent-gate submissions and immediate reopening, native settings controls, world/book/puzzle/painting navigation at both sizes. The puzzle suite opens all 33 routes at both sizes and exercises five tasks per game, retry, celebration, saved work and offline reload. Separate model and world-return regressions cover content, persistence and courier handover. The legacy interaction check simulates a busy frame lasting over one second and verifies that its delayed native click cannot add a second route command. These checks do not establish physical iPhone/iPad Safari behaviour or child usability.
