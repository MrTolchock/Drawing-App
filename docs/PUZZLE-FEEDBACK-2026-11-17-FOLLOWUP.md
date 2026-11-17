# New review comments — 17 November 2026, follow-up 9.3.91

Read-only source: `puzzle-review-data` commit `2928a99328fece057a991d42e345f4d943537ead`, `reviews.json` blob `387d278bfcc440a7b342347855402988f9035367`. Notes are included regardless of approved/improve status; explicit deletion markers are respected. The prior [9.3.89 pass](PUZZLE-FEEDBACK-2026-11-17.md) remains historical. Production decisions, notes and deletion markers are never edited by this release.

| Stable key | New feedback | Implementation |
| --- | --- | --- |
| `friends-hedgehog/riddle-10` | Frage macht keinen Sinn, mache Eichhörnchen eine Nuss in Hand | A dedicated canonical `squirrel-nut` picture visibly holds one acorn in both forepaws. The same stable question «Wer hält eine Nuss?» now uses this true pictured answer; the ordinary sitting squirrel in other tasks stays unchanged. |
| `friends-fish/count-0` | Wie bei nuss, korb passt nicht in rstliche grafiken, neu zeichnen | The hand-drawn empty basket replaces both hard-coded geometric basket SVGs and is shared by zero counting and zero numeral tracing. Fische zählen itself is retired by the later general comment below. |
| `friends-deer/riddle-0` | Besser see oder fluss anstatt einfach wassertropfen | The swimming habitat is now a recognizable pond with horizontal water, banks and reeds, rather than a droplet. |
| `friends-deer/riddle-22` | Zeige teich anstatt wassertropfen | Uses the same real pond picture. Habitat distractors in this puzzle use the pond too; watering/drinking pictures elsewhere remain water droplets. |
| `puzzle:friends-fish` | Lösche rästel weil gibt schon nüsse zählen und dinge am bach die gleich sind | Removed from the active library, catalogue, spoken instructions, review/gallery and new invitations: **31 active puzzles, 958 iterations** remain. Existing saves/records are retained. A pending Fisch invitation is retargeted without changing its letter/session progress or world position. Fisch stays a world neighbour. |
| `friends-badger/riddle-23` | Frage ersetzen | Replaced by «Was wächst aus einer Eichel?» with a tree as the sole correct picture and cloud/snowman distractors. The topic remains plant growth; the stable iteration ID is retained. |
| `puzzle:friends-squirrel` | Nüsse rückgängig machen, die waren besser vorher. Leerer korb bei der zahl 0 war das problem, dieser passt nicht | Restored the original `forest-objects.webp` and its original editable source/manifest from `44130c3`, including the preferred original counting acorn. All other cells already matched that version. The actual zero-task issue is fixed with the new painted empty basket. The portrait and corrected house from 9.3.89 remain. |
| `puzzle:friends-beaver` | Reihen sind immer kreis, dreieck und quadrat … besser … zwei dreiecke und ein kreis … | Checked the repeated general comment against current definitions: all 25 matrices already have a two-plus-one shape distribution established by the first two rows, with changing row order. Existing uniqueness/completion tests remain; no unnecessary second Biber redesign. |

## Artwork and storage

[The actual generation record](../design/artwork/generation-records/review-nature.json) retains the full request, canonical animal/object reference pixels first, the prior squirrel composition reference, source PNG and SHA-256. The [packing manifest](../design/illustrations/review-nature.json) places `empty-basket`, `habitat-pond` and `squirrel-nut` in a 2 × 2 transparent atlas; the fourth cell is empty. All three are registered in the central image library and included offline. The original counting-nut atlas is restored byte for byte rather than reconstructed or regenerated.

The shared basket renderer updates zero quantities consistently, including Zahlenspuren. Changed task/presentation revisions are regenerated for normal human review; this deployment grants no editorial approvals. Historical review entries for the retired puzzle remain in the independent GitHub data branch.

## Verification

Model regressions cover the explicit revised task/answer pairs, fish retirement, all 30 successive invitation choices when no approvals are available, and old Fisch saves across all six letter phases without losing progress or position. Existing suites validate review, layout, transparent PNG exports, letters and saves using disposable storage and intercepted GitHub APIs. Actual phone/tablet screenshots accompany the release evidence.

[Actual phone/tablet evidence](../design/evidence/2026-11-17-review-followup/README.md) shows the restored nuts, painted zero basket, held nut, pond, growth question and shared zero tracing context. The 130-iteration review run, native input for all 31 puzzles, complete letter journey/offline flow, every puzzle layout at both widths and all 41 transparent PNG exports passed. No additional undeleted comments appeared on the final pre-publication read.

All 137 model tests and the final style, image-library, generator-handoff, catalogue, design/offline and whitespace checks passed. The restored counting-nut atlas is byte-identical to `44130c3`.
