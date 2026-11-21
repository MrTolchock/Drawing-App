# Quiet feedback and equal puzzle tiles — 21 November 2026

Captured from the real shared renderer in Chromium, using disposable storage and intercepted review APIs.

| Capture | Viewport | Purpose |
| --- | --- | --- |
| [Gallery, tablet](gallery-tablet.png) | 1024 × 700 | Uniform puzzle tiles, including longer titles. |
| [Review, tablet](review-tablet.png) | 1024 × 700 | The same tile dimensions with status and task totals. |
| [Gallery, phone](gallery-phone.png) | 390 × 844 | A single column of equal-sized tiles. |
| [Review, phone](review-phone.png) | 390 × 844 | Review titles and metadata fit the shared dimensions. |
| [Solved distribution](correct-group-tablet.png) | 1080 × 810 | Success highlight and text without a check icon. |
| [Solved distribution, phone](correct-group-phone.png) | 390 × 844 | The same feedback on a narrow screen. |

The gallery/assignment browser suite measures all 24 tiles in both views, compares widths and heights across views, checks for clipped content and opens the actual friend filters and puzzles. The full review suite checks that solved tasks do not add a check badge. The feedback suite exercises native mouse, touch and keyboard placement, retries and partial-work restoration. Exact-revision compatibility checks preserve previous decisions only for unchanged tasks across the recorded presentation pairs.
