# Puzzle blueprint and review milestone

Date: 12 November 2026. App: 9.1.0. Branch: `feat/puzzle-blueprint-review` (not main).

The shared Waldbuch clearing, cream paper, master-cast portraits, wooden answer cards, Andika, five-leaf progress, manual explanation and final wreath remain the visual baseline. No frozen reference was overwritten. The new adult workbench uses the same paper and portraits; its inspection/decision panel is below the actual game, outside child play.

## Evidence

- [Review catalogue, tablet](review-catalogue-tablet.png): per-puzzle competence and sign-off counts; no shipped approvals.
- [Addition, tablet](add-tablet.png) and [phone](add-phone.png): unchanged child puzzle renderer, five progress leaves and manual rule explanation; adult controls follow below.
- [Letter preview, phone](trace-phone.png): full-size writing paper with numbered starts and direction guides. The separate adult panel does not collapse the paper.
- [Digit quantity cue, phone](digit-phone.png): the full illustrated quantity fits in the writing cue.
- [Colour sentence, phone](colours-phone.png): equally sized compound picture answers in the same page style.

Tablet: 1080 × 810; phone: 390 × 844, Chromium touch emulation and reduced motion. Initial earlier layout passes also used 1024 × 900. Screenshots show disposable test review data; they do not approve content for the owner.

## Verification

- `node --test tests/*.test.cjs`: all 19 model/content/save suites passed. The new review suite contains eight checks for finite content/artwork/solutions, sample/restoration/history, prerequisites, backups, revision changes, old snapshots, storage failures and generated GitHub pages.
- `FARBTUPF_UI_ONLY=1 FARBTUPF_SCREENSHOTS=0 node tests/puzzle-rounds-browser.cjs`: all 34 tablet/phone routes, all 170 answers with actual inputs, retries, saved board work, host rotation, five-task celebrations, menu returns and offline assets passed.
- All 960 non-writing iteration solutions were exercised in the exhaustive review browser pass. The focused repaired-preview pass completed all 58 letter and 30 digit iterations with every stroke checked, plus all rocket, reflection and syllable-assembly variants. Together these cover all 1,048 iteration definitions.
- The review browser workflow passed the actual adult gate, individual approve/improve actions, export/import, unchanged child saves, all 34 phone/tablet previews, a real puzzle checklist sign-off, click audio/mute, a five-task child celebration, persisted improvement flags and offline review.
- A direct phone check confirmed all nine quantity pictures fit in the digit cue (64 × 64, no scroll overflow), and the full page stays within 390 px.
- `node tools/puzzle-catalogue.cjs --check`: generated catalogue and exact implementation revision current.
- `python3 design/forest-friends/visuals/check-baseline.py`: all 14 frozen reference files intact.

## Intentional changes and remaining owner review

Each puzzle now has a finite inspectable pool of at least 25 items. Some pools use a wider explicitly documented content boundary or partially filled boards. Every addition and difficulty change requires editorial review. Digit variety pairs each of the ten forms with three distinct illustrated quantity contexts. Original friend snapshots remain untouched; new active-library rounds share one snapshot format. Older seeded sessions are preserved separately rather than silently substituting unreviewed questions.

Nothing is preapproved. The owner must inspect and sign off every current iteration and puzzle checklist on the intended device/origin. Decisions are local, with export/import backups. Physical iPad 9 Safari/PWA, comfort of sound, touch/stylus feel and suitability for the children remain owner checks. This branch has not been merged or deployed to the main GitHub Pages site.
