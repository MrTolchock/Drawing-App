# Puzzle feedback from 15 November 2026

Recovered from [the GitHub review ledger](https://github.com/MrTolchock/Drawing-App/blob/puzzle-review-data/reviews.json), content blob `88a09337c3d112c2774a9352733982172d352e5b`. The date is **15 November 2026 in Europe/Zurich**; the source timestamps are stored in UTC. All 26 notes are included, even when their graphics revision is no longer current.

Most requested fixes already existed before this follow-up. They were checked against the current artwork and real phone/tablet task renderer; the two remaining content gaps and restoration of older notes are addressed in 9.3.86. This table records feedback and implementation evidence, not editorial sign-off.

| Stable iteration ID | Original feedback | Current outcome |
| --- | --- | --- |
| `friends-hedgehog/riddle-11` | Der fuchs hat einen anderen zeichenstil | Verified: the answer uses the existing canonical `forest-fox` learning picture; no new image or style introduced. |
| `friends-hedgehog/riddle-24` | Generell ist dieses puzzle extrem schwer für ein kind in der ersten klasse wenn möglich vereinfachen | Improved in 9.3.86: all 25 clues have at most six words and refer to visible colours, markings, anatomy or the drawn pose/object. Replaced lifecycle/behaviour recall and the ear-tuft metaphor; retained two picture choices and all stable IDs. |
| `friends-frog/animal-3` | Ei im nest ist kein tier | Verified: the task is Schnecke and every answer/distractor in this puzzle is an animal; no egg/nest object. |
| `friends-frog/animal-7` | Pilz ist kein tier | Verified: the task is Raupe; mushrooms and other non-animal distractors are absent throughout the puzzle. |
| `friends-badger/riddle-16` | Was braucht eine pflanze zum wachsen reicht, neben wasser muss man nicht sagen | Verified: «Was braucht eine Pflanze zum Wachsen?»; removed the unnecessary water clause. |
| `friends-badger/riddle-24` | Selbe blüte ist rose auf anderen rätseln drum funktioniert hier nicht | Verified: replaced the ambiguous flower/rose question with «Was ernten wir vom Birnbaum?» and a pear picture. |
| `add/1-2` | Entferne tiere auf feldern jeweils und setze äpfel ins zentrum | Verified in the real renderer: centred apple groups and no animal on either field. |
| `nature/clue-4` | Meine nase riecht sehr gut ist falsch, besser ist ich kann gur riechen | Verified: «Ich kann gut riechen.» |
| `nature/clue-11` | Plötzlich vergangenheitsform, bleibe bei präsens | Verified: the butterfly clues use the present tense. |
| `nature/clue-14` | Ich trage wolle ist komisch, ändern. | Verified: «Ich habe weiche Wolle.» |
| `nature/clue-17` | Hohe blätter ist komisch, besser wäre ich erreiche hohe bäume | Verified: «Ich erreiche hohe Bäume.» |
| `nature/clue-18` | Form ändert sich, zuerst ich form, dann unpersönlich. Besser einfach sagen ich habe eine mähne | Verified: «Ich habe eine Mähne.»; both clues remain in the first person. |
| `nature/clue-20` | Nicht ohne wasser auskommen, sondern ohne zu trinken | Verified: «ohne zu trinken», not without water. |
| `nature/clue-24` | Mit meinen zähnen fälle ich bäume | Verified: «Mit meinen Zähnen fälle ich Bäume.» |
| `rocket/5-3` | Hier sollen 5 leuchten und diese laterne braucht es im rätsel nicht | Verified: the requested total is five; no lantern is drawn into the task. |
| `picnic/2-2` | Teller sieht schlecht aus, braucht es auch nicht. Verteile beeren mit drag and drop. | Verified with native mouse/touch: drag one berry per gesture, move between friends, return to the bank, cancel safely and retain partial work. No plate picture. |
| `double/2-1` | Lösche dieses rästel | Verified retired: no active catalogue entry, finite iterations or spoken instruction. |
| `shapes/4-0-1` | Lösche dieses puzzle komplett | Verified retired: no active catalogue entry, finite iterations or spoken instruction. |
| `syllable/word-6` | Das klopfen braucht es nicht, einfach nur silben zählen | Improved in 9.3.86: every finite task and the fallback generator say «Wie viele Silben hat das Wort?»; spoken instructions already count syllables directly. No drum/clapping controls. |
| `robot/0-3` | Revert pfeil braucht es nicht. Pfeile sehen nicht identisch aus auf tasten, einige sind dünner. Tasten etwas grösser machen | Verified: no reset arrow; four identical SVG arrow shapes rotated for direction, with 60 px controls. |
| `sequence/story-2` | Mache drag and drop | Verified with native mouse/touch and keyboard: drag cards into places and swap them to correct a wrong order; partial order is saved. |
| `treasure/0-1` | Würde schöner aussehen wenn bilder unten gleich gross sind wie obere reihe | Verified: upper-row and answer pictures use the same dimensions at phone/tablet sizes. |
| `neighbours/1-left` | Überschriften mitte davor usw. braucht es nicht. Diese häuschen um zahlen herum sind auch etwas komisch, anders machen | Verified: rectangular number cards, no house-shaped frames and no repeated position headings. |
| `compare/1-1` | Hier sind mehr text braucht es nicht | Verified: redundant explanatory text is absent from both quantity choices. |
| `mirror/grid-146` | Angeklickte felder sollten gleich aussehen, jetzt haben aber nur diese links ein blatt drauf und rechts nicht | Verified: selected right-hand cells contain the same leaf drawing as the left-hand reference. |
| `survey/survey-0` | Lösche dieses rätsel | Verified retired: no active catalogue entry, finite iterations or spoken instruction. |

## Notes survive graphics changes

A fresh browser now restores notes from all GitHub ledger revisions and its history into the read-only local history, rather than retaining only the selected current record. The puzzle details show **Bisherige Hinweise**, including original dates, a **Frühere Version** label where appropriate and a link to inspect the current iteration. Repeated refreshes deduplicate the same record, and notes remain available offline. The section also refreshes when only historical notes change.

Restored notes never become current approvals or uploaded decisions. Existing review statuses, exact revisions, inspection evidence and the remote `puzzle-review-data` branch remain unchanged. Only the changed hedgehog and syllable definitions require a new review; the other 30 puzzle revisions remain unchanged. Original artwork is reused.

## Validation

Model tests cover short, visible-only clues, all-animal choices, retained wording/removals, syllable counts, historical-note recovery on fresh/offline devices, idempotent refresh and the exact-revision release gate. Browser checks cover native touch/mouse drag/drop and cancellation, keyboard alternatives, matching quantities/picture sizes, current controls and historical notes linked to the current task at 390 px and 1080 px. Normal review/synchronization, child save isolation, design checks and installed-app updates use the existing suites.
