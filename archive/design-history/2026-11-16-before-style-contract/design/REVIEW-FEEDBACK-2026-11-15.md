# Review feedback — 15 November 2026

Source: [the shared review file](https://github.com/MrTolchock/Drawing-App/blob/puzzle-review-data/reviews.json), blob `d81c6130cc42f9ea5fe8127d37989559d443811e` (817 entries). The file was fetched again after the changes; its SHA and comments were unchanged. All 26 new comments were applied. Notes describing an entire puzzle were treated as requirements for its complete pool and interaction.

| Puzzle | Requested correction | Result and scope |
| --- | --- | --- |
| Tierrätsel | Fox drawing differs; too difficult for first grade | A new drawn fox without a scarf matches the wildlife references. All 25 clues are short, concrete and use two animal pictures; all answers and distractors remain Swiss woodland wildlife. [Phone](evidence/2026-11-15-review-feedback/hedgehog-390.png) |
| Tierwörter lesen | Nest/egg and mushroom are not animals | Replaced every non-animal in the 25-word pool, including distractors, with fox, duck and squirrel pictures. |
| Naturrätsel | Remove “neben Wasser”; flower is ambiguous with the rose | The growth question is shorter. The final item asks what is harvested from a pear tree and shows a pear. |
| Äpfel rechnen | Remove the animals and center apples | Both groups contain centered apples and their quantities, with the shared host portrait above the task. [Phone](evidence/2026-11-15-review-feedback/add-390.png) |
| Naturdetektive | Dog smelling; butterfly tense; sheep wool; giraffe reach; lion voice; camel drinking; beaver teeth | All seven flagged clues use the requested meaning and present tense. The camel clue distinguishes drinking from water needs; the beaver actively fells trees with its teeth. |
| Glühwürmchen sammeln | Show “Hier sollen 5 leuchten”; remove lantern | The target number is in that sentence, with no lantern or duplicated number in the task. Every quantity uses the same format. |
| Waldpicknick | Remove plates; distribute berries with drag and drop | Individual berries move from the bank to a friend, back, or between friends. All 25 distributions use the interaction. Touch, mouse, pen and keyboard use the same saved counts. [Phone](evidence/2026-11-15-review-feedback/picnic-390.png) · [Tablet](evidence/2026-11-15-review-feedback/picnic-1080.png) |
| Nüsse verdoppeln | Delete puzzle | Removed from active inventory, finite pool, renderer dispatch and current catalogue pages. Historical save data remains intact. |
| Waldwerkstatt | Delete complete puzzle | Removed from active inventory, finite pool, renderer dispatch and current catalogue pages. Historical save data remains intact. |
| Silben klopfen | Count syllables without tapping | Renamed to **Silben zählen**. All 35 items show the word/picture and number choices; no drum, tally or tapping/reset controls. |
| Waldpost | Remove reset arrow; consistent, larger direction buttons | Four 60 px buttons use one identical SVG arrow, rotated for each direction. No reset arrow. [Phone](evidence/2026-11-15-review-feedback/robot-390.png) |
| Was kommt zuerst? | Drag and drop | All 25 stories use three destination slots. Cards can be placed, moved and swapped after an incorrect order; keyboard selection/placement remains available. [Phone](evidence/2026-11-15-review-feedback/sequence-390.png) · [Tablet](evidence/2026-11-15-review-feedback/sequence-1080.png) |
| Waldschatz | Answer pictures as large as the top row | Both rows use one shared picture dimension at each viewport size. [Phone](evidence/2026-11-15-review-feedback/treasure-390.png) |
| Zahlennachbarn | Remove “Mitte/davor/danach” headings and houses | Three simple number cards replace the houses; accessible control names retain their purpose. |
| Beeren vergleichen | Remove “Hier sind mehr” | Removed from every visible berry group. The question and equal option remain. |
| Waldspiegel | Selected right cells need the same leaf as the left | Fixed the zero-size picture inside buttons. Reference and answer cells now use the same leaf, size and placement. [Phone](evidence/2026-11-15-review-feedback/mirror-390.png) · [Tablet](evidence/2026-11-15-review-feedback/mirror-1080.png) |
| Waldumfrage | Delete puzzle | Removed from active inventory, finite pool, renderer dispatch and current catalogue pages. Historical save data remains intact. |

Earlier comments remain addressed: owl tasks have one sentence and two pictures of one animal, the dog anatomy correction is retained, beaver matrices have three distinct rows and circle/triangle/square, reversed rhyme pairs do not count twice, and hedgehog distractors use local wildlife. Bulk-confirmation notes are retained as editorial history, not interpreted as new content requests.

The active library now contains **31 puzzles and 953 iterations**. Changed puzzles reopen for review through their new revisions; no editorial approvals were generated and the shared ledger was not rewritten.

## Approval bug

“Nüsse zählen” had lost confirmation because the former implementation fingerprint included unrelated puzzles and whole artwork atlases. Revisions now follow each puzzle's selected renderer/helpers, relevant CSS, portraits, fonts and decoded picture cells. A change to another puzzle or another atlas cell preserves its review.

Verified historical source snapshots restore existing compatible decisions without changing their timestamps, notes or inspection evidence and without an editing token or outbox. The latest compatible published decision wins; a rejection wins equal timestamps. Current legacy snapshots include main's existing mixed-case reading behavior. Unknown or altered content remains pending. See [review storage](../docs/REVIEW-STORAGE.md).

The fresh-browser check used a read-only copy of the published review file: all 25 squirrel iterations and the puzzle restored as approved, with zero writes. Reload and offline recovery retained the decisions, and a later rejection in the intercepted test server blocked release. [Restored squirrel review](evidence/2026-11-15-review-feedback/restored-squirrel-390.png).

## Validation

The real renderer suite solved all 953 finite iterations, exercised native touch/mouse input for all 31 puzzles at phone/tablet sizes, and passed whole-pool review, optional rejection, save retry, celebration, persistence and offline review. The 31 × 2 layout audit passed. Targeted tests verified dragging, returning/swapping, cancellation, keyboard placement, matching picture dimensions, visible mirror leaves and saved partial work across reload. Installed-app tests passed upgrade from 9.3.71, active-puzzle/dialog protection, retained local/IndexedDB data, failed-download recovery and offline reload.

These checks verify implementation and continuity. Changed revisions still require the owner's editorial review.
