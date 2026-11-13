# Local gameplay log for AI analysis

Open **Einstellungen → Lokales Spielprotokoll → Protokoll für KI exportieren**. This downloads a JSON file for analysis in an AI tool of your choice. The game does not send gameplay records to GitHub or an AI service. The separate [editorial review ledger](REVIEW-STORAGE.md) still uses GitHub.

There is no manual **Spielstand sichern** control. The small automatic journey state retains the current letter, remaining parent allowance, shuffled order, unfinished questions and settings. It prevents a refresh from granting extra letters or discarding an interrupted task. Historical storage keys/data remain intact. This operational state is separate from the analysis log.

## What the log records

- Real child play: puzzle/run/visit IDs, exact iteration IDs and revisions, actual selected answers, explicit correct/retry outcomes and foreground task times.
- Rules requested, resets, reinspection and task-button actions, including input method and button size. Cancelled touch gestures are recorded separately from wrong answers.
- Handwriting: authored target strokes, stroke starts/completions, missed starts, off-path pauses and early releases. No child's finger/stylus path, drawing, image or audio is recorded.
- Flow: letters, friend visits, unavailable/wrong friends, map use, virtual-forest movement destinations, route failures, courier distance, home/sleep, app pauses and interrupted/resumed tasks.
- App/content versions, current journey and coarse viewport/text-case context help separate content changes and input/layout problems.

Owner review previews never produce child puzzle observations. Development play is marked and excluded from outcome summaries. Old log records remain readable but records without an attributable run/task do not enter new puzzle statistics. No child name, age, account, physical location, image or sound recording is collected.

## Export format

`format: "farbtupf-play-log"`, `schema: 2` contains:

| Field | Purpose |
| --- | --- |
| `events` | Ordered observations with timestamps, sequence IDs and page/journey/run/visit correlation |
| `definitions` | Exact observed question definitions keyed by iteration ID and revision; includes competence, difficulty, rule and expected answer/configuration |
| `summary.puzzles` | Runs, visits, completed runs, explicit wrong-answer checks, rule requests, resets and input/trace issues, separated by puzzle revision |
| `summary.iterations` | Observed/completed runs, explicit wrong checks, median active time and eligible choice-question first-try rates |
| `summary.flow` | Journey/letter, map, wrong-friend, route and storage counts |
| `retention` / `storage` | Data coverage, truncation and whether observations reached local storage |
| `analysisGuide` | Scope, timing definitions, questions and interpretation limits for an AI reader |

The canonical question is stored once. An `iteration_presented` event includes its actual shuffled choices/order and any restored partial work. `puzzle_attempt.selected` is the selected value for choice tasks, or the current configuration/control for a multi-action task. World coordinates describe the fictional forest, not a real location.

Active milliseconds use the monotonic foreground clock within a visit, excluding hidden-tab time, open dialogs, the 900 ms correct-feedback interval and celebration. Thinking or unattended time while the task remains visibly open is included. Partial visits are combined for an observed completed run/iteration; background wall-clock gaps are not response times. A paused visit is not proof that a child abandoned the game.

First-try rates are offered only for choice questions whose beginning was observed. Construction/tracing completion does not imply a flawless first attempt; examine its actions and stroke issues. Use sample counts, exact revisions and input context before recommending changes. Logs support improvements to flow/content and fixed difficulty; they do not diagnose a child or automatically change difficulty. Any proposed puzzle/content/difficulty changes still follow the [adult review process](PUZZLE-REVIEW.md).

## Persistence and limits

The existing device-local key `farbtupf.friends.v1.log` is upgraded compatibly. Development/alternate-world namespaces remain separate. The log survives refresh/offline use in that browser. A different browser or deleting site data starts with a different local log; only an exported file remains after deleting local data.

Records are bounded to **7 days, 10,000 events and 750,000 storage characters** (about 1.5 MB in UTF-16 localStorage). Oldest observations and unused definitions are removed when a limit is reached. The export reports truncation and dropped counts so missing coverage is not mistaken for success or failure. Key puzzle outcomes persist immediately; routine actions are batched briefly and flushed on page hide/export. Storage failures never roll back gameplay; memory observations remain exportable and Settings reports the storage issue.

**Protokoll löschen** clears only observations, after confirmation. It does not restart the journey, alter parent limits, clear unfinished questions or change GitHub puzzle approvals.

## Validation

`tests/play-log.test.cjs` covers durable exports, version/definition fidelity, active-time exclusions, interrupted visits, retention/size, legacy migration, meaningful summary rates and storage failure isolation. Browser checks cover real answers, writing, review exclusion, local refresh/offline retention and the actual Settings download.
